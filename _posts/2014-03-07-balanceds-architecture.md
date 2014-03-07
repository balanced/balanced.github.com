---
layout: post
author: Steve Klabnik
author_image: /img/authors/steve_klabnik.png
title: Balanced's Architecture
image: /img/blogimages/3_7_2014_image_600x424.jpg
cover_image: /img/blogimages/3_7_2014_image_1020x340.jpg
tags:
- balanced
- platform
---

## Balanced's Architecture

There has been a lot of discussion lately about the software architecture
that runs financial systems. It's been in the news because of the massive
[meltdown of Mt. Gox](http://www.wired.com/wiredenterprise/2014/03/bitcoin-exchange/),
that most prominent of Bitcoin exchanges, as well as [Silk Road 2's transaction malleability
bug](http://www.forbes.com/sites/andygreenberg/2014/02/13/silk-road-2-0-hacked-using-bitcoin-bug-all-its-funds-stolen/).
While we wait for the Japanese bankruptcy courts to determine exactly what happened, (and
[and maybe create new regulations](http://online.wsj.com/news/articles/SB10001424052702303630904579419862242970416?mg=reno64-wsj&url=http%3A%2F%2Fonline.wsj.com%2Farticle%2FSB10001424052702303630904579419862242970416.html))
it's clear that software architecture (and quality) is at the heart of the
discussion: [Mt. Gox's source code has been leaked](https://bitcointalk.org/index.php?topic=498522.0;all).
The first post in that thread sums up the reactions that I've seen around the internet:

> As a developer all I can say is ...
> I have nothing to say just stunned silence that this was the codebase used to process millions
> of dollars and BTC everyday.

Now, I want to make a few things clear: I have not read Mt. Gox's source code, and have no direct
comments on its quality. Software is hard, everyone makes mistakes. But it's _very_, _very_, important
that when you're dealing with people's money, that you get things right.

In that light, I thought it would be prudent to share exactly how Balanced works under the hood.
We want to eventually open source 100% of the software that powers Balanced, but we're not quite
there yet. In the meantime, I'd like to share with you at a high level how Balanced actually works.
I previously shared [some of this in my post about our Coinbase integration](/more-details-about-bitcoin/), 
but this is a broader discussion of the rest of our architecture.

## The diagram(s)

Here's a diagram of how it all fits together:

![Balanced Architecture](/img/blogimages/balanced_arch_1.jpg)

This is the simplest version of the diagram. I'm going to do a quick walkthrough and then circle back to dig more into the details.

## One: You include balanced.js

Your site, hosted by you, includes [`balanced.js`](https://github.com/balanced/balanced-js/) by linking to it with a `<script>` tag on your checkout page. It gets loaded up from [https://js.balancedpayments.com/balanced.js](https://js.balancedpayments.com/balanced.js) into your user's browser.

[Here](https://docs.balancedpayments.com/1.1/guides/balanced-js/) is more documentation on proper use of `balanced.js`.

## Two: balanced.js sends card info to PCI store

When your user presses the submit button, `balanced.js` overrides the submit button, collects the card information from your `<form>`, and then sends it to our [PCI](https://www.pcisecuritystandards.org/) compliant data store.

The store basically creates a unique identifier (a ["token"](http://en.wikipedia.org/wiki/Tokenization_(data_security))) for that particular card information, and saves it. In essence, the data store is just one huge hash table: `{"/cards/123": "4444 4444 4444 4444"}`. The key gets sent back to `balanced.js`, and the value stays inside the store.

`knox` is the internal name of our PCI store, after [Fort Knox](http://www.knox.army.mil/).

## Three: balanced.js sends you the token

`balanced.js` takes this token, and submits it in the form instead of the credit card information. This token (which in our case is a URL), gets sent to your server, where you save it. Since this data isn't card information (it's just a token that represents card information and it can't be used by anyone else) you're free to save it, and you should! 

## Four: You use the token to request a charge

Your application then makes a call to our API, sending along the token. "Hey Balanced, please charge card `/cards/123` $10."

This is probably the part of the diagram you think about the most, as it's the biggest way you interface with us.

## Five: API asks the PCI store to charge the card

Our API knows nothing about card data, it only knows about tokens. Therefore, it makes a request to the PCI store, passing along your wishes: "Hey PCI store, please charge card `/cards/123` $10."

Why does the API exist, then? Well, this is a simple diagram and we're only talking about the success case. Our API has business logic just like any other application, but we'll get to that later.

## Six: PCI store talks to the card networks

The PCI store uses the token to fetch the value, and passes the real card information associated with the token to the credit card networks to be processed.

As you can see, the store is a really dumb, really simple piece of software. It's just keys, values, and 'hey VISA, process this.' This is really important for a few reasons: it's simple to audit, things are less likely to go wrong, if they do go wrong it's easier to debug, and only a very, very small part of our overall architecture needs to touch card information.

## Digging deeper

So that's how it works at a basic level, but there's much more to it than that. Let's expand the API part of the diagram:

![Balanced Architecture 2](/img/blogimages/balanced_arch_2.jpg)

One of the nice things about our API is that you don't get a 'test sandbox': you just create a 'test marketplace,' but still hit `https://api.balancedpayments.com`. Test marketplaces are exactly like production marketplaces, except that for test marketplaces the PCI store knows not to propagate charges to the card networks and we don't charge you for these test transactions.

We love testing. We encourage our users to write lots of tests. So it'd be pretty bad if test and production were on the same machines: a really enthusiastic tester could degrade production service.

So we actually have a router component that checks to see if it's a test marketplace or a production marketplace, and then sends it to two identical copies of the API. Run all the tests you want: it doesn't actually affect production. We can also scale the two separately, configure them differently, and all that other good stuff.

## Splitting up the API, and introducing `midlr`

![Balanced Architecture 3](/img/blogimages/balanced_arch_3.jpg)

"The API" isn't just one application, though: it's two! The API actually talks to a component called `precog`, which does our own fraud detection. So in reality, the conversation is "Hey `precog`, please charge card `/cards/123` $10", and if  `precog` says it's okay, it goes to our PCI store and says "Hey `knox`, please charge card `/cards/123` $10." 

We also have a second layer of routing. `midlr` actually listens on both `https://api.balancedpayments.com` as well as `https://js.balancedpayments.com`. It proxies the requests for both: it sends API requests to the router and sends JavaScript requests to `js`. `midlr` proxies `https://js.balancedpayments.com` mostly for historical reasons: eventually it will just be an S3 bucket with the simple file.

We use `midlr` to filter out _all_ sensitive data. It ensures that no card information goes to the wrong place. By having one main place to put all of the filtering and routing, we can ensure that the right data goes to the right place. This diagram got a teeny bit complicated, but since `balanced.js` hits `https://api.balancedpayments.com`, it also goes through `midlr`, which routes it to `knox`. However, for simplicity, I decided to draw the arrow straight from `balanced.js` to `knox` here.

## Further isolation

Here's the last diagram. Red shows the network boundaries.

![Balanced Architecture 4](/img/blogimages/balanced_arch_4.jpg)

`knox`, `midlr`, and `js` are all on their own Amazon account. Only a subset of our staff has access to this: I personally wouldn't even know how to get into those servers. `precog`, `api`, and `router` are all on an Amazon account which most of our developers have access to, and that's where most of the actual work in building new features goes. Finally, your application is obviously not a part of Balanced, so I circled it separately too.

## Conclusion

As you can see, there's a lot of moving parts. We take many steps to ensure
that your card data is protected, and the vast majority of our own architecture sees
the exact same tokens that you do. At some point, I will be very happy to have you
see the code, as well. :)

I hope this has taught you a bit about how to properly design systems that deal with
sensitive financial data.

---

Discuss on [HackerNews](https://news.ycombinator.com/item?id=7362442).
