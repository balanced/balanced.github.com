---
layout: post
author: Steve Klabnik
title: "Change, Consensus, and Cucumber"
tags:
- balanced
- api
- hypermedia
- collaboration
- developer
- engineering
---

## Change, Consensus, and Cucumber

One of my big responsibilities here at Balanced is taking ownership of our API. Basically, I am the dictator of [balanced/balanced-api](https://github.com/balanced/balanced-api). However, I was only given dictator powers because it was trusted that I'd use them for good. Today, I'd like to lay out for you what exactly that means, as well as what my plans are for the future.

### Change

We're a startup. Our office is in the heart of SOMA. That means, according to conventional startup wisdom, that our motto should be "Move fast and break things." I personally think that this is one of the worst pieces of advice that a startup can follow. In fact, "move fast and break things" would be very, very harmful for our business. This maxim was created by Facebook, to talk about the way that they wanted to do things. And Facebook has been massively successful. But that doesn't mean that developers enjoy working with Facebook.

Here are three examples.

First, ["OAuth of Fealty"](http://www.bogost.com/blog/oauth_of_fealty.shtml) by Ian Bogost:

> The Facebook Platform is a shape-shifting, chimeric shadow of suffering and despair, a cruel joke perpetrated upon honest men and women at the brutish whim of bloodthirsty sociopaths sick with bilious greed and absent mercy or decency. 

Ouch! Ian goes on to say this:

> Facebook got in touch with me and asked for more detail. "Why does the Facebook Platform suck?" a platform team rep asked me. "Why do you dislike it so much?"
> 
> The short truth is this: Facebook doesn't care if developers can use the platform easily or at all.
> 
> [A previously described example bug] is the sort of infuriating defect the platform exhibits constantly. And it does so every week in new ways. Bugs go on for long durations without remedy. The documentation is shamefully outdated, incomplete, and unclear. Facebook deprecates or retires features—or even entire frameworks—on short notice as a result of a collective failure to bother with basic software architecture for external development.

Brutal. Breaking things has consequences for others. We'll come back to Ian's post in a bit, but next I'd like to move on to [The Facebook API: A Case Study in Not Caring About Developers](http://www.sethcall.com/blog/2010/09/30/facebook-api-does-not-care/) by Seth Call:

> But everything indicates that the API(s) only get more confusing and more broken, and migrations are done usually rather brutally.  You can search through the developer forum if you want to corroborate.
> 
> A side-effect of a constantly changing API is that you aren’t sure what you should be using versus what’s fallen out of favor.
> 
> Consider the the reasonably new Open Graph API.  It lets you read and modify a great deal of data found within Facebook.  You could already do this with the Old REST API, but this API is easier!! and better!!

Constant breaking changes wears out developers. I'd like to lastly share Andrew Chen's ["Why developers are leaving the Facebook platform"](http://andrewchen.co/2013/04/22/why-developers-are-leaving-the-facebook-platform/):

> I’ve heard the joke that the “Developer Love” email is scariest email you can get from Facebook, because it’s the one that tells you that your app needs to be substantially updated for a new set of APIs. Facebook has an amazing engineering culture driven by “Move fast and break things” but that means some of those things are often their developer partners’ apps. And you need to move as fast as Facebook to keep up. Just look at the Developer Changes page to see how often new things are released.
> Part of this retooling means that there’s a maintenance tax on whatever app has been created on the platform, since you have to pull your prized engineers off their projects to do constant maintenance and reintegration into the new viral channels. That’s just to keep up. It also means that what works today may not work tomorrow. If you are making important decisions on staffing, business models, financing, then a lot of uncertainty is introduced because your business might get disrupted by platform changes happening in a few months.

Sad.  Could Facebook have been even _more_ successful if they hadn't introduced these kinds of totally controllable problems? Maybe, maybe not. I want to help Balanced become a successful company, but one that our partners feel good about working with.

I only pick on Facebook so hard here because they created this cult in the first place. But we all do it. I'm a developer, and I hate dealing with legacy code as much as the next one is. You'll regularly find me complaining on Twitter about people that still use Ruby 1.8, even though it's been end-of-life'd for half a year.

Unfortunately for me and the rest of startup land, it's our job to do what is _right_, not just what we want to do. This is especially true for companies where APIs are a product, and even more true for companies dealing with money. If Facebook breaks an API, a Candy Crush top score may not be saved. If Balanced were to break an API, people would not be able to collect money. It's not very fashionable here in SOMA to collect money from people, but it's very important to our customers. Revenue is the lifeblood of many businesses, and we have a duty to our customers to not break things.

### Consensus

Okay, so obviously, breaking other people's applications isn't great. But why exactly does it make people so mad? There's a common, underlying thread in these blog posts, and that's a lack of respect.

Andrew:

> If you are making important decisions on staffing, business models, financing, then a lot of uncertainty is introduced because your business might get disrupted by platform changes happening in a few months.

Seth's blog post's title includes "A case study in not caring about developers"

And most vividly, Ian:

> In fact, it doesn't seem to concern itself with any of the factors that might be at play in developers' professional or personal circumstances. The Facebook Platform is a selfish, self-made altar to Facebook, at which developers are expected to kneel and cower, rather than a generous contribution to the success of developers that also happens to benefit Facebook by its aggregate effects.

This isn't how things are supposed to work. Partnerships are supposed to be about, well, partners. Not one side of the partnership lording over the other one. Constantly breaking things indicates that you don't care about your supposed partner. You expect them to dedicate time and energy to re-doing work they already did, because you don't want to deal with the legacy burden.

Taking care to not break stuff is sort of the minimum amount that you can do to be respectful of your partners' time, efforts, and roadmaps. But I like to do more than the minimum.

### Cucumber

