#!/bin/bash
CONTAINER_NAME='telebot'
IMG_NAME='telebot:1'
HOME_DIR=$(pwd)
DOCKER_WORK_DIR=/tmp/telebot
docker stop $CONTAINER_NAME
echo 'container has been stopped'
docker rm $CONTAINER_NAME
echo 'container has been removed'
docker rmi $IMG_NAME
echo 'image has been removed'
docker build -t $IMG_NAME .
docker run -dit --name $CONTAINER_NAME -v $HOME_DIR/package.json:/package.json -v $HOME_DIR:$DOCKER_WORK_DIR --restart always -e DB_FILE_PATH="$DOCKER_WORK_DIR/database.json" $IMG_NAME node $DOCKER_WORK_DIR/bd-telebot.js