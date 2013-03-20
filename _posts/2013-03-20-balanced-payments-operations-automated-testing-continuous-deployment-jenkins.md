---
layout: post
author: Marc Sherry
title: " How Balanced Automates Testing and Continuously Deploys"
tags:
- balanced
- operations
- testing
- deployment
- automation
- jenkins
---

## How Balanced Automates Testing and Continuously Deploys

As a payments company, we have very little room for error. Our customers count
on us to be up and running constantly, since if we're not up, they can't do
business. They also count on us to be innovative, to release new features that
make their lives easier. These goals sometimes come into conflict with each
other, since any time we have a new feature to release, or another deploy to
make, there's an inherent risk of breakage. To mitigate that risk, we've
devised a few ways to minimize our chances of introducing bugs or regressions.

### Tests. Lots of tests.

From the very beginning, Balanced has had extensive unit tests. We follow the
Model-View-Controller pattern, and each of these sets of components has its own
set of unit tests. When taken all together, these tests provide a good baseline
level of confidence that our application works the way we think it should.
However...

### Unit tests are not enough!

Balanced (the company) runs a number of separate services internally
-- mostly written in [Python](https://python.org), of which Balanced
(the service) is just one. This service has to interact with our fraud
services, our vaulting services, our dashboard service, and so on, and all
these interactions need to be tested. Unit tests alone are not
sufficient to verify all these interactions. 

For example, our fraud system may include a field called `csc_check` in its
responses, containing information about whether the [card security
code](http://en.wikipedia.org/wiki/Card_security_code) provided on a
transaction was a match. Balanced may have examples of this response in its
unit tests, making sure that it can handle all the values it may receive, and
life is good.

Suppose we decide that a better name for this field is
`security_code_check`. Since the CSC check can go by many names this should be
fine, right? So we update our fraud system with the new name everywhere, its
unit tests all pass, and we deploy it. However, since we forgot to update the
Balanced service, it has *no idea* that this field has a new
name. Consequently, Balanced (the service) doesn't know how to get the
information it needs and we start returning internal server errors to all of
our clients (and filling our own emails with system warnings). Our unit tests
were not sufficient to tell us that this small change to our fraud system was
potentially a breaking change to our system as a whole.

Even if services are well-tested in isolation, this does not address the
interactions between them. These service-level interactions need coverage. This
was the problem that we set out to solve.

### The process

We use [Jenkins](http://jenkins-ci.org/) for automating our testing and
deployment. We have a number of jobs configured, each one performing a
specific function.

![Image](http://i.imgur.com/NG7wImi.png)

Jenkins listens for commits to the `release` branch of our various
services. When a commit is pushed, it begins the testing and deployment process,
and runs through a number of jobs.

![Diagram](http://i.imgur.com/Tt0aQS2.png)

This diagram represents the various stages of testing that our Balanced service
must go through in order to be deployed to our production environment. Our other
services follow similar paths.

1. ##### Unit tests

   The first step any deploy must go through is running the unit tests that
   belong to that service. The engineer committing the changes to be deployed
   theoretically should have ensured that these tests pass before committing,
   since no one likes the guy (or gal) who commits broken code, but sometimes
   people are forgetful, and sometimes what works on one engineer's machine
   doesn't work on another's. A common mistake is to install some new library
   manually, but forget to update the requirements file -- unit tests would
   pass on the committer's machine, but fail when run elsewhere. Running unit
   tests in a fresh environment catches this type of problem.

   After setting up our environment, we run our tests in a manner similar to this:

         # Unit tests
         nosetests -sv --with-id --with-xunit --with-xcoverage \
            --cover-package=balanced_service --cover-erase

         # Pylint
         python -c "import sys, pylint.lint; pylint.lint.Run(sys.argv[1:])" \
            --output-format=parseable --include-ids=y --reports=n           \
            balanced_service/ | tee pylint.out

         # Pep8
         find balanced_service -name \*.py | xargs pep8 | tee pep8.out

   We use [Nose](https://nose.readthedocs.org/en/latest/) as our test
   runner and we leverage a number of plugins to help streamline the
   testing process. We wrote a small plugin,
   [nose-setenv](https://github.com/mahmoudimus/nose-setenv), to help us configure our tests for the
   environments we run them in and we leverage the
   [Xunit](http://nose.readthedocs.org/en/latest/plugins/xunit.html)
   plugin to produce an XML output file containing the results of the unit tests, which Jenkins uses to create graphs like this:
   ![Xunit graph](http://i.imgur.com/q1XspAD.png)

   As you can see, our tests are mostly stable, with an occasional failure that necessitates a quick fix. Build #806 shows what happens when requirements aren't updated properly -- every single test fails due to a bad `import` statement, and the engineer who forgot to update the requirements file sheepishly commits a one-line fix.

   We also run Pep8 and Pylint over our code, to track violations of style and good Python practices. Jenkins' [Violations](https://wiki.jenkins-ci.org/display/JENKINS/Violations) plugin can fail the build if code quality falls below a certain threshhold, but we use this for informational purposes only.

   We run our unit tests using
   [nosexcover](https://pypi.python.org/pypi/nosexcover/), which gives us an
   XML coverage report file. This is used by the
   [Cobertura](https://wiki.jenkins-ci.org/display/JENKINS/Cobertura+Plugin)
   Jenkins plugin to generate coverage graphs like this:

   ![Coverage graph](http://i.imgur.com/XIrKQSq.png)

   The coverage output is also passed to the next step…

1. ##### Coverage enforcement

   As code in a project is added or changed, the tendency can sometimes be for
   the number and quality of tests to fall behind. An engineer adding a simple
   new feature or fixing a bug may reason that the workings are so clear, or the
   change so minor, that testing is superfluous and skip adding a test. Over
   time this can lead to a lack of coverage by unit tests, so they don't provide
   as much confidence as they once did. This step measures the coverage of the
   unit tests performed in the previous step, and aborts the build if coverage
   drops below a minimum threshold.

   For instance, for the Balanced service, we require that all models and
   controllers have at least 95% test coverage, which means that unit tests
   must exercise at least 95% of the code for the build to continue. Every
   engineer here has felt the pain of committing code and receiving an email
   stating that the coverage level has dropped to 94.47%, and then having to
   hunker down and write more tests, but this ensures that unit test coverage
   remains comprehensive.

   (Jenkins' Cobertura plugin also enforces coverage levels, but at a
   granularity that [wasn't
   sufficient](http://stackoverflow.com/questions/10747514/how-to-configure-jenkins-cobertura-plugin-to-monitor-specific-packages/)
   for us.)

1. ##### Staging deploy

   After the self-contained unit tests have passed and been found to provide
   sufficient test coverage, we deploy the service to our internal staging
   environment. This is a test in and of itself -- if after the deploy the
   service fails to start up properly, it may indicate that a server setting
   has been misconfigured, and this code isn't ready for the production
   environment.

   Here is also where we test any database migrations on a duplicate of our
   production database -- for instance, if a constraint is added such that a
   previously NULLable column is now NOT NULL, but old rows haven't been
   backfilled appropriately, the migration fails and the build is aborted. Since
   this is tested on a copy of the actual production database, we can be
   reasonably sure that a migration won't miss any tricky edge cases.

   Once the staging deploy job has completed, we use Jenkins' [Join
   plugin](https://wiki.jenkins-ci.org/display/JENKINS/Join+Plugin) to run the
   next series of jobs simultaneously, and only proceed further if they all
   succeed.

1. ##### Acceptance/suite tests

   Once the code is running in our staging environment, we can run a battery of
   tests against it to test the integration with other services. Each of our
   various clients comes with a suite of tests (e.g., our
   [balanced-python](https://github.com/balanced/balanced-python/blob/master/tests/suite.py)
   and
   [balanced-java](https://github.com/balanced/balanced-java/tree/master/src/test/java/com/balancedpayments)
   suites), which are all run against the staging server to ensure that the
   server behaves in a way that the client is expecting. Most of these tests
   depend on the correct interaction of Balanced with our other services, but we
   take it a step farther with our acceptance suite, which consists of two more
   jobs.

   `acceptance server` runs a suite of tests designed to go all the way through
   our stack, onto our banking partners' test environments. For instance, we can
   pass test card data on to our acquiring bank and verify that they receive
   well-formed requests from us, as well as verifying that we can properly
   handle their responses.

   `acceptance` runs many of the same tests as `acceptance server`, but uses the
   [Werkzeug test client](http://werkzeug.pocoo.org/docs/test/) and patches
   Python's [requests](http://docs.python-requests.org/en/latest/) library to
   allow us to run all our servers in the same in-memory context. This allows us
   to set arbitrary breakpoints and to patch/mock different objects at various
   points throughout the request lifecycle, all the way down through our stack,
   to assert that what is actually happening matches our understanding. Running
   all servers in-memory also makes it trivially easy to use nosexcover and the
   Cobertura plugin again, this time to measure coverage of our test suite
   throughout the entire stack. If the Balanced service is well-tested by the
   acceptance suite, but the fraud system isn't being exercised enough, it's
   easy to see this here.

1. ##### Production deploy

   Once all these tests have passed, we're confident that the new code hasn't
   introduced any regressions and is ready to be deployed. To reduce the chance
   of operator error, our testing server performs deploys for us as well. We use
   [Fabric](http://docs.fabfile.org/en/1.6/) and run a `deploy` task that pulls the code from our Github repo,
   removes an instance of the app from our load balancer (HAProxy), loads the
   new code, and puts the app back into HAProxy, for each machine running our
   code.

### Confidence in quality

From start to finish, a deploy of Balanced takes about 10 minutes. During that
time, we run over 950 unit tests, and another 200-300 integration and acceptance
tests. We often deploy upwards of ten times a day, over multiple services.

Deploys do occasionally become blocked due to a failing test. Every time this
happens, we calmly fix the cause of the failure and start the process again --
there's no rushing to fix a bug that's suddenly made it out into the wild,
because it never got a chance to make it out of our staging environment.

This freedom to iterate quickly without fear of breaking things is a huge win
for us. This testing architecture is the result of a concerted effort we made to
ensure that we have a consistently high level of quality, and it pays enormous
dividends. It has made deploys much more risk-free, and greatly increased our
ability to move quickly and introduce new features while minimizing the
introduction of new bugs.

### Final Thoughts

Balanced still has a long way to go. This solution works for now, but we're always
looking for ways to improve. We have to deal with a level of quality
that catches problems early to let us move fast and break things, just
not in a catastrophic way.

If these kinds of problems interest you and you're looking for a real
challenge, contact us! We're always looking for sharp and talented
individuals that can make an impact.

    NmQ2ZjYzMmU3Mzc0NmU2NTZkNzk2MTcwNjQ2NTYzNmU2MTZjNjE2MjQwNjU2MzZlNjU3MjY1NjY2NjY5NjQ2MTY1NmI2MTZkNmY3NDc0NmU2MTc3Njk=
    
---

We're discussing this post on [HN](https://news.ycombinator.com/item?id=5409062)
