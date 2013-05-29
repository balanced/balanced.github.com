---
layout: post
author: Nick Kleinschmidt
title: " Ember.js Dashboard: Building Search"
tags:
- balanced
- engineering
- ember.js
---

## Ember.js Dashboard: Building Search

To continue digging into Ember.js, we wanted to walk through the how we built the search system in the dashboard. This should help illustrate our design and development process. More specifically, we'll dive into how to construct models, choosing the right Ember.js components, and developing reusable widgets.

#### Design

We started out with an [open discussion on Github](https://github.com/balanced/balanced-dashboard/issues/29) of how search should work and what data it should return. After gathering info from all the stakeholders, we started designing how search would look.

![Image](https://f.cloud.github.com/assets/2037452/422511/bc188db0-ad29-11e2-9e3f-fa046e2065f5.png)

If you browse the thread, you'll see the high level of detail our designer [Damon](https://github.com/dmdj03) gave us including font sizing, column layouts, opacity, and rollover behavior. This greatly reduced the back-and-forth between developers and designers during the building process.

#### Data Model

We started out by creating types for the data that needed to be returned in search results. Through this guide, I'm just going to focus on transactions. The code for accounts, bank accounts, and credit cards is similar. Since we wanted to show different types of transactions grouped together, we created a parent class for transactions from which children extended.
	
	Balanced.Transaction = Balanced.Model.extend({
	
	});
	
	Balanced.Debit = Balanced.Transaction.extend({
	    funding_instrument_description: function() {
	      return this.get('source').card_type;
	    }.property('source')
	});
	
	Balanced.Credit = Balanced.Transaction.extend({
	    funding_instrument_description: function() {
	      return this.get('bank_account').bank_name;
	    }.property('bank_account')
	});

The tough decision was choosing how to perform search queries themselves. We saw two clear choices.

1. Write a custom AJAX query and parse the data when it returns
2. Treat a search query as a model object

We tried both and opted for the second option. Since our API uses hypermedia, we'd already customized our data layer to use URI as the unique identifier instead of ID, so this made it easy to represent a single search as a model object. This allows us to take advantage of all of our model features as well as any model caching we may implement in the future.



	Balanced.SearchQuery = Balanced.Model.extend({
	});
	
	Balanced.SearchQuery.reopenClass({
	   search: function (marketplaceUri, params, options) {
	        var uri = marketplaceUri + '/search?q=' + params.query;
	        return this.find(uri, options);
	    }
	});

With this code in place, running a search is simple.

	var searchResult = Balanced.SearchQuery.search(marketplaceUri, {
	    query: query
	});

#### User Interface

Why it's not a route.

Controller

Views
	date picker
	headers
	
Template/isLoading

#### Date Picker Widget

How to build out a widget view

How to embed it in the page

How to fire change events to the parent

How to handle those change events in the parent

#### Tying It All Together

1. Typing into the search box updates the query in the controller
2. Updating the date filter updates the query in the controller
3. Controller calls off on model to update
4. When model is fetched, controller updates content/isLoading
5. Template updates dynamically

#### Testing

Why it's awesome that we used a model / URI identifiers.

#### Final Thoughts

Hopefully this was helpful.

You should contribute.

You should join our team.