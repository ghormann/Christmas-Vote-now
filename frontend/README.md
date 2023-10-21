# frontend
The is the vue.js code that implements the response website.  This code will genereate a deployment package (javascript, html, images, etc) that must be hosted on a webserver. 

## Node Version
```bash
nvm install lts/erbium
nvm use lts/erbium
```

## Reuse warnings
1. public/favicon.ico will need replaced 
1. public/index.html will need modifed to fix title and author
1. src/App.vue has some hard coded links to cooldisplays.net as well as thehormanns.net
1. store/modules/display.js has hard coded links to wss://vote-now.org/ws and https://vote-now.org/api that will need updated. 
1. src/store/modules/faq.js will need customized for your display. (the values for id1 and id2 just need to be unique. The value doesn't matter.) 
1. src/main.js will need modified to have your personal google analytics key. 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development  
*(Great way of testing on development box)*
```
npm run serve
```

### Compiles and minifies for production
This will create a directory called "dist" that should be copied to the webserver. 
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Greg Only: Deploy to production server
```
./deploy.sh
```
