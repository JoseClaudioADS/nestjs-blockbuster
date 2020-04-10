#!/bin/bash
git add .
git commit -m "$1"
git push origin $1
git checkout master
git merge $1
git push origin master
git checkout -b $2
