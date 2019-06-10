#!/bin/sh
cd 对应目录node_blog/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log