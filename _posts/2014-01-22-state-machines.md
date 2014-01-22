---
layout: post
author: Marshall Jones
author_image: /img/authors/marshall_jones.png
title: "State Machines - How Balanced controls funds flow"
image: /img/blogimages/2014-01-24.jpg
cover_image: /img/blogimages/2014-01-24-cover.jpg
tags:
- balanced
- engineering
---

## State machines - How Balanced controls funds flow

In our [previous blog post about the Ledger](http://blog.balancedpayments.com/the-ledger/) we talked about how balanced (little 'b' denoting the app rather than Balanced the system/business which spans many applications) is at its heart an accounting app.

Sitting "above" the Ledger are Transactions. With balanced a Transaction represents a flow of funds to or from a Marketplace's [escrow account](https://docs.balancedpayments.com/current/overview.html#escrow) to another Funding Instrument such as a [bank account](https://docs.balancedpayments.com/1.1/api/bank-accounts) or a [credit card](https://docs.balancedpayments.com/1.1/api/cards/). A transaction has a few core attributes and looks like this when represented as a database table (via a [SQL Alchemy declaration](http://docs.sqlalchemy.org/en/rel_0_9/orm/extensions/declarative.html)):

{% highlight python %}
transactions = Table(
    'transactions', metadata,
    Column('guid', Unicode, primary_key=True),
    Column('type', TransactionType.db_type(), nullable=False),
    Column('amount', Integer, nullable=False),
    Column('state', TransactionState.db_type(), nullable=False),
    Column('source_funding_instrument_guid', Unicode(34),
           ForeignKey('funding_instruments.guid'), nullable=False),
    Column('destination_funding_instrument_guid', Unicode(34),
           ForeignKey('funding_instruments.guid'), nullable=False),
    Column('ledger_guid', Unicode(34), ForeignKey('ledger.guid')),
)
{% endhighlight %}

As you can see, a transaction has a couple of interesting properties:

* `type` - in balanced this is a credit, debit, refund, or reversal.
* `amount` - where would be we if we didn't record how much value each Transaction represents?
* `state` - the current state of the transaction. Each Transaction starts in a PENDING state, and transitions from there through to SUCCEEDED if everything goes well or FAILED if it doesn't.

There's also a few additional columns I included to help you visualise a Transaction, they include the source and destination of funds. They are not very important for this article.

The core issue that we need to solve is only allowing a Transaction to move into a particular state if balanced says that's a legal transition. To do this, we employ a [state machine](https://en.wikipedia.org/wiki/Finite-state_machine). By using a state machine to regulate these transitions we can simply write logic to perform operations when certain states are met. E.g. we want balanced to credit funds to a Funding Instrument when a Transaction succeeds, but not when it fails.

Let's look deeper at the `state` field. I mentioned earlier that every Transaction begins in a PENDING state. At this point no funds have been transferred from one Funding Instrument to another, the Transaction is purely a glimmer in its parents eye when it's in this state. That's not very useful to us, let's look at what we need to do to transition from the PENDING and actually move some funds:

1. The Transaction needs to move from the PENDING state to a SUBMITTING state. This lets balanced know that that we are actively operating on the transaction and locks any other entities from operating on this Transaction.
1. Once it's in the SUBMITTING state we can submit its information to our processor (at Balanced we have a processing service called precog) and wait for the result of this operation to come back. The processor will return us a state field or if something goes wrong it will throw an exception which balanced can catch. Depending on the state of the result as few things may happen:

    1. If the processor tells balanced is succeeded then we can transition the state of our Transaction to SUCCEEDED (this is what happens for a credit card capture)
    1. The processor can tell us the transaction is PENDING. For example, ACH debits are an offline operation. A PENDING state means that we have submitted this information to the bank for processing but the bank hasn't yet told us if it was able to successfully debit the bank account or not. In this case balanced will transition to, you guessed it, a SUBMITTED state!
    1. If the operation failed (or threw an error) then balanced will move the Transaction to a FAILED state. Simple huh?

So let's look at what happens when we transition between those states, let's understand how balanced knows if and when to move funds between the various Funding Instruments involved in the transaction. balanced uses two state machines to control this. The first, which is implemented on the Transaction class, controls the state transition of a Transaction. The second, which is implemented in a class balanced internally calls a ReconcileSink and controls when balanced actually moves the funds to or from a Funding Instrument. Before we begin, I recommend getting familiar [the basic concept of a state machine](https://en.wikipedia.org/wiki/Finite-state_machine).

Here's what the Transaction class in balanced looks like (minus a ton of code not relevant to this article):

{% highlight python %}
class Transaction(Base, AuditMixin, processors.ReconcileMixin, DeferredMixin):

    def reconcile_for_state(self, state):
        """
        """
        if state == self.state:
            logger.info('%s state %s unchanged', self, state)
            return False
        prev_state = self.state
        if state not in self._reconcile_dfa[prev_state]['to']:
            raise Exception('{} cannot transition to {}'.format(self, state))
        updated = self.reconcile_update(state)
        if not updated:
            logger.info('%s cannot reconcile to %s', self, state)
            return False

        on = self._reconcile_dfa[state]['on']
        if on:
            on(prev_state)
        return True

    @property
    def _reconcile_dfa(self):
        return {
            self.states.PENDING: {
                # where i can transition to
                'to': [
                    self.states.SUBMITTING,
                    self.states.SUCCEEDED,
                    self.states.FAILED,
                ],
                # called when transitioning to me
                'on': None,
            },
            self.states.SUBMITTING: {
                'to': [
                    self.states.SUCCEEDED,
                    self.states.FAILED,
                ],
                'on': self.reconcile_submitted,
            },
            self.states.SUCCEEDED: {
                'to': [],
                'on': self.reconcile_succeeded,
            },
            self.states.FAILED: {
                'to': [],
                'on': self.reconcile_failed,
            },
        }

    def reconcile_succeeded(self, state):
        # credit funds to Funding Instrument
        Ledger.credit(self.destination_funding_instrument, self.amount)

    ...
{% endhighlight %}

This implementation allows us to move the state of a Transaction to SUBMITTING by calling `transaction.reconcile_for_state(SUBMITTING)` and if it's a legal state transition then balanced will comply. To determine legal state transitions this implementation uses [deterministic finite automaton](https://en.wikipedia.org/wiki/Deterministic_finite_automaton). The logic for what to do when a Transaction transitions to the SUBMITTING state only needs to be written in the `reconcile_submitted` method, the state machine ensures that this method is only called once.

We could then write some code to utilize this state machine which could look like

{% highlight python %}
# initial state of the transaction is PENDING
transaction = Transaction(type=DEBIT, amount=100, source=bank_account, destination=escrow_account)
transaction.reconcile_for_state(SUBMITTING)
# we've locked the transaction, now let's submit it to the processor
try:
    result = processor.debit(transaction)
except:
    transaction.reconcile_for_state(FAILED)
else:
    if result.succeeded:
        transaction.reconcile_for_state(SUCCEEDED)
    else:
        # assuming result.state maps to balanced's internal states for txns
        transaction.reconcile_for_state(result.state)
{% endhighlight %}

In reality it's slightly more complex, balanced contains several more states and has a concept of optimistic and pessimistic funds transfers which are managed in a process we call reconciliation, this is where the ReconcileSink class comes in. The ReconcileSink is a second state machine that is registered against the state transitions on the Transaction class. Examples of the differing behavior controlled by the ReconcileSink are:

* A credit requires the funds to be removed from the source escrow account immediately, before the Transaction reaches the SUCCEEDED state.
* A debit however, requires the funds only to be credited to the destination once the SUCCEEDED state is reached.

By using this state machine implementation and controlling the `reconcile_for_state` logic for each state transition we're able to ensure funds are only transferred when they are supposed to be. An example of how we register specific reconciliation logic to a particular transaction type looks like this:

{% highlight python %}
class LedgerSink(InjectFundsMixin, Debit.reconcile_sink.Pessimistic):
    pass
{% endhighlight %}

Here we are registering a pessimistic (only completes the transfer of funds once it reaches the SUCCEEDED state) sink on a Debit (which inherits from the Transaction class) to the InjectFundsMixin. We briefly described the InjectFundsMixin in our article about [the Ledger](http://blog.balancedpayments.com/the-ledger/) where you can see that it will call the `credit_funds` method on the destination Funding Instrument on the SUCCEEDED state transition.

Conversely, the LedgerSink for a Credit looks like:

{% highlight python %}
class LedgerSink(EjectFundsMixin, Credit.reconcile_sink.Optimistic):
    pass
{% endhighlight %}

For a Credit, we optimistically debit at the start of the Transaction's lifecycle so the funds cannot be double spent, if the Transaction moves to the FAILED state then these funds will be credited back to the source of the Transaction. For an Optimistic reconciliation no action is taken when it transitions to the SUCCEEDED state since the funds were moved at the start of the Transaction's lifecycle.

Since Balanced began in 2012 we transitioned the state of tens of millions of transactions. If you're looking to transition careers and like working on problems like these you should [get in touch](mailto:jobs@balancedpayments.com).
