---
layout: post
author: Marshall Jones
title: "Balanced Releases Callbacks &  Events"
tags:
- balanced
- engineering
- feature announcement
- callbacks
- webhooks
- events
---

The Balanced API now supports [callbacks & events](https://github.com/balanced/balanced-api/pull/254) -- aka [webhooks](https://github.com/balanced/balanced-api/issues/70). Check out the [callbacks](https://github.com/balanced/balanced-api/blob/master/resources/callbacks.rst) and [events](https://github.com/balanced/balanced-api/blob/master/resources/callbacks.rst) resources to see what the payloads look like. We've also updated our [documentation](https://www.balancedpayments.com/docs/api?language=bash#events) to describe each event type.

To add and manage events for your marketplace, use the settings tab on the [Balanced dashboard](https://www.balancedpayments.com/login), or set them up via the client libraries and the selected events will be viewable in the dashboard. Events can be replayed for debugging/developing purposes. 

Our [python](https://github.com/balanced/balanced-python) and [ruby](https://github.com/balanced/balanced-ruby) client libraries now support adding and removing callbacks, and browsing events. The [PHP](https://github.com/balanced/balanced-php/issues/15) and [Java](https://github.com/balanced/balanced-java/issues/4) libraries will be updated soon. [Here's an example](https://github.com/balanced/balanced-ruby/blob/master/examples/events_and_callbacks.rb) from the ruby library of how to use callbacks with the client libraries.

Let us know if you'd like to see examples of how to consume these events, we use them internally for all sorts of stuff so we've developed some patterns that may be handy. 

A bug? Something missing? Let us know by commenting in [this thread](https://github.com/balanced/balanced-api/issues/70#issuecomment-13589282)!
