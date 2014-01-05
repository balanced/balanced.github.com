---
layout: post
author: Marshall Jones
title: "The Ledger - How Balanced records funds flow"
tags:
- balanced
- engineering
---

## The Ledger - How Balanced records funds flow

balanced (little 'b' denoting the app rather than Balanced the system/business which spans many applications) is at its heart an accounting app. As such, balanced has a few atoms which interact to model funds flow:

* Funding Instruments, which are sources or destinations of funds (e.g. a [credit card](https://docs.balancedpayments.com/1.1/api/cards/) is a funding instrument and a source of funds). A Funding Instrument can be debited, credited, refunded, and reversed (the inverse of debits and credits respectively).
* Transactions (e.g. a [Debit](https://docs.balancedpayments.com/1.1/api/debits/)), which represent the flow of funds to and from, a Marketplace's escrow account (which is a Funding Instrument).
* Grouping constructs such as Marketplaces, [Customers](https://docs.balancedpayments.com/1.1/api/customers/) and [Orders](https://docs.balancedpayments.com/1.1/api/orders/). These constructs can have many Funding Instruments and Transactions associated with them.
 
Helping tie Funding Instruments and Transactions together is the center of balanced; The Ledger. Let's take a look at what the Ledger looks like (this is a [SQLAlchemy table declaration](http://docs.sqlalchemy.org/en/rel_0_9/orm/extensions/declarative.html)):

{% highlight python %}
ledger = Table(
    'ledger', metadata,

    Column('guid', Unicode, primary_key=True),
    Column('created_at', DateTime, default=func.clock_timestamp(),
           nullable=False),
    Column('funding_instrument_guid', Unicode,
           ForeignKey('funding_instruments.guid'), nullable=False),
    Column('amount', Integer, nullable=False),
    Column('type', LedgerEntryType.db_type(), nullable=False),
    Column('reference_ledger_guid', Unicode, ForeignKey('ledger.guid')),
)
{% endhighlight %}

As you can see, it's pretty simple. The ledger table is simply a record of the Funding Instrument, an amount and the type of transaction (e.g. a credit of funds into the system). Optionally, you can link a record to its parent to denote a series of ledger entries. 

With this information balanced is able to keep track of all movements of money. To get the balance of a Funding Instrument we can simply use the following pseudo code `balance = sum(entry.amount from ledger where funding_instrument = some_funding_instrument)`

In order to make it easy for engineers at Balanced to operate on this ledger, we provide ourselves a couple of higher level methods on the Ledger class so we don't accidentally shoot ourselves in the foot and lose track of some funds:

{% highlight python %}
class Ledger(Base):

    __table__ = ledger

    @classmethod
    def inject(cls, dst, amount, reference_entry=None):
        """
        Add external funds to a funding instrument.
        """
        if amount < 0:
            raise ValueError('Amount {} < 0'.format(amount))
        inject = Ledger(
            funding_instrument=dst,
            amount=amount,
            type=Ledger.entry_types.INJECT,
            reference_entry=reference_entry,
        )
        Session.add(inject)
        return inject
{% endhighlight %}

The Ledger class provides a few additional methods; `transfer`, `eject`, `debit`, and `credit` which are used depending on where the funds are coming from or going to. A simplistic view of the flow of funds through balanced for a Card debit which is transfered to a Bank account via a credit is `card.inject` -> `card.debit` -> `bank_account.credit` -> `bank_account.eject`. This is simplified because it skips the debit and credit operations on the Marketplace's escrow account. Inject and eject entries are single sided, where credit and debit are double sided operations (e.g. for every debit there will be a corresponding credit to another Funding Instrument).

The corresponding code to initiate this flow of funds using our [ruby client](https://github.com/balanced/balanced-ruby) would be:

{% highlight ruby %}
require 'balanced'
Balanced.configure('ak-test-2IfBSMHWXU55xtQ13j9lvtK8IRjsb804g')

card = Balanced::Card.find('/cards/CC2h52tnQKGgHS7tV7gYIBuK')
bank_account = Balanced::BankAccount.find('/bank_accounts/BA1SeZEMzTHJG3kiQRkcMOkW')
card.debit(:amount => 5000)  # card.inject from VISA and then card.debit -> escrow_account.credit
bank_account.credit(:amount => 2000) # escrow_account.debit -> bank_account.credit and then bank_account.eject to the bank
{% endhighlight %}

In our code, the actual movement of funds is done using [mixins](https://en.wikipedia.org/wiki/Mixin) such as this one:

{% highlight python %}
class InjectFundsMixin(_FundsMixin):
    """
    Reconcile sink mix-in for coordinating the injection of funds into the
    system:

        class LedgerSink(InjectFundsMixin, Debit.reconcile_sink.Pessimistic):

            pass

    """

    def adjust(self, target):
        src, dst = target.source, target.destination
        inject = src.inject_funds(target.amount, target.ledger)
        debit = src.debit_funds(target.amount, inject)
        dst.credit_funds(target.amount, debit)
        target.ledger = inject or debit
{% endhighlight %}

By using mixins we can register a sink for a transaction type and the movement of funds between Funding Instruments is all taken care of when the Transaction transitions into the appropriate state for the Funding Instrument associated with it.

The Ledger provides Balanced with enough information to accurately audit the flow of funds in our system, it's important to note that the Ledger is stateless, all operations on it are atomic, immutable and it is append only. Every Transaction in balanced has a corresponding Ledger entry that is associated with a Funding Instrument and that Ledger entry will then have child entries linked to it which represent the flow of funds through the system.

Since Balanced beagn, we've added tens of millions of rows to the ledger table, it was based off of research of [existing data patterns](http://www.martinfowler.com/apsupp/accounting.pdf) and the prior collective experience of [Balanced engineers](https://www.balancedpayments.com/about). Looking to solve hard problems? [We're hiring](mailto:jobs@balancedpayments.com).