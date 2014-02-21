---
layout: post
author: Steve KLabnik
author_image: /img/authors/steve_klabnik.png
title: "More Details About Bitcoin"
image: /img/blogimages/2_21_2014_image_600x424.jpg
cover_image: /img/blogimages/2_21_2014_image_1020x340.jpg
tags:
- bitcoin
---

[Matin's blog post yesterday](http://blog.balancedpayments.com/bitcoin/) about
our integration with Coinbase was exactly the kind of post you want from a CEO:
short, sweet, and visionary. We received a large volume of questions asking for
more details about this integration, so today, I'd like to talk more about
the details of how this all works, and why it's only in private beta.

## At a high level

First of all, I'm incredibly excited about this, as we are the only payments
company that offers the trifecta: credit card processing, ACH debits and
credits, and Bitcoin. Many companies do one of these, but nobody else does all
three. That in and of itself is significant. We also expect most integrations
of this feature to take about half a day: the UX work of adding the button to
your checkout page is actually more difficult than the server-side portion.

Secondarily, this is a Coinbase-specific integration: buyers must use a
Coinbase wallet, and no others. This is a significant aspect of the
integration, and was decided for a few reasons. First of all, the user
experience of paying with a raw Bitcoin address is quite lacking. We want to
start off by providing the smoothest payment experience possible, because most
people still aren't familiar enough with cryptocurrencies. Integrating with an
online wallet like Coinbase provides a vastly superior, friendly UX.

Other than the UX reasons, it's important to remember that Bitcoin is
conceptually similar to cash. Paying with bitcoin from a private wallet is
roughly the equivalent of mailing a bunch of cash in an envelope to someone.
This isn't really a common way to pay via the web for a number of reasons. Put
another way, web sites don't accept US dollars: they accept Visa and
Mastercard. That the account is denominated in USD is incidental: in fact, you
can (today) have a Visa card whose account is denominated in Euro rather than
USD, but make charges in USD. Visa exchanges the currency (and charges you for
the privilege) and sends the currency the merchant wants. In a similar way,
Coinbase provides you with an account, denominated in BTC, that you can make
payments with in BTC or USD. `bitcoin-qt` doesn't have this capability, and
it's crucial: Balanced isn't set up to do escrow accounts in multiple
currencies, and many of our merchants wouldn't want to hold BTC for volatility
reasons. But they'd love to take your BTC and receive USD.

You can read [this interesting thread on /r/bitcoin](http://www.reddit.com/r/Bitcoin/comments/1ygl5v/balanced_payments_integrates_via_coinbase_enables/cfl6sqr?context=5)
between some people concerned about the Coinbase-only nature of this
integration and one of the Gittip team members. As they say:

> Until a proper and user-friendly escrow service exists, Coinbase is solving a
> real need for Gittip to support Bitcoin

Finally, Balanced is generally interested in furthering all kinds of commerce,
cryptocurrencies included. I've been gathering resources to write a whitepaper
on cryptocurrencies and their affects on the payments industry, but it's not
yet finished. You can see hints of parts of it in the preceding paragraph.
The payments industry has integrated new technologies before, and will do so
with cryptocurrencies as well.

## Technical details

First, let's review the way that you process a credit card with Balanced.

![card processing](/img/blogimages/card_process_arch_simple.png)

Here are the steps:

1. Someone visits your site's checkout page, and it links to `balanced.js`.
2. They click 'Buy', and `balanced.js` grabs the card data and sends it to our
   PCI-compliant data store. This process is called 'tokenization,' because it
   returns a unique token (a URI, in our case) that represents the card.
3. `balanced.js` submits the tokenized card URI to your servers, and you save
   it.
4. Your servers make an API call to debit the card.
5. Our API server communicates with our PCI store to let it know that the card
   should be charged. Of course, our fraud detection may stop the process here,
   but we're talking about the successful case.
6. The store converts the tokenized URI into the actual card information, and
   then communicates those credentials to the card networks. Your payment gets
   processed.

There are a few things I'm leaving out here. I'm planning on a more detailed
blog post about our architecture soon. This captures all the major, important
pieces.

Let's talk about the way that you process a Bitcoin transaction through
Balanced + Coinbase:

![coinbase processing](/img/blogimages/coinbase_process_arch_simple.png)

That's right, it's basically identical! Only two steps change:

Step two involves `balanced.js` opening up the OAuth popup to Coinbase, and
using that to get an OAuth token. This token gives permission to use the
Coinbase API to debit BTC from your Coinbase wallet, so it's conceptually
similar to credit card numbers. Therefore, after the OAuth dance completes,
`balanced.js` sends this information off to our PCI store to be tokenized
in the exact same way.

Step 4 changes slightly, as you're making a slightly different call. Rather
than making a charge with a `Card` or `BankAccount`, you're making one with an
`ExternalAccount`. You can see the API specifications for `ExternalCount`s [on
GitHub](https://github.com/balanced/balanced-api/blob/revision1/features/external_accounts.feature).
Right now, the only provider of external accounts is Coinbase.

Everything else is the same! Coinbase settles the charge to us in USD, and then
sends that USD to your Balanced escrow account. Easy peasy!

## What needs to be finished

Because Balanced operates as an open company, we try to do things out in the
open as much as possible. There are some aspects of this feature that aren't
fully baked yet, but our intention is to work through those with Gittip. Let's
talk about some of the specifics of what those are.

The first one is that using this feature requires implementing Balanced API
version 1.1. This version of the API isn't technically released yet. While the
vast majority of this new release's server side is done and works, we don't
have the documentation and client libraries done yet. That's okay for Gittip:
we [helped write the integration](https://github.com/gittip/www.gittip.com/pull/2036).
As 1.1 shapes up and becomes more broadly available, customers will be able to
implement Coinbase.

Another uncompleted aspect is that this is pay in only: you cannot pay out to
a Coinbase account. There are some interesting details here, and we hope to
do it eventually.

Furthermore, right now, you denominate the charge in USD, even though they
pay in BTC. Before it's 'done,' we'd like to be able to denominate the charge
itself in BTC, even though it settles to USD. In other words, now it's "This
costs $100 in BTC," and we'd like it to be "This costs 0.3 BTC." You can see
how this also builds a clear path for Balanced to accept non-USD currencies,
as well: most of the interface changes to make this happen will also enable
that to happen too.

This blog post also consists of all of the documentation of this feature:
we need to get all of that going before a feature can be considered finished.
Documentation is incredibly important, especially on how to test your
integration.

Lastly, there are a few small technical changes internally we need to make to
make this happen automatically on a per-merchant basis. This follows the normal
engineering practice of make it work, then make it scale. While the interface is
currently generic, it won't actually work for anyone but our launch partners.

## Conclusion

Hopefully that answers all of your questions about this integration. We'd
appreciate feedback [on the GitHub issue](https://github.com/balanced/balanced-api/issues/204)
about any and all aspects of this feature.
