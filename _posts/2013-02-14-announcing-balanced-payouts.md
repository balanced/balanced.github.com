---
layout: post
author: Jareau Wade
title: "Announcing Balanced Payouts"
tags:
- balanced
- payouts
- product announcement
- ACH
---

### Introducing Balanced Payouts

We're thrilled to announce the official release of our newest product: [Balanced Payouts](https://www.balancedpayments.com/#payouts), a stand-alone, white-label API for sending money to anyone's bank account via the ACH network. 

Payouts is for companies (e.g. online marketplaces and ad networks) that need to send money to many recipients each week or month. Recipients don't need to create a Balanced account to receive funds, and you control when payouts occur -- the money goes straight to their US-based bank account the next business day. Balanced Payouts can be used with any payment processor, but of course we'd love it if you [used Balanced for processing as well](https://www.balancedpayments.com/#integrate) :). Each payout costs 25¢. 

#### Productizing Payouts
We've had the ability to deposit funds in a merchant's bank account as part of our full marketplace payments stack for some time, but about a month ago, [we showed HN](http://news.ycombinator.com/item?id=5026802) a single curl command version of this technology, and the response was [overwhelmingly positive](http://news.ycombinator.com/item?id=4794738). Developers want a stand-alone, no-hassel way to send funds to their merchants/vendors/sellers. Here's a curl command that let's them do that:

    curl https://api.balancedpayments.com/v1/credits \
        -d amount=10000 \
        -d description="Math lesson" \
        -d bank_account[name]="Johann Bernoulli" \
        -d bank_account[account_number]=9900000001 \
        -d bank_account[routing_number]=121000358 \
        -d bank_account[type]=checking \
        -u 7b7a51ccb10c11e19c0a026ba7e239a9:

So after the *Show HN* post, we updated our [client libraries](https://www.balancedpayments.com/docs/overview?language=bash#client-libraries) to support this operation, and worked with several fantastic beta customers (see below) as we smoothed out the API and [docs](https://www.balancedpayments.com/docs/api?language=ruby#credit-a-new-bank-account). These beta customers tell us we've built the world's only REST API for ACH deposits, so today it's our pleasure to share Payouts with the world. We hope it will save you hours of headache writing checks, struggling with the PayPal API, or manually submitting ACH deposits through you bank's ancient web portal. 

#### Payouts for Ad Networks
Balanced is *the* payments platform for online marketplace, but one happy accident of the beta period was that we attracted customers from an entirely new vertical: advertising networks. [Vungle](http://vungle.com/), for example, is a mobile video network, which, after collecting payment from advertisers, uses Balanced to make payouts to their publishers bank accounts at the end of each month. Here's what they had to [say](https://angel.co/activity/startup_role/508489) about us: 

> Balanced is an awesome, one of a kind ACH payout API

If you're an ad network looking to pay your publishers via ACH, we'd love to hear from you. Email: support at balancedpayments.com. 

####  Payouts for Marketplaces
Like I said, Balanced is the payments platform for online marketplace, so it's no surprise that several marketplace, like [CourseHorse](http://www.coursehorse.com/), have already adopted Payouts. Here's why CourseHorse selected Balanced:

>We were initially looking for a cheap, easy way to pay our schools for enrollments, and after scouring the market, we found Balanced to be the easiest way to send safe, reliable ACH payments for only 25 cents per payment.

>The team there has been incredibly over-the-top helpful as we get started, and our intention is to eventually replace our current payment processor with Balanced.

#### Looking Forward
We don't want to stop here. Balanced's philosophy for payouts is to get money into the hands of the recipient in a useable form as quickly as possible. To that end, [we're exploring international payouts](https://github.com/balanced/balanced-api/issues/44) so recipients outside of the US don't have to wait any longer than their US-based counterparts for that sweet, sweet cash. 

#### Launch Partners:
Special thanks to our launch partners for putting up with our warts and making us better:

- [Vungle](http://vungle.com/): In-app video ads
- [Grubwithus](https://www.grubwithus.com): Social meals
- [CourseHorse](http://coursehorse.com/): Marketplace for local classes
- [Kibin](https://www.kibin.com/): Professional editing
& proofreading services
- [Adworkz](http://www.adworkz.com/): ad network
- [Simple Donation](https://simpledonation.com/) Simple donation forms

If you'd like to learn more about [Balanced Payouts](https://www.balancedpayments.com/#payouts), please email: support at balancedpayments.com, and mention 'Payouts' in your subject line. 

---
UPDATE: 

[Ryan Lawler](http://twitter.com/ryanlawler) over at [Techcrunch](http://techcrunch.com/2013/02/14/balanced-payments-ach-api-omg/), and [Ken Yeung](https://twitter.com/thekenyeung) at [TheNextWeb](http://thenextweb.com/insider/2013/02/14/balanced-releases-its-payouts-api-as-a-standalone-offering-giving-access-to-next-day-ach-deposits) were kind enough to cover this announcment for us.

We're discussing this announcement on HN: http://news.ycombinator.com/item?id=5220161 & http://news.ycombinator.com/item?id=5220963
