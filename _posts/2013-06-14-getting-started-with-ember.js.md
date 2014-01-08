---
layout: post
author: Nick Kleinschmidt
author_image: https://github-camo.global.ssl.fastly.net/2f7fa3d236660ba5907d676aa660cae6d1ac01de/687474703a2f2f626c6f672e62616c616e6365647061796d656e74732e636f6d2f696d672f617574686f72732f6e69635f6b6c65696e7363686d6964742e706e67
title: "Getting Started with Ember.js"
image: /img/blogimages/2013-06-14.jpg
cover_image: /img/blogimages/2013-06-14-cover.jpg
tags:
- balanced
- engineering
- ember.js
---

# Getting Started with Ember.js

As part of being an [open company](http://www.fastcolabs.com/3008944/open-company/why-i-made-my-payments-startup-an-open-company), we're designing a [brand new dashboard](https://dashboard.balancedpayments.com/) that's completely [open source](https://github.com/balanced/balanced-dashboard). In favor of giving back to the community, we are going to write several articles on [Ember.js](http://emberjs.com/) describing our experiences with Ember.js as we build our software in the public. We feel that this will help get our community involved and invested in a piece of software that thousands of companies use on a day-to-day basis.

We wanted to build our dashboard in JavaScript to separate the both front-end and back-end development as well as leverage the power of [Balanced's](https://balancedpayments.com/) RESTful API. We chose [Ember.js](http://emberjs.com/) as our framework. It's an exciting technology and we've had fun picking it up. There are a few rough edges, so our first article is about some few things which we've learned along the way.

## Concepts

Since Ember is structured differently than many web-based MVC frameworks, one of the most important things to learn is how to structure your applications.

The Ember Guides section on [Core Concepts](http://emberjs.com/guides/concepts/core-concepts/) is a great place to start, however, I felt that it didn't do a thorough job relaying how to know when to use different concepts. We'll share a few tips now, but the next post of this Ember series, we'll actually walk through an example of choosing components to use to build out a feature.

### View Components

**Route** - Use a route when you want the page to have a URL.

**Controller** - Use a controller when you need to handle business logic. A controller can represent an entire part or just a section of a page. Think of them as blocks of logical functionality.

**View** - Use a view to handle UI logic and events. You generally don't want to put business logic here. My general rule is that if it's using JQuery selectors, it goes in the view. If it's doing CRUD actions on models, it goes in the controller.

**Partial** - Use a partial to include common template code. Use this if you solely need templating code and won't need to handle UI events or business logic.

### Template Components

**partial** - Used to include another template inside the current template.

**view** - Used to include a view inside the current template. Use this for reusable components that don't need to handle business logic or whose business logic can be handled by the current controller.

**render** - Renders a controller. Use this if the component you're embedding needs to handle business logic.

**yield** - Used by view layouts to include view content.

**outlet** - Used by routes to include views of nested routes. There are more complicated ways to use this that let you customize what gets inserted into an outlet at the route level, but try to use more common components first.

## Naming

Read the Ember Guides section on [Naming Conventions](http://emberjs.com/guides/concepts/naming-conventions/). Don't take it as a suggestion, think of it as the law. Ember gives you a lot of magic, but only if you name things the way it's expecting. Similarly, if you're looking for a framework that lets you name and structure things to your liking, Ember may not be the framework for you. Many of the core Ember developers came from Rails, and the framework is similarly opinionated.

## Ember Data

We wasted a good amount of time at the start of the project trying to get Ember Data working with our data model. There's a certain way Ember Data expects your API responses to be formatted and your URLs to be constructed. If you're writing an application from scratch, it's easy to adhere to these guides. If you have an already existing API that isn't the traditional Ruby on Rails format, it can be difficult to get Ember to bend to your schema.

Since we were dealing with a mature API that couldn't be changed and didn't work well with Ember Data, we elected to write our own simple data layer. This isn't an unpopular route to take, as [Discourse](https://github.com/discourse/discourse) and [Zendesk](https://github.com/zendesk/ember-resource) both wrote their own data layers to use with Ember. If you're writing a brand-new API to use with Ember and don't mind customizing it, there are a lot of goodies you get for free by using Ember Data. If you have a preexisting API and/or don't want to deal with rapid changes to Ember Data, writing a simple data layer might be a better solution.

## Resources

[Ember Guides](http://emberjs.com/guides/) - The official starting point for Ember. Read it once, digest a bit, then I'd advise scanning it again. Many topics make more sense when you understand the whole system a bit better. Also, ignore the warnings about the 'Understanding Ember.js' section being for experts only; definitely start digging in -- it answered a bunch of questions for me.

[Ember API Docs](http://emberjs.com/api/) - Very well written and chock full of sample code.

[Ember Community](http://emberjs.com/community/) - Links to Stack Overflow and the Ember.js Discourse, both great Q&A sites. Stack Overflow has more activity and answers for specific how-to questions, the Discourse site seems to be better for discussing more general questions.

[Peepcode](https://peepcode.com/products/emberjs) - This video is what nailed down in my head how the Ember concepts interrelate. It costs money, but it's money well spent.

[Ember Watch](http://emberwatch.com/) - Collects talks, books, and other resources as they become available.

## Contributing

We'd love for you to get involved in our development and contribution process. Feature discussion and designs are on [GitHub](https://github.com/balanced/balanced-dashboard/issues). If you're a developer, read the [contribution guidelines](https://github.com/balanced/balanced-dashboard/blob/master/CONTRIBUTING.md) to get started!

We hope to have you dive in and we're happy to share more of our experiences.
