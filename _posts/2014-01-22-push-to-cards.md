---
layout: post
author: Matin Tamizi
author_image: /img/authors/matin_tamizi.png
title: "Balanced Will Release an API to Push Money to Debit Cards"
image: /img/blogimages/1_22_2014_image_600x424.jpg
cover_image: "/img/blogimages/1_22_2014_image_1020x340.jpg"
tags:
- open
- crowdfunding
---

Balanced launched a
[crowdfunding campaign](https://balanced.crowdhoster.com/let-s-push-to-debit-cards)
yesterday to gauge interest
in building an API that gives marketplaces the ability to pay sellers using
only a seller's debit card number and expiration date. In 25 hours,
we reached our goal of $50k with our biggest backers being
[Raise](https://www.raise.com/),
[Wanderable](https://wanderable.com/),
[Crowdtilt](https://www.crowdtilt.com/), and
[InstantCab](http://instantcab.com/).
I don't think it would have been possible to take this approach to product
validation prior to a white-labeled crowdfunding platform like
[Crowdhoster](http://www.crowdhoster.com/) or without taking an open
approach to building a business and communicating with customers.
This post talks about our reasoning and approach towards developing a new
product.

We don't have the flexibility to try out functionality in our API. We either
release and support it forever, or we never build it at all. It's just not
possible to rip something out once your customers depend on it to run their
business.

We struggled with that challenge a year ago for
[ACH debits](https://www.balancedpayments.com/ach-debits). After a lot of
research, we decided that it didn't make sense to move forward, but it
was a
[public discussion](https://github.com/balanced/balanced-api/issues/2),
and we operate as an
[open company](https://www.balancedpayments.com/open).
I had to explain why.

![Matin's explanation](/img/blogimages/why-no-ach-debits.png)

In the end, there was so much demand and a push from our customers to pay
even more than what we thought they would pay. The public conversation changed
everything.

There was also a public conversation for Balanced to build an API to
[push money to cards](https://github.com/balanced/balanced-api/issues/32).
We did the research, realized it was in fact possible, but it wasn't enough
of a priority. It wasn't clear whether there was enough demand, so we took
a different approach this time by running a crowdfunding campaign on Crowdhoster
to ask our customers to put their money where their mouth is. If you really
want this, show us ... and they did.

## The Main Backers

[![Raise.com](/img/blogimages/raise_logo.jpg)](https://www.raise.com/)

Raise jumped in right away with a $20,000 contribution becoming the largest
backer, and one of our primary partners to make this happen. Raise is a
marketplace for gift cards. George, the Founder/CEO, and Angelo who runs
payments at Raise immediately got it.

It all became clear when I had dinner Monday night with George, Angelo, and
George's girlfriend who is also Angelo's sister :-). I asked her about having
to enter her account number and routing number into a site. She explained that
she'd prefer not to share her bank account information and would have to call
her bank to even find out what her bank account information was. Raise wants
anyone to be able to sell their gift cards online, and that means making it as
simple as possible to do so.

What's interesting is that Raise wasn't a customer of Balanced prior to the
campaign. They just saw the value to innovate and be an early and, thus
far, the largest backer.


[![Wanderable](/img/blogimages/wanderable_logo.jpg)](https://wanderable.com/)

Wanderable is a free wedding registry for honeymoon destinations. As a current
Balanced customer, we've worked with them to manage couples mistyping their
bank account number. It's not possible to validate a bank account number in
real-time, so Wanderable would have to ask the couple to come back days later.
Paying a couple using their debit card number solves that problem.

[![Crowdtilt](/img/blogimages/crowdtilt_logo.jpg)](https://www.crowdtilt.com/)

Crowdtilt lets you crowdfund *anything*. They are the company behind
Crowdhoster--the platform that powers our crowdfunding campaign. Crowdtilt is
also a current Balanced customer. James and Khaled, the co-founders of
Crowdtilt, have shared with me on numerous occasions how annoying it was for
their customers to have to hunt down their bank account information. Their
[iPhone app](https://itunes.apple.com/us/app/crowdtilt-do-more-together/id691096785?mt=8)
lets you launch a crowdfunding campaign in under a minute. Now, they're
going to reduce the friction even further.

[![InstantCab](/img/blogimages/instantcab_logo.jpg)](http://instantcab.com/)

InstantCab competes with Uber and Lyft to provide an amazing service to get a
ride. Aarjav started pinging me
[on Twitter](https://twitter.com/aarjav/status/425738289098657792)
asking about more information. He shared with me last night that they had
challenges with drivers mistyping their bank account number, and that is was
easier to just ask them for a check to verify the driver's bank account
information. That's a painful operations challenge that they're now going to
solve.


## Next Steps

It's clear now that we have to move forward, and our community has shown us
that there's *real* demand. We're going to continue the campaign to provide
backers with early access and a discount. All of the contribution will go
towards the transaction fees for the service.

I'm incredibly excited to build something I've wanted to exist for a long time
and support companies that enable new forms of commerce.

----

Comments and discussion on [Hacker News](https://news.ycombinator.com/item?id=7105416)
