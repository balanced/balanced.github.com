---
layout: post
title: "Hypermedia APIs and You"
author: [Mahmoud Abdelkader](https://twitter.com/mahmoudimus)
tags:
- rest
- hateoas
- api
- balanced
---

[David Heinemeier Hansson](https://twitter.com/dhh)'s post about
[hypermedia APIs](http://37signals.com/svn/posts/3373-getting-hyper-about-hypermedia-apis)
has sparked some very interesting discussion about the usefulness of
hypermedia APIs, but the visceral reaction to the API was surprising.
It's pretty eye opening to realize that many developers just do not
grok hypermedia APIs because they're still thinking in terms of data -
not in terms of *content negotiation*.

## First, let's acknowledge the good parts of DHH's post:

* Do not return **id**s, return **uri**s.

Don't construct them in the client. It makes the API much easier to
develop simple client libraries for, especially if you use what Steve
Klabnik calls the
[hypermedia proxy pattern](https://gist.github.com/3172911). Balanced
uses this pattern extensively and we have developed two different
libraries for [Python](https://github.com/bninja/wac) and
[PHP](https://github.com/bninja/restful).

* You can't just "willy nilly" change your urls.

Changing a url will always cause technical debt on your side to
maintain; however, there's a caveat. If done correctly, there will
never be a need to break existing clients as long as the resource's
representation is equivalent.

This is where versioning plays a big role. As long as the requested
resource version is returned and the requested endpoint respects the
form parameters passed to it, versioning urls is a cake walk. At
Balanced, we have developed internal web service tools that support
this kind of flow. We use 4 service internally and we leverage HATEOAS
to establish contractual endpoint obligations for consuming services.

## Second, let's clarify some misconceptions

* The search for the mythical universal "standard" API client.

There's no need to invent a universal "standard" API client, you are
already using one right now. It's the web browser that's reading this
piece of writing now. It follows a defined protocol specification,
leverages content negotiation to control the layout of the server's
response, respects redirects, etc.

There is nothing stopping you from using many API clients to explore
an API, in fact, we do so now:

 - We browse documentation using the web browser
 - We keep an `ipython`, `pry`, or `curl` on our terminal

These are our tools to play with HTTP APIs and interactively explore
them.

* What about self documentation? What's that all about?

Self documenting the API does not necessarily mean return a blob of
text that explains what to do. That's great and all, but the spirit of
self documentation is the reliance on intuitive usage of the API.

Let me make this crystal clear, a hypermedia API will absolutely
*STILL* need to have good and thorough documentation - with plenty of
examples on how to integrate.

This is where we can leverage the power of *content negotiation*. When
I browse your API in my web-browser and I issue a `GET`, you should
detect my `Accept: text/html` and return HTML to me. Do not return
`json` or `xml`.

### HTML?

Yes! HTML will let you leverage the power of forms, so I can play with
your API. I can submit the form to it. I can inspect it to see what
parameters are passed in by reading the form. I can follow your
redirects. I guess some would say that my client is **universal** and
knows how to interact with your API that's returning HTML. How about
that?

[Balanced](https://balancedpayments.com) is experimenting with this
internally and we've noticed it makes testing your API significantly
easier. We can leverage all the web scraping tools like
[phantomJS](http://phantomjs.org/) and
[selenium](http://seleniumhq.org/) and interact with our API using
HTTP.

This is one of the most important parts about hypermedia APIs. The
reason the benefits aren't clear to developers stems from the lack of
tools in the ecosystem to support this.

## Finally, the elephant in the room

* discoverability

Discoverability does not necessarily mean declare all your endpoints
up front. New links can always be introduced by the server and the
client should still be able to handle it. Doesn't mean they will use
it. If I browse your website and I do not click a link, I am *AWARE*
of this link, aren't I?

Did you have to issue an update to my web browser so that I can use
this link? Nope.

## Some Final Remarks

Steve Klabnik and the rest of the
[rails-api](https://github.com/rails-api/rails-api) team are working
to make the tooling available for the Ruby and Rails community. I have
a gut feeling that they've realized that the tooling for hypermedia
APIs just does not exist.

If you're using Python, you're in luck. The most recent versions of
[django-rest-framework](http://django-rest-framework.org/) groks most
of these principles and their demo applications demonstrate
appropriate hypermedia APIs principles.

If you're interested in some of the tooling that
[Balanced](https://balancedpayments.com) has experimented with
internally, let us know!
[Open up an issue on Github](https://github.com/balanced/balanced-api/issues)
and we'll keep you updated on our progress of open sourcing it.

You can reach me on twitter (https://twitter/mahmoudimus) or email me:
m [@] balancedpayments.

