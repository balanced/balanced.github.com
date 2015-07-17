---
layout: post
author: Patrick Cieplak 
title: "Balanced Status Notifications"
tags:
- balanced
- notifications 
- Twilio
- Finite State Machines
- Google App Engine
---

## Receive Balanced Status Notifications via SMS, Email, and Twitter

As an open company, we strive to be transparent in everything we do, from opening up our internal discussions on GitHub to open-sourcing our dashboard.  This week we released a real-time notification system for our system status that will alert subscribers of any incidents or downtime for the Balanced API, balanced.js, and for the Balanced dashboard.  Customers can now receive notifications via email, text message, and Twitter.  

![Image](https://raw.github.com/balanced/balanced.github.com/master/img/notifications.png)

Justin, a.k.a. [NodeSocket](https://github.com/nodesocket), modeled the notification system as a finite state machine, which can be seen [here on GitHub](https://github.com/balanced/status.balancedpayments.com/blob/master/situation/models.py#L77).  Essentially, the system polls the API, the dashboard, and balanced.js minute by minute to check their states, and sends the proper notifications on state transitions.  SMS messages sent through Twilio, emails are sent through Google App Engine, and tweets are sent, naturally, through Twitter.  
