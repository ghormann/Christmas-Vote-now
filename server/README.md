# Server side
The server side code talks with the MQTT server to control the FPP back end.  It also provides an api for the frontend to collect votes and get status information.

# Reuse Warnings
1. This code no longer directly controls FPP via MQTT. It is now assumed this code will run with [fppscheduler](https://github.com/ghormann/fppscheduler) running locally on the fpp box. 
1. This code assumes that **/christmas** is configured as the MQTT prefix in FPP
1. Some of the topic names are hard coded in lib/mymqtt.js
1. The website URL is hard coded in routes/index.js

# Setup
* nvm use 22
* npm install
* npm run 

# Docker for produciton
* docker-compose build
* docker-compose up
