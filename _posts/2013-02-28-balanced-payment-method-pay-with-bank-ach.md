---
layout: post
author: Jareau Wade
title: "Balanced Adds New Payment Method: Pay with Bank Account"
tags:
- balanced
- ACH
- processing
- bank account
- payments
- feature announcement
---

## Introducing: Balanced Bank Payments

[Balanced Processing](https://www.balancedpayments.com/# processing) has always supported payments from major credit/debit cards, but we're happy to announce that your buyers can now pay with any valid US-based bank account. We're calling this new functionality "Balanced Bank Payments," and we'll be rolling out limited beta invites starting today. <a href="mailto:support@balancedpayments.com?Subject=Bank%20Payments%20Beta%20Access%20Request">Contact</a> us to request access.

### The one and only
Bank Payments, offers developers something no other payment processor does: a white-label, RESTful API for bank account payments. Buyers don't need to be redirected away from your website or app, and they won't be required to create a Balanced account to pay with their bank account. We've even added [bank account verification helpers](https://www.balancedpayments.com/docs/api?language=bash#bank-account-verifications) to our API, to save you the hassle of managing micro-deposit verifications yourself. No one else provides an on-site, white-label ACH/bank payments API -- not PayPal, Braintree, Stripe, nor WePay, not even Dwolla. 

### How it works
Balanced Bank Payments uses the [ACH network](http://en.wikipedia.org/wiki/Automated_Clearing_House) to debit a buyer's bank account. Here's how it will work:

1. A developer will use the Balanced API to build a form on their website to collect a buyer's bank account info
2. The buyer inputs their bank account information -- no redirect or external account creation -- and Balanced tokenizes the data via the same [PCI compliant process](https://www.balancedpayments.com/docs/overview?language=bash#tokenizing-sensitive-information) used to accept credit card data
3. Balanced [provides](https://www.balancedpayments.com/docs/api?language=bash#bank-account-verifications) the developer micro-deposit helper functions to verify the ownership of the bank account
4. Once the account is verified, Balanced notifies the developer they can now charge the buyer's bank account

__No redirects:__ Buyers can checkout via Balanced Bank Payments without ever leaving your site. Dwolla and WePay by comparison require a buyer to enter their bank account information on the Dwolla and WePay websites, respectively.

__Cost:__ The developer pays Balanced 1% + 30¢ per bank payment.

### This is the ACH API developers have been waiting for
The idea for Bank Payments, it's spec, common uses cases, and even the pricing structure were developed in open conversation with our developer community in a public [Github issues thread](https://github.com/balanced/balanced-api/issues/2). We even built a []preliminary version of the API](https://github.com/balanced/balanced-api/tree/ach) and showed it off to get feedback. We came to the conclusion that we couldn't support ACH/bank payments for the price proposed --25¢-- so we shelved the product for a few months, but community interest resurged on the github issue, with some customers saying they'd pay 1% per transaction. That worked for us, so we built it. Hope you like it. 

### How to request access
We'll be rolling out invites to a limited beta of Bank Payments over the next few weeks. If you'd like to request access please email us: support at balancedpayments.com. Include "Bank Payments Beta Access Request" in your subject.

- --
Earlier this week, we launched same-day payouts for all Wells Fargo customers. Check it out [here](http://blog.balancedpayments.com/introducing-balanced-same-day-payouts-wells-fargo/)!
