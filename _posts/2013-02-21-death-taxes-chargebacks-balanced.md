---
layout: post
author: Ganesh Venkataraman
title: "Death, Taxes, and Chargebacks"
tags:
- balanced
- fraud
- data
- chargebacks
---

##Target Audience
Anyone who handles commerce online - stores, marketplaces, payment processors
etc. I don't care if you are a customer or a competitor. If you are dealing
with fraud, you are my brother/sister of mine. Read on.

##Objective
Share the knowledge/wisdom I gained so you benefit from it and hopefully spread
the knowledge around. One of the issues with fraud material I have seen online/offline is that they
fail to provide real data. I promise I will at the end of this blog. Yes, this
is from real transaction data - not some made up statistics/intuition/I
overheard from blah etc.

##TL;DR

1. Fraud happens, do not panic
2. There are different types of chargebacks. Each requires a different risk minimization technique
3. Build high-pass filters: "bad for fraudsters, neutral on UX" 
4. Real data from Balanced (see #5 below)
5. Additional reading is shared at the end of this post

##1. Fraud happens

You are living in delusion/denial if you are running an ecommerce business and think you are immune to fraud. It is bound to
happen. It is a statistical certainty. And it's not all that bad.

##2. Got fraud? Do NOT panic

We have seen our customers -- usually marketplaces -- repeatedly panic after the first fraud attack. This
is normal. Do NOT panic. A wise man once told me that
the worst time to go over your insurance policy details is after you get sick. Same goes
with fraud, check the following prior to being hit with *any* form of fraud:

1. Who's liable? You, the seller (in case of marketplaces), third party fraud protection etc.
2. What are my next steps? Do I contact the seller to stop shipment (assuming he/she is not fraudulent)? Do I contact the buyer to make sure this is not a misunderstanding (more on this later)? Do I pull money out of the seller's account? Do I blacklist seller/buyer? Do I have the ability (I mean software ability) to do so?

If you use Balanced, contact us, we will guide you through the process

##3. A consequence of fraud - Chargebacks

To understand chargeback, you need to first understand the flow of money. Assume that you are an online store selling shoes ('Shoes r us') and Joe comes in to buyer a pair of shoes.

Here are all the parties involved:

* Joe - _Buyer_
* Joe's card network - _Visa_
* The bank which issued the card - _Bank of America_ (Issuing bank)
* Processor for 'Shoes r us' - _Balanced Payments_
* The bank where funds will be deposited - _Chase_ (Acquiring bank)

Money flows in this direction:

Issuing bank (_Bank of America_) --> Acquiring Bank (_Chase_) --> Processor (_Balanced Payments_) --> Merchant (_Shoes r us_)

Chargeback happens when Joe calls up Bank of America and tells them 'I can't
recognize this charge' or tells them 'I paid $50 for this shoe and I have been
charged $100'. 
Here are the possible reasons why Joe could have done that:

1. Joe received an innocent email from Anuoluwa Obadina and clicked an attachment. Or that seemingly innocuous compliment on design of Joe's credit card which made Joe overlook the extra time the waiter spent looking at the card. Ok, you get the picture, Joe's credit card information was compromised.
2. Joe genuinely forgot about the purchase. 
3. Joe is a douche bag who is attempting to game the system by claiming he never received the shoes.

Either way, if you are a marketplace or a merchant you are responsible for this (barring any special contracts you signed with the processor or a third party) Ultimately, what affects your bottom line as someone accepting cards online for good or services is not fraud, but chargebacks. Sure, they are correlated, but as I pointed above, chargebacks can happen due to reasons other than fraud. So, let's move on and look at means to avoid them.

##4 "Bad for fraudsters, neutral on UX" 

Chargebacks happen due to different reasons and each type needs different approach. The premise for all fraud prevention is simple - "How do I create practices that makes it hard for fraudsters to operate *and* does *not* create a poor user experience for legitimate customers/users"? You could go ahead and collect blood sample for every seller in your marketplace. I pretty much guarantee zero fraud this case - because you will have zero transactions. What you really need is a middle ground - "Bad for fraudsters, neutral on UX." Think of it like a [high-pass filter](http://en.wikipedia.org/wiki/High-pass_filter): You want legitimate users to pass through your fraud system unaffected, while filtering out the fraudsters. 

###4.1 Misunderstanding - Customer genuinely does not recognize the charge.

'Soft descriptor' is your friend. 'Soft descriptor' is the line item you see in your credit card statement against each charge. Example of soft descriptors pulled from my own statement: 'Taco Bell', 'Amazon.com amzn.com/bill', 'New York Pizza Palo Alto', pretty obvious who made these charges. And that's what you should strive for. A soft descriptor which makes it really obvious to the customer. For example, balanced lets you customize the soft descriptor. Here's our recommendation on what to put in:

1. Your marketplace name
2. Your support number

If the customer calls in to your support number *before* reaching for the bank, BOOM you have just avoided a chargeback. Make sure someone is available in normal business hours and you have the ability to receive voice mail after hours.

###4.2 Minimizing 'friendly fraud' 

I call Joe acting as a douche bag 'friendly fraud' (in reality, there's nothing friendly about it). To minimize friendly fraud, here are our recommendations:

1. Collect shipping address, shipping carrier and tracking code for any product that is being shipped. This is zeroth order stuff - no exceptions.
2. On transactions above a certain threshold (say $250), make sure you get delivery confirmation. 

I believe both (1) and (2) falls under "Bad for fraudsters, neutral for UX". Legitimate sellers will understand the need for delivery confirmation on high valued items

###4.3 Minimizing real Fraud

Ok, this probably deserves more than a Ph.D. thesis and blog post is not going to cover everything. I will try to cover as much as possible from the marketplace perspective.

###4.3.1 Think probabilistic not deterministic

Wrong way to think - "Is this transaction fraudulent?". Right approach - "What is the probability that this transaction is fraudulent?". You see with fraud (as with most things in life), things are fuzzy. So, what you are really looking for is to minimize your risk. With this mentality, you accept the fact that sometimes you may be wrong. What you are working for is not an unrealistic path towards zero fraud, but the more pragmatic approach to minimizing your exposure. To this end, you have two friends - Data and that Bayes theorem everyone's talking about. Bayes theorem itself is really simple and there's tons of literature available online. So I am not going to get into that. The best one I have seen so far is [here.](http:////www.quora.com/What-does-it-mean-when-a-girl-smiles-at-you-every-time-she-sees-you)

Now coming to data (and what I promised). Here are things you can look at:

###4.3.2 Velocity/actual amount of transactions from what you believe is the same person. 
This could be as simple as same email address/same IP address/cookie etc. It could get a bit more complex if you are using some sort of device fingerprinting (careful, check with your lawyer on privacy issues). You expect a normal shopping cart to have 1.7 items on an average and you now have a shopping cart which 17 items? You expect star wars DVD's to be sold in your marketplace for $30 and now you have a DVD collection priced at $550. These are all outliers. By no means do they confirm fraud, but give you valuable signals and add further evidence (Bayes my fried, Bayes)

###4.3.3 Social Signals 
Are you signing in via facebook/twitter? If yes, do you know the number of friends/followers/following? Do you know the account creation date? So, you have a transaction for $550 on an item that's normally priced at $55 by someone with zero friends on facebook and account created yesterday? Should you review this? I think we know the answer.

###4.3.4 Collusion

Anything that makes you think there's collusion between buyer and seller. Simple example: Buyer steals someone else's credit card information. Buyer also lists himself as a seller on your site. Buyer claims to "buy" the product and seller claims to "ship" it. Yours being "MVP, I need this site out asap" does no verification (no shipping information, tracking information etc.). Boom, you just got frauded. In this case, it was quite simple to detect that Buyer == Seller. 

###4.3.4 AVS
'Address Verification System'. Verifies if you card number/expiration date matches with the billing address provided. The system, however is far from perfect due to the following reasons:

1. Not all banks support it (damn)
2. High in false positives (people move, mistype addresses etc.) 
3. Only verifies the numerical portion of the address

Looking at these factors, it is easy to conclude that if you take the iron hand approach of rejecting all transactions based on AVS failures, you will lost quite a bit of legitimate ones (I will provide exact data shortly). Our take on AVS - treat it as any other signal.

###4.3.5 CSC
'Card Security Code'. Flip you card and you will see a security code. Most banks do support CSC and unlike address, the false positives are rather low. Our data suggests very high fraud rate with relatively low number of false positives. Our recommendation on CSC failure - if you are starting off with low transaction volume and a rudimentary fraud system (or non-existing fraud system), treat CSC as hard failure. Accept the fact that you will lose 2% percent of legitimate transactions. If you have high transaction volume and have the means to look at other signals, do not give veto power to CSC. Treat it as a signal (with much higher weight that AVS)


##5. Data (as promised):

<table border="1">
<tr>
<th>Signal</th>
<th>Fraud Probability</th>
</tr>
<tr>
<td> High Velocity(24 hrs) </td>
<td>21.7%</td>
</tr>
<tr>
<td>CSC Failure</td>
<td>16.93%</td>
</tr>
<tr>
<td>AVS Failure</td>
<td>4.41%</td>
</tr>
<tr>
<td>Txn amount > mean + 3*sigma</td>
<td>20.44%</td>
</tr>
<tr>
<td>Account created recently</td>
<td>5.2%</td>
</tr>
<tr>
<td>Country known to be high risk</td>
<td>14.87%</td>
</tr>
<tr>
<td>IP->billing distance high</td>
<td>4.29%</td>
</tr>
<tr>
<td>High # of cards from same person</td>
<td>100%</td>
</tr>

</table>

So, the table has two columns - first one represents the signal and I believe
it is self evident what the signal means. The second column represents
the probability of a transaction being fraudulent given the signal is true. For example, if
you have an AVS failure, the likelihood of the transaction being fraudulent is
5%. There is some subjectivity in this information - 'High Velocity' could mean
different things. So, don't treat these numbers like Gospel, but as a general
guide. The way to read it is a CSC failure about 4 times more risky than AVS.  


References:

1. [Essentials of Online payment Security and Fraud Prevention](http:////www.amazon.com/Essentials-Online-payment-Security-Prevention/dp/0470638796)
2. [Using social network data for fraud prevention](http:////blog.signifyd.com/2013/01/22/social-network-data-fraud-prevention/)
3. [Detecting Malice](http://www.detectmalice.com/)
4. [Ohad Samet's blog on risk](http://www.ohadsamet.com/blog/)

---
This post made the front page of HN. Upvotes appreciated :)
1. Go here: http://news.ycombinator.com
2. Search for "Nothing is certain, except death and taxes .. and chargebacks"
3. Upvote
