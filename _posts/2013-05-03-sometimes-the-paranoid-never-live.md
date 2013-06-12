---
layout: post
author: Matin Tamizi
title: "Sometimes, the Paranoid Never Live"
tags:
- balanced
- open company
- open business
---

I learned a lesson early on that you should err on the side talking openly
about your ideas when starting a company. The reality is that most people don't
care, and many of the best ideas are thought to be stupid at first anyways,
which is what limited someone else from working on it.

Despite this knowledge, I've found myself being overly paranoid at my
detriment. It was just so natural to be protective—-to fear that someone else
would take the idea and build it before you. I've trained myself over time to
break that habit, which has made all the difference in the growth of Balanced.

Balanced was originally called PoundPay. We changed the name when we released
the current API. PoundPay was a much higher touch service where the checkout
had to use our IFRAME, and the seller had to signup for a PoundPay account.
Everyone also received emails from us.

We finally accepted in January 2012 that the PoundPay model was flawed after
many months of customers screaming at us and wanting something different. It
took us six months though to release the new API. We were creating a payments
API from scratch and had to steep learning curve on how the interface should
look. What really hurt us was that we didn't have enough feedback and our
iteration process was painfully slow. We had to release the API, have an
existing or potential customer try it, and learn how to iterate, which generally
meant breaking the interface. It also meant racing to push something out before
we were completely confident about how robust the API was. In short, the model
sucked ... terribly. Around June when we finally openly released v1, we vowed to ourselves to never
make the same mistake.

I [wrote a post](http://www.fastcolabs.com/3008944/open-company/why-i-made-my-payments-startup-an-open-company) on Fast Company Labs a couple days ago talking about
how we started experimenting with making Balanced an Open Company. We started
[openly discussing](github.com/balanced/balanced-api/issues) our roadmap
and what we were working on—-having our internal conversations publicly and
inviting customers to join us in the discussion. It _completely_ changed our
product development cycle.

We were able to discuss new features and other enhancements or changes publicly
similar to how Python Enhancement Proposals (PEP) work. Every change in the API
spec needed to be submitted (even by us) as a pull request to the
[API spec rep](github.com/balanced/balanced-api) and give everyone time to
review.

Changes to the API and product decisions happened a lot slower, but we didn't
waste effort building something people don't want or going about it the wrong
way anymore—-for the most part at least.

I'm not concerned that a competitor will fork and rip of our
[open source](https://github.com/balanced/balanced-dashboard) dashboard that
we're building. What do we really lose when the outcome is that we build a
better product? Instead, we have customers and people from the community
discussing and contributing features that they want to see.

A certain amount of paranoia is always healthy. I'm paranoid about hiring the
wrong people, which is why we have such high hiring standards. I'm paranoid
about whether or not we're moving fast enough, which is why we continually
push ourselves and challenge priorities in weekly meetings. I'm paranoid that
our over the top customer support continues as we grow, which is why we maintain
customer support as a top priority.

In the end, [you need to be paranoid to survive](http://www.amazon.com/Only-Paranoid-Survive-Exploit-Challenge/dp/0385483821), but you need to live before you can think about surviving.