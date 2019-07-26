# CI Build Slack Notifier

Script is meant to be used with Continuous Integration server like Jenkins to notify about build state by sending messages to Slack. It is written as a simple alternative to offical [Slack plugin for Jenkins](https://github.com/jenkinsci/slack-plugin). However, because this project is a simple Node script, it can be used with different server than Jenkins or whatever service you're using.

Notifier get build and commit info from environment variables or custom GIT folder, combine them with custom message and color and then send message to your Slack webhook. You can see the output below.

![Slack screenshot](https://raw.githubusercontent.com/novalu/ci-build-notifier/master/assets/slack-screenshot.png)

## Install

### Install Node.js environment

This is Node script, so you must have installed Node.js environment. Use one of the options below to install Node.js:

* Use [Node Version Manager](https://github.com/nvm-sh/nvm) (recommended)
* Use official [Node.js distribution](https://nodejs.org/en/) 

You should be able to check node version with `node --version` now.

### Clone and build script

```shell script
$ CI_BUILD_NOTIFIER_VERSION=1.0.0
$ git clone -b "$CI_BUILD_NOTIFIER_VERSION" https://github.com/novalu/ci-build-notifier.git /var/ci-build-notifier
$ cd /var/ci-build-notifier
$ npm install
```

## Usage

### Options

| Shorthand | Option | Description  |
| ------------- |-------------| -----|
| -p | --app-path | Application path where package.json is |
| -g | --git-path | GIT root path |
| -w | --webhook | Slack webhook URL |
| -c | --color | Slack message color |
| -t | --text | Slack message text |

Webhook URL is Slack Incoming Webhook, you can read more here: [https://api.slack.com/incoming-webhooks]

### Standalone

```shell script
node bin/main.js -p "./app" -g "./" -w "https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYY/ZZZZZZZZZZZZZZZZZZZZZZZZ" -c "#AAAAAA" -t "Build started"
```

### In Jenkins pipeline

```groovy
pipeline {
  agent any
  stages {
    stage('Send start notification to Slack') {
      steps {
        sh 'node bin/main.js -p "$WORKSPACE/app" -g "$WORKSPACE" -w "https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYY/ZZZZZZZZZZZZZZZZZZZZZZZZ" -c "#AAAAAA" -t "Build started"'
      }
    }
  }
}
```

Note: Jenkins define environment variable $WORKSPACE as a current build directory.

## Build

If you want to modify and build changes, then you must recompile from TypeScript sources with command

```
$ npm run build
```

Pull requests are welcome!

# TODO

* Set GIT path as optional in case of using GIT info from env-ci
* Support declaring version directly from command line instead from parsing package.json (to support apps not written in Node)