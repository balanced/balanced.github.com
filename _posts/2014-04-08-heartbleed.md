---
layout: post
author: Steve Klabnik
author_image: /img/authors/steve_klabnik.png
title: "Heartbleed"
image: /img/blogimages/2014-04-08.jpg
cover_image: /img/blogimages/2014-04-08-cover.jpg
tags:
- balanced
- security
---

# Heartbleed

Yesterday, a serious vulnerability, [CVE-2014-0160](https://www.openssl.org/news/secadv_20140407.txt)
\("[Heartbleed](http://heartbleed.com)"\), was disclosed regarding certain versions of
[OpenSSL](https://www.openssl.org), a very popular library used on many websites on the internet.

We'll cut to the chase: [Balanced](https://balancedpayments.com), like almost everyone on the web, was 
affected by Hearbleed. **No customer data was directly leaked by this vulnerability, and we've since 
patched our servers and rotated our keys.**

If you use an official client library, we will be releasing some nice-to-have updates in the near 
future. If you've logged into Balanced from a public or unsecure wifi connection, you may want to 
rotate your API keys to be extra safe.

Now that that's out of the way, let's talk details.

## About Heartbleed

You can read [http://heartbleed.com/](http://heartbleed.com/) for a full summary,
but this paragraph explains it most succinctly:

> The Heartbleed bug allows anyone on the Internet to read the memory of the
> systems protected by the vulnerable versions of the OpenSSL software.
> This compromises the secret keys used to identify the service providers and
> to encrypt the traffic, the names and passwords of the users and the actual
> content. This allows attackers to eavesdrop on communications, steal data
> directly from the services and users and to impersonate services and users.

Unfortunately, the versions of OpenSSL that were affected have been used widely
over the last two years, and so quite a large number of hosts were affected. :(

## How it affected Balanced

If you read [my previous post on Balanced's
architecture](http://blog.balancedpayments.com/balanceds-architecture/), you'll
know that we are built using Service Oriented Architecture. This means that the primary hosts of
ours that are exposed to the broader internet are
https://api.balancedpayments.com and https://js.balancedpayments.com . Those
both go through `Midlr`, so it's really one set of servers that was affected.

Remember, Heartbleed allows you to read the memory of the affected server --
`Midlr`. The ELB essentially terminates SSL and forwards the request on,
the only sensitive information that is in RAM on `Midlr` is the private key
for our SSL certificates.

So what happens when someone gets our SSL private key? In a certain sense, it
turns HTTPS into HTTP: what was previously a confidential conversation between
the two of us could be listened in by a third party.

## Steps we have took/are taking

As a first step, we've upgraded OpenSSL on all of our hosts, regardless of their
exposure, and we've rotated all of our keys.

We also put pressure on AWS and were among the first companies to have our 
ELBs upgraded.

`Knox`, our PCI store which contains our card data, has also undergone full key
rotation, and we've re-encrypted all of our card data with a new key. You can
never be too safe.

We're currently discussing things with our upstream vendors to make sure that
they are also patched up quickly.

## Client libraries

Doing a survey of our most commonly used client libraries, it seems that support
for upgrading our client libraries to use certificates is pretty spotty, and requires
manual intervention to verify that you're not using a valid-but-revoked certificate.

We will need to upgrade our client libraries need to use the new certificate.

We are working on patches to add this functionality to our client libraries,
but that will take some time. Expect an update on that front soon.

## Steps you may wish to take

### Check if you're vulnerable

You can use publically available 3rd party code to check if your application stack is vulnerable.  
Here are some helpful links:


- http://filippo.io/Heartbleed/
- https://github.com/FiloSottile/Heartbleed
- https://gist.github.com/takeshixx/10107280
- https://gist.github.com/mitsuhiko/10130454

If you've logged into Balanced via an untrusted connection lately, you may wish
to revoke your API keys and generate new ones. We've built a convenient GIF for you:

![ROTATENOW](http://i.imgur.com/s6KnEw8.gif)

And that's it!

If you have any questions about this vulnerabilty and how it affects you,
we'd be happy to help. Please [jump into #balanced on
Freenode](https://webchat.freenode.net/?channels=%23balanced) and
ping `steveklabnik` or `mahmoudimus`, and we'd be happy to discuss
it further.

## Summary

Every once in a while, a security issue happens. It's unfortunate that this one
is so serious and yet so widespread. We take these kinds of issues very
seriously, and take steps as quickly as we can to protect you and your data.

-- Steve and Mahmoud
