---
layout: post
author: Steve Klabnik
author_image: https://github-camo.global.ssl.fastly.net/33437474963ee5377ce471d24fd23c6dbb3c50c9/687474703a2f2f626c6f672e62616c616e6365647061796d656e74732e636f6d2f696d672f617574686f72732f73746576655f6b6c61626e696b2e706e67
title: "Pull Request Inception"
image: /img/blogimages/2013-12-13.jpg
cover_image: /img/blogimages/2013-12-13-cover.jpg
tags:
- balanced
- collaboration
- workflow
- engineering
---

## Pull Request Inception

Since all of our code at Balanced is open source, we make heavy use of pull requests. Today, 
I'm collaborating with one of our engineers, [Matthew](https://github.com/matthewfl), on our API
specification project. I have an upcoming blog post to discuss more about this project, but for now,
I'd like to share with you a technique we call "pull request inception."

First, a recap of pull requests: Pull Requests are a feature of GitHub, modelled after the way that
the Linux kernel handles merging changes. In the kernel, you make a post to a mailing list with a patch.
The full process is explained [on this page of the Kernel Newbies wiki](http://kernelnewbies.org/UpstreamMerge/SubmittingPatches).
GitHub took this idea and built an entire feature around it. You can see [the full pull request documentation here](https://help.github.com/articles/using-pull-requests),
but the basic idea is this: you ask for one branch to be merged into another.

So, [here is my pull request implementing our new API specification](https://github.com/balanced/balanced-api/pull/431).
I've been working on it for a while, and there's lots of discussion. Today, Matthew started helping me out, and
he noticed there was a lot of duplication in my HTTP request code. It happens, the feature isn't done yet! So, he
fixed it, and then sent me this on HipChat:

![pr inception](http://i.imgur.com/w8EVXEI.png)

As soon as I saw that, I instantly heard [BWAAAAAAAAA](http://inception.davepedu.com/noflash.php).

Anyway, so that's what we did. You can [check out Matthew's pull request against my pull request here](https://github.com/balanced/balanced-api/pull/440).
Funny enough, another Balanced employee, Marshall, just happend to see this come by, and spotted an error in the diff.
I'm not even sure if Marshall knew we were working on this together, but because of the open nature of GitHub,
he was able to jump in and help out. If we did it all in private, that never would have happened.

This works because pull requests are tied to branches. So if I'm requesting to merge branch B into branch A, that's the same as someone asking to merge branch C into my branch B. A pull request to a pull request.

Sending pull requests to pull requests is a really interesting part of the way that Git and GitHub 
interact. That's all I've got for you today, have a great weekend!


(Okay, one last thing: I of course [made a pull request about my blog post about pull requests to pull requests](https://github.com/balanced/balanced.github.com/pull/52)
so that my co-workers could proofread this before I posted. BWWWAAAAAAAAAAAA)
