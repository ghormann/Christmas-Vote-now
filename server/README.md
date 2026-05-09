# vote-now-server

See the [main README](../README.md) for full setup instructions, MQTT configuration, API reference, and Docker deployment.

## Quick Start

```sh
nvm use 22
npm install
cp greglights_config_example.json greglights_config.json
# Edit greglights_config.json with your MQTT broker details
node index.js      # runs on port 7654
```

## Docker (production)

```sh
docker-compose build
docker-compose up -d
```
