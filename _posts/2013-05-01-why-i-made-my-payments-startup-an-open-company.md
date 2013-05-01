---
layout: post
author: Matin Tamizi
title: "Why I Made Balanced An Open Company"
tags:
- balanced
- open company
- open business
- fast company
- gittip
- repost
---

This is a repost of an article featured on FastCoLabs on Tuesday, April 30th, 2013. You can read the original article [here](http://www.fastcolabs.com/3008944/open-company/why-i-made-my-payments-startup-an-open-company) and more "open company" posts at FastCoLabs [here](http://www.fastcolabs.com/section/open-company).

- --

### How to Build an Open Payments Company

[Balanced](https://www.balancedpayments.com/) was created to increase the global economy through payments. As we built Balanced, it troubled me that we had adopted the closed-off culture common to the financial services industry, where everything was locked up for the sake of "competitive advantage." That wasn't the kind of company I wanted to build, and over time, we learned how to open up, which let us move and grow faster as a company.

There were two events in the summer of 2012 that showed me the way towards openness. The first was when I saw App.net defining the [specifications for their API in the open on Github](https://github.com/appdotnet/api-spec). The second was Gittip, [which had open-sourced their entire company](https://www.gittip.com/)--every single line of code. I thought the creator of Gittip, Chad Whitacre, was out of his mind. Anyone could take the code and release a complete clone within an hour.

There was something even more interesting about [App.net](https://github.com/appdotnet/api-spec/issues) and [Gittip](https://www.gittip.com/). Both App.net and Gittip discussed their roadmap and functionality entirely out in the open. This seemed even more insane to me.

Still, I couldn’t stop thinking about it. It was an entirely different spin on building an open company. It goes beyond sharing information openly inside the company; you’re sharing the information with the world. I grew up with Linux, Perl, and Python, and I had become particularly fond of the [Python Enhancement Proposals] (PEP). Anyone in the Python community could propose an enhancement or change to Python, and it would be discussed openly. This wasn’t entirely new, but the process was formalized and really appealed to me. Guido van Rossum, the creator of Python, maintained (and still does) his role as the Benevolent Dictator for Life (BDFL). Guido made the final decision, but he had to be fair to avoid outrage. He had to be open about his decisions when he decided to accept or reject a proposal.

### What You Get From Being An Open Company

I figured Balanced should try it out. We published our API specifications on Github in a similar way as App.net. The first [open discussion](https://github.com/balanced/balanced-api/issues/1) was about what format we should even use in communicating the specifications.

We had humble goals at first. Working in the open forced us to formalize previously internal processes that weren’t well defined, and forced us to articulate (in writing) our reasoning behind a decision. I had to be fair as the BDFL, or someone would call me out publicly.

We achieved our humble goals, but the project went beyond that. Customers began to monitor our conversations and jumping in themselves by proposing enhancements or commenting on existing discussions. At a minimum, we could share our reasoning for a previous decision with someone for them to understand why we had done something.

We support paying out money via next-day ACH bank deposits. We currently have no intention to support mailing checks, but we’re now able to refer customers to a [detailed conversation that explained our reasoning](https://github.com/balanced/balanced-api/issues/69).

It couldn’t end on Github. We decided we would encourage other forms of discussion as well. Some of our customers have publicly explained why they chose Balanced, and some of our investors have publicly explained why they’ve invested.


### Why Openness Hurts

It’s really hard to build a payments company. It’s even harder to build a payments platform. You can’t exactly move fast and break things when you’re processing payments for someone else. [You need to never break anything!](http://blog.balancedpayments.com/balanced-payments-operations-automated-testing-continuous-deployment-jenkins/) No matter what. Ever!

That’s painful for a startup since you still need to move fast. How do you get something out and see if that’s what your customers want when you can’t go back and change, and when you have to dedicate tons of time to building it properly the first time around? Our entire product development process changed. We could propose an enhancement publicly or start off with an enhancement proposed by the community, make proposals on the implementation, and continually iterate before writing a single line of code. By the time we do start building anything, everyone has had the chance to comment.

This does require some effort and patience. People don’t sit around waiting to give you feedback. You have to contact customers just as you would in any case to solicit feedback, but you then point them to a public channel. Each person that comments publicly, it encourages more people to contribute their feedback and build on the comments of other customers.


#### Build Transparency Into Your Workflows

We got to the point where we would take anything that would make a public change to our product and discuss it publicly. The topic would start in our internal project management system, and we would link it to the external topic. We would release design mocks externally in addition to sharing them internally.

The flow formalized our process:

- create an internal issue
- discuss it publicly
- prioritize internally
- define specifications or design mocks internally
- release specs or mocks externally for feedback
- implement
- release
- communicate that the enhancement has been made

Brilliant! Or at least, it worked, but it became difficult to maintain. It was too easy to forget to post something or skip the step for the sake of getting something out. We needed to police ourselves.

### Propose New Features To The Community

This is where we are now. Every change that affects the customer's experience is always proposed externally. More importantly, it’s also prioritized and set into milestones with deadlines externally, so anyone can see what we’re actively working on. Those topics become the most important for them to engage in.
The current process:

- create a public issue
- discuss it publicly
- prioritize it publicly
- define specs or mocks publicly
- implement
- release
- communicate the release publicly

In attempt to match Gittip, we’re writing [a new dashboard entirely open source from the beginning](https://github.com/balanced/balanced-dashboard). A competitor could jump in, take the dashboard, and release it as if it was their own. Who cares? Our customers still benefit. A competitor could see our roadmap and beat us to it. That’s a risk, but it’s worth it. If anything it lights a fire under us to move even faster. Once it’s in the open, everyone knows, and you have to race to get it done and get it done right.


### Use Highly Public Customer Support

Having a public support chat isn’t that new. We didn’t invent this, but we tried to stick with the open source approach. Our [chat room on IRC](http://webchat.freenode.net/?channels=balanced&amp;uio=MTE9OTIaf), and the logs are [available to the world](http://botbot.me/freenode/balanced/).

The result is that we have about 50 people on our IRC channel--only five of whom are Balanced employees. We have incredible customers like ajsharp, joonas, remear, and secforus amongst others who go as far as answering questions, supporting, and even providing code snippets to other customers.


### Focus On Where You Add Value

We’ve grown faster in the last eight months than we ever have. We’ve moved faster than we ever have, and we’ve realized the real value we create as a company. We do everything we can to support our customers and innovate. That is our key differentiation. When it comes to being open, do it early, and do it often. We still go through conversations on whether we should open something up to the world. We do it hesitantly and realize we should have done it much earlier.

- --

Special thanks [Chris Dannen](https://twitter.com/chrisdannen) of [FastCoLabs](http://www.fastcolabs.com/user/chris-dannen) for his editorial support and [Lisa Nicole Bell](https://twitter.com/LisaNicoleBell) for nudging us to write this.
