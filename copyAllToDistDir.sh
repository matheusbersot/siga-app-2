#!/bin/bash

shopt -s extglob
cp -R ./!(dist) ./dist

