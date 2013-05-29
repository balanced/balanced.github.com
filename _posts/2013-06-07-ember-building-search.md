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

We tried both and opted for the second option. Since our API uses hypermedia, we'd already customized our data layer to use URIs as unique identifiers instead of IDs, so this made it easy to represent a single search as a model object. This allows us to take advantage of all of our model features as well as any model caching we may implement in the future.

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

Going from the top down, the first choice was: is search a route or just a controller? Since we wanted search to be embedded at the top of every page, performing a search doesn't change the overall application state. This led us to make search a controller that's rendered into our application layout, rather than a route. If we were going to have a page with a URL for searches, that's when it would be appropriate to use a route.

Generally we wanted the controller to handle all the logic about queries, filters, and dealing with results. We broke down the views into logical components to keep things simple.

![View Composition Diagram](TODO)

We used a simple valueBinding on an input view to bind the query box to a variable on the controller.

	{{view Balanced.SearchQueryInputView valueBinding="search" action="query" name="q" id="q" autocomplete="off"}}

Thanks to the magic of Ember bindings, the value of the input box is now automatically synced to the corresponding variable we've definied in our controller and available for use.

	Balanced.SearchController = Balanced.ObjectController.extend({
		search: '',
		
		…
	});

One aspect that complicated things a bit was that while the search was being performed, we wanted to display a loading spinner. We didn't want to display the results panel until the results had actually returned.

Displaying the loading spinner was simple. We added a property to our controller called `isLoading` and updated it when we were actually performing a search. Then in the template, we could just use a simple conditional to display the loading spinner.

	{{# if isLoading }}
	    <span class="loader loading"></span>
	{{else}}
	    <span class="close" {{action closeSearch target="view"}}>×</span>
	{{/if}}
	
Displaying the results panel was a bit more complicated.

TODO - we should clean up the callbacks we're passing all over the place for search and use Ember observers instead. Describing how it works now will be overly complicated for no reason.

#### Date Picker Widget

One of the more substantial widgets we had to create to get this working was the date picker.

![Date Picker](http://i.imgur.com/mF26ftR.png)

The first consideration was what type of component it should be. The date picker doesn't deal with models or business logic at all, so it didn't make sense to make it a controller. It did have a significant amount of JavaScript to power all the advanced functionality, so we opted to make it a reusable view.

In order to communicate date selection changes, we fire events to the controller containing this view and let the controller handle it.

	Balanced.SearchView = Balanced.View.extend({
	  templateName: 'search',
	
	  selectSearchResult: function(uri) {
	    this.reset();
	    this.get('controller').send('selectSearchResult', uri);
	  },
	
	  ...
	  
	  _changeDateFilter: function(label) {
	    this._setTimingTitle(label);
	    this.get("controller").send("changeDateFilter", this.minTime, this.maxTime);
	  },
	});

In order to handle the update in the controller, you just need to write a handler for the `changeDateFilter` event.

	Balanced.SearchController = Balanced.ObjectController.extend({
		…
		
		changeDateFilter: function (minDate, maxDate) {
		    this.set('minDate', minDate);
		    this.set('maxDate', maxDate);
		    this.query();
		},
		
		…
	});

Once the view and template have been defined, embedding it into another template is simple.

	{{view Balanced.DatePickerView}}

#### Tying It All Together

1. Typing into the search box updates the query in the controller
2. Updating the date filter updates the dates in the controller
3. Controller does a search for a search query model using the search parameters
4. When model is fetched, controller updates content and isLoading
5. Templates updates dynamically from the bound variables

#### Testing

As part of our quality process and to help contributors, we maintain test coverage for every part of our system including the front-end applications. We're using a simple JavaScript testing process using QUnit for testing and PhantomJS to run the suites through the command line.

Since we built our search query as a model object, adding test data for it is easy. We added fixtures with URIs specific to what we were testing and wrote our tests against that. Testing a new query or filter is as easy as adding a new fixture object that matches the search URI.

#### Final Thoughts

Hopefully this gave you more insight about how we develop software and how to use Ember.js effectively. If you want to dive deeper, the source to our whole application is available on [Github](https://github.com/balanced/balanced-dashboard).

We'd love for you to get involved in the development process. Feature discussion and designs are on [Github](https://github.com/balanced/balanced-dashboard/issues). If you're a developer, read the [contribution guidelines](TODO) to get started!

If these kinds of problems interest you and you're looking for a real
challenge, contact us! We're always looking for sharp and talented
individuals that can make an impact.

	NmQ2ZjYzMmU3Mzc0NmU2NTZkNzk2MTcwNjQ2NTYzNmU2MTZjNjE2MjQwNjU2MzZlNjU3MjY1NjY2NjY5NjQ2MTY1NmI2MTZkNmY3NDc0NmU2MTc3Njk=