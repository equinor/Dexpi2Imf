#!/bin/bash
# This script is for use inside the docker container defined in the Dockerfile in this folder
# See README.md for instructions

cp /app/NOAKADEXPI/Blueprint/DISC_EXAMPLE-02/DISC_EXAMPLE-02-02.xml /app/local/www/public/
cp /app/NOAKADEXPI/Blueprint/DISC_EXAMPLE-02/DISC_EXAMPLE-02-02.xml /app/local/rml_mappings/pandid.xml

# Create rdf
cd local/rml_mappings
java -jar /app/rmlmapper.jar -m imf/*map*ttl -s trig -o pandid.trig
cd /app/

# Copy the lacking Origo symbol
cp /app/local/xslt/PV001A_Origo.svg /app/NOAKADEXPI/Symbols/Origo

# Copy all Origo symbols to www project
cp -rf /app/NOAKADEXPI/Symbols/Origo /app/local/www/public/Origo

# Create svg
xsltproc --novalid -o /app/dexpi.svg /app/local/xslt/dexpisvg.xslt /app/local/rml_mappings/pandid.xml 

## Copy svg into html
head -n 14 /app/local/www_old/dexpi.html > /app/local/www_old/index.html
cat /app/dexpi.svg >> /app/local/www_old/index.html
tail -n +14 /app/local/www_old/dexpi.html >> /app/local/www_old/index.html


