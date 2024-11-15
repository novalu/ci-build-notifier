# This repo has been archived.

---

[![NPM](https://nodei.co/npm/ci-build-notifier.png)](https://nodei.co/npm/ci-build-notifier/)

# CI Build Slack Notifier

Script is meant to be used with CI (continuous integration) server like Jenkins to notify about build state by sending messages to Slack. It is written as a simple alternative to offical [Slack plugin for Jenkins](https://github.com/jenkinsci/slack-plugin). However, because this project is a simple Node.js script, it can be used with different continuous integration server than Jenkins. Moreover, it can be used without the CI server at all. In that case, it gets info from last GIT commit.

Notifier get build info and current commit from environment variables or last commit from GIT history, combine them with custom message and color and then send message to your Slack webhook. You can see the output below.

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

Probably you need to install this script globally this way:

```shell script
$ npm install -g ci-build-notifier
```

## Usage

Now you can send messages by running the command `ci-build-notifier` with right options listed in table below.

### Options

| Shorthand | Option | Description  |
| ------------- |-------------| -----|
| -g | --git-path | GIT root path |
| -u | --username | Bot username (optional, "Build notifier" if not set) |
| -i | --icon | Bot icon (optional, Jenkins icon if not set) |
| -t | --text | Message text |
| -a | --node-app-path | Node.js application path as a source for version (optional) |
| -v | --app-version | Set version manually (optional) |
| | --last-commit | Use last commit from GIT history instead of current commit from CI |
| -c | --color | Message hex color (optional) |
| | --use-console | Use console output instead of Slack |
| -s | --slack-webhook | Slack webhook URL (used only if --use-console is not set) |

### Run standalone

```shell script
ci-build-notifier -a "./app" -g "./" -s "https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYY/ZZZZZZZZZZZZZZZZZZZZZZZZ" -c "#AAAAAA" -t "Build started"
```

Webhook URL is Slack Incoming Webhook, you can read more and create one [here](https://api.slack.com/incoming-webhooks).

### Run in Jenkins pipeline

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

Note: Jenkins set environment variable $WORKSPACE to the current build directory.

## Build

If you want to modify and build changes, then you must recompile from TypeScript sources with command:

```
$ npm run build
```

Pull requests are welcome!

# Thanks to

Authors of used libraries, especially author of env-ci.

# Author

## Lukas Novak

[![Author](http://www.novaklukas.cz/images/profile.png)](http://www.novaklukas.cz)

Freelance full-stack software developer based in Olomouc, Czech Republic. I focus on mobile apps with Kotlin and application servers in Node.js. As a hobby, I experiment with voice assistants and build my smart home. See my [personal web page](http://www.novaklukas.cz) (in Czech) or blog on [Medium](https://medium.com/@novalu)
