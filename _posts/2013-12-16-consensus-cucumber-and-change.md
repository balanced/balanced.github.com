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

One of my big responsibilities here at Balanced is taking ownership of our API. Basically, I am in charge of [balanced/balanced-api](https://github.com/balanced/balanced-api). Today, I'd like to lay out for you what exactly that means, as well as what my plans are for the future.

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

Taking care to not break stuff is sort of the minimum amount that you can do to be respectful of your partners' time, efforts, and roadmaps. But I like to do more than the minimum. To go further, Balanced wants to include everyone who uses the Balanced API as much of a part of the 'product team' as Balanced employees are.

This is a big part of the ["Open Company"](http://opencompany.biz/) philosophy, and changes the way software gets built. This is only tangential, so I won't get into it now, but as an example, some of our customers wanted recurring billing added to our API. So [billy](https://github.com/balanced/billy) was created, which basically adds recurring building on top of our existing API. Sometimes, we'll need to make changes that are more low-level than this, but we can get pretty far with this kind of approach.

Another way that this plays out is in discussions in Issues. If you check out [the pull request implementing our new API spec](https://github.com/balanced/balanced-api/pull/431), we had a ton of discussion. Some people involved weren't even Balanced customers or employees, and were just generally interested in using Cucumber (which we'll talk about shortly) to test APIs. We also got two of the Cucumber team members to [directly](https://github.com/balanced/balanced-api/pull/431#issuecomment-29705876) give us [advice](https://github.com/balanced/balanced-api/pull/431#issuecomment-29884794) on how to write good Cukes, and it was [directly actionable](https://github.com/balanced/balanced-api/pull/431#issuecomment-29887903). We also got some [great dissent](https://github.com/balanced/balanced-api/pull/431#issuecomment-29706071) that warned us of problems with this approach.

Having these discussions takes time, it's true. I could have just slapped together a Cucumber suite in a few days, and been done with it. But it would have been a worse product because of it. I'll take the extra week of time for the increase in quality almost every time.

### Cucumber

So. Cucumber. As I've mentioned, [here](https://github.com/balanced/balanced-api/pull/431) is how that all played out. Cucumber allows you to write "features" which collect "scenarios" which contain "steps." They look like this:

```
Feature: API Keys
  API Keys are what customers use to authenticate against the Balanced API.
  Generally speaking, this will be the first step that is needed to be taken by
  the customer to get started with the API.

  Scenario: List all API keys
    Customers can make as many keys as they'd like. Being able to see all of
    them is a good thing.

    Given I have created more than one API keys
    When I GET to /api_keys
    Then I should get a 200 OK status code
```

These end up turning into Ruby code, via methods like this:

```
When I GET to /api_keys
```

Goes to

```
When(/^I (\w+) to (\/\S*?)$/) do |verb, url|
  options = {
    headers: {
      "Accept" => "application/vnd.api+json;revision=1.1",
    },
    basic_auth: {
        username: $api_secret,
        password: "",
    }
  }
  response = HTTParty.send(verb.downcase, "https://api.balancedpayments.com#{url}", options)
  @response_code = response.code
  @response_body = JSON.parse(response.body)
end
```

Given that we have a wide array of people who we want to collaborate on our API's specification, I really didn't want to tie our spec too strongly to a particular programming language. Cucumber allows us to abstract away the ugly code details, and focus on what things do. That code does say "make a GET request to /foo", but there's all sorts of tangential header and authorization information, as well as that not everyone speaks Ruby. Interested parties can just edit the feature files, and I can worry about mapping them into Ruby code.

### Moving forward

Anyway, so I am excited to continue to work on this project. I'll be expanding more on how I see our API's development moving forward, but for now, this is what we've got. If you want something to be in the API, please [open an issue](https://github.com/balanced/balanced-api/issues/new) or file a new pull request, adding a scenario. Please know that API stability and reliability is incredibly important to me moving forward, and if you ever need anything, don't hesitate to [get in touch](mailto:steve@balancedpayments.com).
