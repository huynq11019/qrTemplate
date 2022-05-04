#!/usr/bin/env groovy

node {
    stage('checkout') {
        checkout scm
    }

    stage('check node') {
        sh "node -v"
    }

    stage('check npm') {
        sh "npm -v"
    }

    stage('npm install') {
        sh "npm install"
    }

    stage('packaging') {
        sh "npm run qa"
    }

    stage('deploy') {
        sh "kill \$(lsof -t -i:8021) > /dev/null 2> /dev/null || : "
        sh "cd ./dist/mb-amc/ && http-server -p 8021"
    }

}
