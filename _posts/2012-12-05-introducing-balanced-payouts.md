---
layout: post
author: mahmoudimus
title: Introducing Balanced Payouts
tags:
- balanced
- payouts
- ach
---

Balanced Payouts - the easiest way to pay a vendor, merchant, or seller
via next business day bank transfer via the ACH network.

## How Easy?


One `curl` [command](https://balancedpayments.com/#example):

```bash
curl https://api.balancedpayments.com/v1/credits \
    -u 7b7a51ccb10c11e19c0a026ba7e239a9: \
    -d amount=10000 \
    -d description="Math lesson" \
    -d bank_account[name]="Johann Bernoulli" \
    -d bank_account[account_number]=9900000001 \
    -d bank_account[routing_number]=121000358 \
    -d bank_account[type]=checking
```

Go ahead. This `curl` example works. Try it out in your terminal. It
hits our test servers and simulates a next-day ACH payment to a bank
account.

## Inspiration

An interesting thing about building something that people want [^1] is
instrumenting everything a customer does with your product. Essentially,
you must correlate all actions, support tickets, integration questions,
usage patterns, etc by hypothesizing convergence to a central theme.
Utiling today's powerful analytics and business intelligence systems,
it's pretty easy to figure out if what you're building is what people
want.

Balanced Payments, the payments platform for marketplaces, targets the
marketplace developers -- whom we find to be particularly interesting,
as they've had to traditionally juggle lots of moving payment systems to
operate their business. We're attempting to attack this problem by
simplifying credit card processing and distributing payouts. That's
essentially what marketplace payments are, just accepting cards on
behalf of a merchant and distributing the funds to said merchant after
some fulfillment has happened.

What we've found really interesting is that marketplace essentially
evolve in a very agile manner and as a result, most marketplaces attempt
to solve their most acute problems immediately.

What we've noticed are some incoming leads from various marketplaces who
are already processing with their favorite card processors and they
wanted to use us for payouts.

## Why is the payout solution attractive?

Well, we have very special relationships with our banks that allow us to
issue payouts next business day and we offer this as a bundled solution
for our marketplaces. We have data that this directly increases
marketplace liquidity [^2] -- something that we take VERY seriously.

Turns out, next business day payouts are very appealing, as the current
way of issuing payouts is resorting to uploading CSV files using some
arcane bank interface with an incredibly horrendous user experience.
This is something that we have had to experience ourselves and as a
result, we've had to build these systems to alert our customers of
deposit failures, incorrect bank accounts, and the countless other ways
deposits can fail.

Many of our customers were already begging us to consider offering this
as a stand alone service and so, we figured, why not?

## Introducing Balanced Payouts


The easiest way to initiate next business day payouts to your sellers,
merchants, vendors, etc.

We scratched our own itch, we've built an internal JSON API that we use
to issue next day payouts and we're exposing it to the world.

We think that you'll find this very useful and we're looking for
feedback on how to make it the best payout solution. It's part of our
open company approach. [^3]

## We're hiring!

If you think payments are interesting and you're looking to really make
an impact, shoot me an email.

Mahmoud

mahmoud [@] balancedpayments.com

[^1]: some yc link here

[^2]: something about marketplace liquidity here

[^3]: open company approach
