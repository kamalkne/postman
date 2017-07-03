# Chat App
Frontend app for Postman using AngularJS
Branch master

## Install dependencies
    cd dev
    npm install
    gem install scss_lint
        (You need Ruby installed on your system)
    npm install -g bower
    cd client
        (run all bower commands from dev/client folder)
    bower install


## Run the app
Install `serve` npm package [link](https://www.npmjs.com/package/serve)

    cd dev
        (run all npm commands from dev folder)
    npm install -g serve

Build application (development build)
    
    cd dev
        (run all gulp commands from dev folder)
    npm install -g gulp
    gulp

Build application (production build)

    gulp

To run app
    Open a new Bash command on Dev folder
    cd deploy
    
    Start the server
    serve -p 4000 (or any free port)

    Run the site
    http://localhost:4000
