#!/bin/bash
# This script is for use inside the docker container defined in the Dockerfile in this folder
# See README.md for instructions

# Create rdf
cd /app/local/www

cp -rf /app/NOAKADEXPI/Symbols/Origo /app/local/www/public/Origo

npm install

npm run dev