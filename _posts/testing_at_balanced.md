---
layout: post
author: Marc Sherry
title: "How Balanced automates testing and deployment"
tags:
- balanced
- operations
- testing
- automation
- jenkins
---

## How Balanced automates testing and deployment

As a payments company, we have very little room for error. Our customers count
on us to be up and running constantly, since if we're not up, they can't do
business. They also count on us to be innovative, and to release new features
that make their lives easier. These goals sometimes come into conflict, since
any time we have a new feature to release, or any deploy to make at all, there's
inherently a risk of breakage. In order to mitigate that risk, we had to devise
ways to minimize our chances of introducing bugs or regressions.

### Tests. Lots of tests.

From the very beginning, Balanced has had extensive unit tests. We follow the
Model-View-Controller pattern, and each of these sets of components has its own
set of unit tests, so we avoid as much as possible mixing our concerns (model
tests aren't concerned with parsing of requests, view tests aren't concerned
with business logic, etc.) Obviously, since our views represent the state of our
models, which are controlled by actions of the controller, there is some
interdependence between components. When taken all together, these tests give us
a good baseline level of confidence that our application works the way we think
it should.

### Unit tests are not enough!

Balanced (the company) runs a number of separate services internally, of which
Balanced (the service) is just one. This service has to interact with our fraud
system, our vaulting system, our dashboard system, and so on, and all these
interactions need to be tested. Unit tests are not sufficient for this.

For example, we may know that our fraud system includes a field called
`csc_check` in its responses, containing the results from our processor about
whether the [card security
code](http://en.wikipedia.org/wiki/Card_security_code) provided on a transaction
was a match. Balanced may have examples of this response in its unit tests,
makes sure that it can handle all the values it may receive, and life is
good. Since the CSC check can go by many names, though, we may hypothetically
decide that a better name for the field is `security_code_check`. We update our
fraud system with the new name everywhere, its unit tests all pass, and we
deploy it. Since we forgot to update the Balanced service, it has *no idea* that
this field has a new name, it doesn't know how to get the information it needs,
and we start returning internal server errors to all of our clients. Our unit
tests were not sufficient to tell us that this small change to our fraud system
is potentially a breaking change to our system as a whole.

This situation can arise when, even if services are well-tested in isolation,
the interactions between them aren't fully tested. This was the problem that we
set out to solve.

### The testing and deployment process

We use [Jenkins](http://jenkins-ci.org/) for automating our testing and
deployment process. It listens for commits to the `release` branch of our
various services, and when a commit is pushed, it begins the testing and
deployment process.

# TODO: update diagram
![Diagram](http://i.imgur.com/TaM3okr.png)

This diagram represents the various stages of testing that our Balanced service
must go through in order to be deployed to our production environment. Our other
services follow similar paths.

1. Unit tests

   The first step any deploy must go through is running the unit tests that
   belong to that service. The engineer committing the changes to be deployed
   should have ensured that these tests pass before committing, since no one
   likes the guy who commits broken code, but sometimes people are forgetful,
   and sometimes what works on one engineer's machine doesn't work on
   another's. A common mistake is to install some new requirement manually, but
   forget to update the requirements -- unit tests would pass on the committer's
   machine, but fail when run elsewhere. This step catches problems of that
   sort, and also provides output for the next step...

1. Coverage enforcement

   As code in a project is added or changed, the tendency can sometimes be for
   the number and quality of tests to fall behind. An engineer adding a simple
   new feature or fixing a bug may reason that the workings are so clear that
   testing is superfluous and skip adding a test. Over time, however, this can
   lead to a lack of coverage by unit tests, so they don't provide as much
   confidence as they once did. This step measures the coverage of the unit
   tests performed in the previous step, and aborts the build if coverage drops
   below certain levels.

   For instance, for the Balanced service, we require that all models and
   controllers have greater than 95% test coverage, which means that unit tests
   must exercise 95% of the code for the build to continue. Every engineer has
   felt the pain of committing code and receiving an email stating that the
   coverage level has dropped to 94.47%, requiring the addition of more tests,
   but this ensures that unit test coverage remains comprehensive

    (Jenkins'
   [Cobertura](https://wiki.jenkins-ci.org/display/JENKINS/Cobertura+Plugin)
   plugin also enforces coverage levels, but at a granularity that [wasn't
   sufficient](http://stackoverflow.com/questions/10747514/how-to-configure-jenkins-cobertura-plugin-to-monitor-specific-packages/10808868#10808868)
   for us.)

1. Staging deploy

   After the self-contained unit tests have passed and been found to provide
   sufficient test coverage, we deploy the service to our internal staging
   environment. This is a test in and of itself -- if after the deploy the
   service fails to start up properly, it indicates that, e.g., a server setting
   has been misconfigured, and this code isn't ready for the production
   environment.

   Here is also where we test any database migrations on a duplicate of our
   production database -- for instance, if a constraint is added such that a
   previously NULLable column is now NOT NULL, but old rows haven't been
   backfilled appropriately, the migration fails and the build is aborted. Since
   this is tested on a copy of the actual production database, we can be sure
   that the migration doesn't miss any tricky edge cases.

   Once the staging deploy job has completed, we use Jenkins' [Join
   plugin](https://wiki.jenkins-ci.org/display/JENKINS/Join+Plugin) to run the
   next series of jobs simultaneously, and only proceed further if they all
   succeed.

1. Acceptance/suite tests

   Once the code is running in our staging environment, we can run a battery of
   tests against it that simulate real-world usage. Each of our various clients
   comes with a suite of tests, which are all run against the staging server. We
   also run our acceptance suite against the new code, in two different ways.

   `acceptance_server` runs a suite of tests designed to go all the way through
   our stack, onto our banking partners' staging environments. For instance, we
   can pass test card data on to Chase Paymentech (TODO: do we mention our
   partners by name?) and verify that they receive well-formed requests from us,
   as well as verifying that we can properly handle their responses.

   `acceptance` runs many of the same tests as `acceptance_server`, but uses the
   [Werkzeug test client](http://werkzeug.pocoo.org/docs/test/) and patches
   Python's [requests](http://docs.python-requests.org/en/latest/) library to
   allow us to run all our servers in the same in-memory context. This allows us
   to set arbitrary breakpoints or patch/mock different objects at various
   points throughout the request lifecycle, all the way down through our stack,
   in order to assert that what is actually happening matches our understanding.

1. Production deploy

   Once all these tests have passed, we're confident that the new code hasn't
   introduced any regressions and is ready to be deployed. To reduce the chance
   of operator error, our staging server performs deploys for us.
