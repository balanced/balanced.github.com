# Balanced Payments Blog

[Balanced](https://balancedpayments.com/)

# Setting up the development environment with Vagrant

Vagrant is a tool to automate the installation of development
environments in separate virtual machines. This project has been setup
with vagrant to map this current folder to `/srv/app` and to install
the latest version of jekyll available.

Vagrant will also connect port 4000 in the virtual machine to port
4000 on the host computers localhost, so that if you surf to
http://127.0.0.1:4000/ when jekyll is running then you will be able to
see the blog running.

Any changes made while jekyll is running should be propagated to the
virtual machine and automatically regenerate the site with the changes
made.

## Step by step

[Install Vagrant](http://docs.vagrantup.com/v2/installation/index.html)
and required dependencies.

```
% vagrant up
% vagrant provision # Not necessary on first run, updates jekyll on subsequent
% vagrant ssh
% cd /srv/app
% jekyll serve -w
```

Open your web browser and point it to http://127.0.0.1:4000/ and
behold the glory of the blog.


