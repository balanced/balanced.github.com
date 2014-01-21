---
layout: post
author: Matin Tamizi
author_image: /img/authors/matin_tamizi.png
title: "Pushing Money to Debit Cards"
image: /img/blogimages/2014-01-09.jpg
cover_image: /img/blogimages/2014-01-09-cover.jpg
tags:
- open
- crowdfunding
---

ACH bank transfers, even with all of it's warts, are a powerful way to pay a
seller on a
marketplace. The seller can receive the money the next business day. We've
accepted it for a long time since it's
certainly better than checks, PayPal, or a wire transfer. But, we could do
so much better instead of accepting what's available to us today.

I was having dinner the other night with a friend. His girlfriend doesn't
work in tech, which can be refreshing if you live in Silicon Valley. I decided
that I needed to get someone's opinion that wasn't biased by working in
payments, commerce, or in the tech industry even. I asked her what she does
if a website asks her for her bank account number and routing if they needed
to pay her. She responded, "I would call the bank and asked them." and followed
with "But, it's weird to even need to enter that information." Her response
reflects how many people think.

I reflected then about my thought process when I have to enter my bank account
information online. My checking account is at Wells Fargo who unfortunately
doesn't easily make my account number available in their online banking portal.
I have to open up a PDF statement and take the account number from there.
There's probably some security related reason for not displaying my account
number, but it certainly doesn't make my life easier.                       

Using ACH payouts is a powerful way a seller, but then you need them to enter
their bank account information—-a clearly painful process. I asked my friend's
girlfriend another question. I wanted to know what she thought about only
having to enter her debit card number to receive money. She smiled and answered,
"That's easy. My debit card is in my wallet."

I thought then about what someone can do with my bank account information.
They can debit money directly from my bank account if they have access to
an ACH debit system. That can happen with a card as well, but it's not nearly
as simple to fight an ACH debit as it is to file a chargeback. It's also
a lot harder to close your bank account and open a new one instead of just
having the bank mail you a new debit card. It's much scarier to share my
bank account information than my debit card number—-something that I put into
many sites on a regular basis.

Balanced wants to solve the problem entirely. Forget about asking people to
look up their bank account information and trust you to enter than information.
Forget about needing to wait days to even know if that's the correct account
number. We want to build an API to give marketplaces the ability to deposit
money into a seller's checking account using only the seller's debit card number
and expiration date.

It's interesting why no one has done this yet and made it readily accessible
through a simple API. It's not an easy problem to solve. It requires us
integrating into different systems and, in many cases, going over ATM networks.
The ATM networks have an additional advantage of the transfer being instant
(24 hours a day, 7 days a week). It's a hard problem, but we think it could be
worth it.

Unfortunately, Balanced doesn't have some of the same advantages as a consumer
focused company. Once we build a new feature in our API, it needs to stay.
Companies are going to build on top of it. We can't exactly rip it out if we
realize later there wasn't demand.

To test the market and our hypothesis, we're taking a novel approach. We're
asking marketplaces to show their interest by backing a
[crowdfunding campaign](https://balanced.crowdhoster.com/let-s-push-to-debit-cards). The
purpose is not to get someone else to fund our development. We can do that on
our own. All of the money goes towards the transaction fees we would charge
the marketplace for the transfers. Balanced also gives the backers early access
and discounted fees in exchange.
The marketplace paying their fees upfront
though is the best way to demonstrate that there really is a need for the
service.

## The current backers

It's been only a day since we announced the campaign, and we've already met
our goal of $50,000. The first companies that backed the campaign immediately
saw the value.

[Raise](raise.com), a rapidly growing marketplace for gift cards, realized how
important it was to make it trivial to pay their sellers. George, the
Founder/CEO, of Raise was the friend I referred to in this post. It was his
girlfriend that cemented the idea that there was such a need amongst consumers.

[Crowdtilt](crowdtilt.com) has shown their support in
[a public discussion](link.com) since the beginning. James and
Khaled, the founders of Crowdtilt, jumped at the chance of doing whatever they
could to make the ability to push money to debit cards a reality. Crowdtilt
is a platform to crowdfund anything from
[a campaign to support the Jamaican bobsled team](link.com) to
a campaign amongst friend for a birthday.

[Wanderable](wanderable.com) also immediately picked up on how powerful it
was to reduce the friction to pay a couple for their wedding registry.
They hated going through the back and forth when a couple would mistype
their bank account number and for Wanderable not knowing for days later.

I want to thank our early backers, and I want to thank anyone else that
understands the problem and sees the value we're trying to create. I thank
you for your support. I'm excited to make this a reality.