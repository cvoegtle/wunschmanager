#!/usr/bin/env bash
rm src/main/webapp/*
cp -R ../wunschmanager-client/dist/* src/main/webapp/
cp ../wunschmanager-client/dist/.htaccess src/main/webapp/
cp configuration/configuration.json src/main/webapp/