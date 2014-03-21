---
layout: post
author: Marshall Jones
author_image: /img/authors/marshall_jones.png
title: Introducing Balanced's New API&#58; rev 1.1
image: /img/blogimages/2014-03-20.jpg
cover_image: /img/blogimages/2014-03-20-cover.jpg
tags:
- balanced
- api
- orders
---

# "Orders" Help Marketplaces Keep Track of Their Money

Since launching revision 1.0 of the Balanced API in 2012 we have been working closely with customers to help them efficently manage and pay out funds. A recurring pain point for our customers was having to keep track of which funds were allocated to which merchant. When one of our customers made a mistake they would end up paying out funds to one merchant using funds allocated for another. This was frustrating in the best case and expensive in the worst.

Balanced's release of [revision 1.1](https://docs.balancedpayments.com/1.1/overview/resources/#changelog) of the API resolves this by creating a new construct called [Orders](https://docs.balancedpayments.com/1.1/api/orders/). An Order behaves like an escrow in that you can hold funds within it and then release the funds when ready. However, an Order is created per merchant so that there is no co-mingling of funds. If you debit $100 from a buyer's card into an Order that $100 is only payable to the merchant associated with that Order. If you refund the buyer $50 then you can only pay out the remaining funds in the Order so it's no longer possible to dip into funds allocated for one merchant to another.

Let's break this down into a real-world use-case to help better illustrate how Orders are useful, let's say you're a [crowdfunding site](https://crowdhoster.com). 
   
## A Quick Walkthrough 
An Order would be a natural mapping to a campaign on your crowdfunding site. If Joe Blogs creates a campaign then you would also create an Order on Balanced. Let me whip out some ruby psuedo code. 
   
{% highlight ruby %}
seller = Balanced::Customer.find(seller_href)
order = Balanced::Order.new(:customer => seller).save
{% endhighlight %}

Then, every time someone contributes to the campaign, you would simply associate the related card debit to the order. 

{% highlight ruby %}
card.debit(:amount => 100, :order => order)
{% endhighlight %}

Now we can interrogate the Order object to find out how much we've taken in for the campaign and other interesting facts
   
{% highlight ruby %}
order.amount_escrowed
=> 100
{% endhighlight %}

When the campaign closes, we can pay out to the merchant and take our cut, Balanced will ensure that the total amount paid out does not exceed the total amount paid into the Order. In this example we pay ourselves out 10% and the remainder to the merchant:
   
{% highlight ruby %}
profit = order.amount_escrowed * .10
order.credit_to(
   :destination => order.merchant.bank_accounts.first, 
   :amount => order.amount_escrowed - profit
)
order.credit_to(
   :destination => Balanced::Marketplace.my_marketplace.owner_customer.bank_accounts.first, 
   :amount => profit
)
{% endhighlight %}

And that's all there is to Orders! Balanced focuses on providing features that address the problems marketplaces face as they scale their business. Orders save Balanced customers hundreds of thousands of dollars in accidental payouts and account reconciliation. If you'd like to discuss with us how Orders can help your business [send us an email](mailto:support@balancedpayments.com) or [jump into IRC](http://webchat.freenode.net/?channels=balanced&uio=MTE9OTIaf) and chat with a Balanced employee any time.
