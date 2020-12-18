#!/usr/bin/env bash
# JDK 1.8 wird benötigt. Unter zsh mit jdk 1.8 umschalten
gradle clean build explodedWar
java_dev_appserver.sh --generated_dir=../../dev_server --runtime=java8 --jvm_flag=-Xdebug --jvm_flag=-agentlib:jdwp=transport=dt_socket,address=9999,server=y,suspend=n ./backend/build/exploded