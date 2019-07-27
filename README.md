[![NPM](https://nodei.co/npm/ci-build-notifier.png)](https://nodei.co/npm/ci-build-notifier/)

# CI Build Slack Notifier

Script is meant to be used with Continuous Integration server like Jenkins to notify about build state by sending messages to Slack. It is written as a simple alternative to offical [Slack plugin for Jenkins](https://github.com/jenkinsci/slack-plugin). However, because this project is a simple Node script, it can be used with different server than Jenkins or whatever service you're using. Moreover, it can be used without the CI server getting info only from GIT.

Notifier get build info and current commit from environment variables or last commit, combine them with custom message and color and then send message to your Slack webhook. You can see the output below.

![Slack screenshot](https://raw.githubusercontent.com/novalu/ci-build-notifier/master/assets/slack-screenshot.png)

If you don't want to use Slack, you can show combined info in console, see options below.

## Supported CIs

See package [env-ci on npm](https://www.npmjs.com/package/env-ci).

## Install

### Install Node.js environment

This is Node script, so you must have installed Node.js environment. Use one of the options below to install Node.js:

* Use [Node Version Manager](https://github.com/nvm-sh/nvm) (recommended)
* Use official [Node.js distribution](https://nodejs.org/en/) 

You should be able to check node version with `node --version` now.

### Install CI Build Notifier

```shell script
$ npm install ci-build-notifier
```

## Usage

### Standalone

```shell script
ci-build-notifier -a "./app" -g "./" -s "https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYY/ZZZZZZZZZZZZZZZZZZZZZZZZ" -c "#AAAAAA" -t "Build started"
```

### Options

| Shorthand | Option | Description  |
| ------------- |-------------| -----|
| -g | --git-path | GIT root path |
| -t | --text | Message text |
| -a | --node-app-path | Node.js application path as a source for version (optional) |
| -v | --app-version | Set version manually (optional) |
| | --last-commit | Use last commit from GIT history instead of current commit from CI |
| -c | --color | Message hex color (optional) |
| | --use-console | Use console output instead of Slack |
| -s | --slack-webhook | Slack webhook URL (used only if --use-console is not set) |

Webhook URL is Slack Incoming Webhook, you can read more and create one here: [https://api.slack.com/incoming-webhooks]

### In Jenkins pipeline

```groovy
pipeline {
  agent any
  stages {
    stage('Send start notification to Slack') {
      steps {
        sh 'ci-build-notifier -a "$WORKSPACE/app" -g "$WORKSPACE" -s "https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYY/ZZZZZZZZZZZZZZZZZZZZZZZZ" -c "#AAAAAA" -t "Build started"'
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

# Thanks to

Authors of used libraries especially author of env-ci.

# Author

## Lukas Novak

[![Author](http://www.novaklukas.cz/images/profile.png)](http://www.novaklukas.cz)

Freelance full-stack software developer based in Olomouc, Czech Republic. I focus on mobile apps with Kotlin, servers in Node.js. As a hobby, I build my smart home. See my [personal web page](http://www.novaklukas.cz) (in Czech) or blog on [Medium](https://medium.com/@novalu)