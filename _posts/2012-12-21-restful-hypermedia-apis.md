---
layout: post
author: Mahmoud Abdelkader
title: Hypermedia APIs and You
tags:
- rest
- hateoas
- api
- balanced
---

[DHH](https://twitter.com/dhh)'s post about
[hypermedia APIs](http://37signals.com/svn/posts/3373-getting-hyper-about-hypermedia-apis)
has sparked some very interesting discussion about the usefulness of
hypermedia APIs, but the visceral reaction to the API was surprising.
It's pretty eye opening to realize that many developers just do not
grok hypermedia APIs because they're still thinking in terms of data -
not in terms of *content negotiation*.

First, let's acknowledge the good parts of DHH's post:

* Do not return `id`s, return `uri`s.

Don't construct them in the client. It makes the API much easier to
develop simple client libraries for, especially if you use what Steve
Klabnik calls the
[hypermedia proxy pattern](https://gist.github.com/3172911). Balanced
uses this pattern extensively and we have developed two different
libraries for [Python](https://github.com/bninja/wac) and
[PHP](https://github.com/bninja/restful).

* You can't just "willy nilly" change your `uri`s. Changing a `uri`
  will always cause technical debt on your side to maintain, however,
  if done correctly, there will never be a need to break existing
  clients as long as the resource representation is equivalent.

Since 

Second, let's debunk some myths:

* There's no need to invent a universal "standard" API client, you are
  already using one right now. It's the web browser that's reading
  this piece of writing now. It follows a defined protocol
  specification, leverages content negotiation to control the layout
  of the server's response, respects redirects, etc.

* Self documenting the API does not necessarily mean return a
  blob of text that explains what to do. That's great and all, but the
  spirit of self documentation is the reliance on intuitive usage of
  the API. Let me make this crystal clear, a hypermedia API will
  absolutely *STILL* need to have very good and thorough
  documentation. More on that later.

* Discoverability does not necessarily mean declare up front. New
  links can always be introduced by the server and the client will be
  able to handle it.



First, let's attempt discovery

Steve Klabnik's attempt to explaining their usefulness.

might resonate with many API developers,

The client is the web browser. There's no need to write a new one.

Steve Klabnik's "hypermedia proxy pattern"

Django Rest Framework gets it right - gives you a form (operates in
HTTP semantics)

When a resource changes, the server sends a 301, 302.
