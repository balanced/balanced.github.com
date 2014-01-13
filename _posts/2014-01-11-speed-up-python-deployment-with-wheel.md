---
layout: post
author: Victor Lin
author_image: /img/authors/matin_tamizi.png
title: "Speed up Python deployment with wheel"
image: /img/blogimages/generic.jpg
cover_image: /img/blogimages/generic-cover.jpg
tags:
- balanced
- engineering
- python
---


It's so nice to be an [open company](https://www.balancedpayments.com/open). 
Many of our projects are open sourced, 
and thanks to an awesome continuous integration service provider 
[Travis CI](https://travis-ci.org/). They provide free service to open source
projects. It makes continuous integration for open source project like a piece 
of cake. Simply add a 
[.travis.yml](https://github.com/balanced/billy/blob/master/.travis.yml) file,
and it will take care everything else for you.

## God damn slow pip install

Although Travis CI is awesome, we were suffering from the long building time.
It's not because we have thousands testing cases of Billy that would take a long 
while to finsih, that's because all the `pip install` commands are slowing down 
the whole building process. Sometimes, PyPi is not responding quickly, or the 
network environment of testing instance is slow. You can see 
[this build](https://travis-ci.org/balanced/billy/builds/16766115) took up 
to 19 minutes, and `pip install` contributes about 15 minutes.

![Slow build](/img/blogimages/2014-01-11-slow-pip-install.png "A slow build caused by pip install")

## Generate wheels

As `pip install` commands install exactly the same packages all the time, 
why waste time for downloading them from PyPi server? To address this issue,
we use a handy tool tool name 
[Wheel](https://wheel.readthedocs.org). It is yet another Python
packaging format but based on Python standards. You can build python packages
and its dependencies into .whl format. For Billy, we use following commands
to build.

```
mkdir .pip_wheels
pip wheel --wheel-dir=.pip_wheels -r requirements.txt
pip wheel --wheel-dir=.pip_wheels -r test_requirements.txt
```

Then you should be able to see dependencies were packaged into .whl files in the
.pip_wheels folder.

```
balanced-0.11.15-py27-none-any.whl
beautifulsoup4-4.3.2-py27-none-any.whl
certifi-0.0.8-py27-none-any.whl
Chameleon-2.14-py27-none-any.whl
chardet-1.0.1-py27-none-any.whl
cov_core-1.7-py27-none-any.whl
...
```

You can also add some extra necessary packages like this.

```
pip wheel --wheel-dir=.pip_wheels psycopg2 flake8
```

Next step, tar the folder and upload to Amazon S3.

```
tar -zcvf pip_wheels.tar.gz .pip_wheels/ 
```

## Install dependencies from .whl files

Okay, for now, we already have our dependencies packaged. It's time to 
speed up the building process! You can read our 
[Travis CI configuration](
https://github.com/balanced/billy/blob/273f456065403a1ecb93b4984b5c8e72dca746ca/.travis.yml).

We simply download our wheels tar file, unpack it, and install all .whl packages
before we run `pip install` command.

```
wget https://s3-us-west-1.amazonaws.com/billy.pip.cache/pip_wheels.tar.gz
tar -xvf pip_wheels.tar.gz
pip install wheel
find .pip_wheels/ -exec pip install {} \;
```

In this way, almost all packages will be installed from these .whl files 
rather than from the Internet. 

![Fast builds](/img/blogimages/2014-01-11-fast-pip-install.png "Improved building time")

See our [new build result](https://travis-ci.org/balanced/billy/builds/16767686)! 
It's fast now. This trick could be also very helpful for saving time
from the slow `pip install` in the deployment process.

