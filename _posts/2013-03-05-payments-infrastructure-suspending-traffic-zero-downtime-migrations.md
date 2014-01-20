---
layout: post
author: Marc Sherry
title: "How Balanced does Database Migrations with Zero-Downtime"
image: /img/blogimages/2013-03-05.jpg
cover_image: /img/blogimages/2013-03-05-cover.jpg
tags:
- balanced
- operations
- devops
- haproxy
- infrastructure
---

## Suspending Traffic for Zero-Downtime Migrations

Some time ago, we had to perform a fairly intensive database migration. Since we process payments for a number of marketplaces who don't want any downtime at all, scheduling a maintenance window to perform the migration wasn't an option.  We had to do everything without taking our app offline for even a short period of time.

### tl;dr
We used HAProxy to suspend traffic for a short period of time, while we switched out DBs.

### The normal way

Normally when doing a database migration online, the correct way to do this involves multiple steps:

- perform schema changes in a way that won't break existing code (e.g., temporarily allowing new non-nullable columns to be NULL).
- deploy code that works with both the old and new schema simultaneously, populating any new rows according to the new schema.
- perform a data migration that backfills any old data correctly, and updates all constraints properly.
- deploy code that only expects to see the new schema.

### The harder way

Our migration was drastic enough that the amount of code we would have had to write to be compatible with both schemas simultaneously was prohibitive, so we started looking for a simpler way. We reasoned that if we could continue to accept incoming requests, but keep them from hitting our app for a short period of time, we could perform the migration and replace our code in one step.

Most clients hitting our API will time out after 60 seconds with no response, so this set an upper bound for how long we could stall traffic. As it happens, we have some customers with even stricter client-side timeouts set, and we wanted to keep everyone happy. This led us to settle on 15 seconds as the longest we could stall traffic and not get any complaints from our users.

Since we couldn't stop requests from coming in, and we didn't want any incoming requests to fail, we would have to hold them somewhere. We were familiar with the approach that Braintree, another payment service provider, had used to [solve a similar issue](https://www.braintreepayments.com/braintrust/switching-datacenters), but their approach involved custom routing software and holding all requests in a Redis queue, which didn't really fit with our existing topology.

Our topology looks like this:

![Balanced topology](http://i.imgur.com/khBVvSZ.png)

We have an Amazon Elastic Load Balancer at api.balancedpayments.com proxying to a number of nginx instances, which forward traffic to HAProxy load balancers. These HAProxy instances proxy traffic to our Balanced application instances. Being that our topology is so simple, there are only a few places where requests can be held -- nginx, HAProxy, or our app itself. Of the three, HAProxy seemed like the most likely candidate.

HAProxy is an amazing piece of software. In addition to being extremely quick and reliable, it's also configurable on the fly, via its (oddly-named) "stats socket". By piping commands to a UNIX socket, one can dynamically change many parameters and control how requests are proxied. In this case, we wanted to tell HAProxy that Balanced was still up (so it didn't report 5XX errors to the client), but that it shouldn't forward any new requests.

### Initial failures


Our first thought was to modify the haproxy.cfg file, using our [chef](http://www.opscode.com/chef/) infrastructure, and set the `maxconn` property for the Balanced backend to zero. According to the [HAProxy docs](http://haproxy.1wt.eu/download/1.5/doc/configuration.txt), `maxconn`

> is the maximum number of concurrent connections the frontend will accept to serve. Excess connections will be queued by the system in the socket's listen queue and will be served once a connection closes.

This sounds like what we want -- the OS itself will queue requests, and once we're done we can just modify the config file and SIGHUP HAProxy to get the new value. Except this didn't work. Setting `maxconn` to zero worked just fine -- requests were kept alive from the client's point of view, and never hit our app. It turns out, though, that HAProxy responds differently than other software to SIGHUP, and doesn't use it to reload its config file. Oops.

The documentation also mentions using SIGTTOU and the '-st' and '-sf' options as a "soft-reconfiguration mechanism," which sounds great. Unfortunately, the way it works wasn't quite as expected -- you issue SIGTTOU to pause proxies, then start a *new* instance with the new config. This means that any connections to the instance of HAProxy with `maxconn` set to zero will never get a chance to complete.

### Finally

These failures eventually led us to the previously-mentioned stats socket, which allows us to issue the command `set maxconn frontend balanced 0` to stop accepting new connections for a given frontend, and `set maxconn frontend balanced 100` to start again. So simple! Except -- first, we had to upgrade to the HAProxy development version (1.5) to support setting `maxconn` on the frontend at all. Then, the first command didn't work, since the 'set' command would only accept values over zero. I was about to hack a fix into HAProxy myself, but first decided to contact Willy Tarreu, the author, to see if he had a better recommendation. After discussing the issue, he was kind enough to release a small patch allowing `maxconn` to be set to zero in the `frontend` context and test it in the use case I had described.

We tested how long the database migration would take on a copy of the database, and got it down to 13 seconds. This gave us a two-second leeway in which to perform all the administrative tasks involved in this migration. We had two people open terminals and prepare the commands to be run, and prepared to execute them rapidly in sequence.

### The process

- Deploy an instance of the app with the new code, but don't route any traffic to it.

    ![New code (inactive)](http://i.imgur.com/SZMZiks.png)
- First engineer suspends all traffic to our Balanced frontend, queueing requests in HAProxy. Yell at the other person to start the data migration.

    ![All suspended](http://i.imgur.com/GkwL4Zr.png)
- Second engineer starts the data migration.
- Wait 13 seconds for db migration to complete. Yell at the first engineer that the migration is done.
- First engineer quickly resumes traffic to the app instance with new code.

    ![New code active](http://i.imgur.com/dk8IfsQ.png)
- Deploy updated code to all instances and resume at leisure.

    ![New code everywhere](http://i.imgur.com/kqn3xXJ.png)

The first time we attempted this it worked flawlessly, with no requests failing or timing out.

### Usage

We added two simple tasks to our Fabric fabfile:

    @parallel
    def suspend():
        """
        Suspends all connections to balanced. To be used sparingly.
        """
        with _make_tunnel():
            run('echo "set maxconn frontend balanced 0" | socat stdio /var/lib/haproxy/stats')
     
    @parallel
    def resume():
        """
        Re-allow connections to balanced.
        """
        with _make_tunnel():
            run('echo "set maxconn frontend balanced 100" | socat stdio /var/lib/haproxy/stats')


Now, using Fabric to automate the stats socket commands across all instances of HAProxy simultaneously, we can issue a simple command like `fab suspend` to hold all requests indefinitely, perform any time-consuming migrations/code updates/deploys, and then issue `fab resume` to allow the blocked connections to finally make their way to our backend. We've only had to use this heavy-handed approach twice in the past six months, whereas we've performed hundreds of code deploys and tens of database migrations, but having the option available to us has been a lifesaver.
