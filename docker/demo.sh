#!/bin/bash
# This script is for use inside the docker container defined in the Dockerfile in this folder
# See README.md for instructions

# Create rdf
cd local/rml_mappings
java -jar /app/rmlmapper.jar -m *map*ttl -s trig -o pandid.trig
cd /app/

# Copy the lacking Origo symbol
cp /app/local/xslt/PV001A_Origo.svg /app/NOAKADEXPI/Symbols/Origo

# Create svg
xsltproc --novalid -o /app/dexpi.svg /app/local/xslt/dexpisvg.xslt /app/local/rml_mappings/pandid.xml 

## Copy svg into html
head -n 14 /app/local/www/dexpi.html > /var/www/html/index.html
cat /app/dexpi.svg >> /var/www/html/index.html
tail -n +14 /app/local/www/dexpi.html >> /var/www/html/index.html

cp /app/local/www/script.js /var/www/html/
cp /app/local/www/style.css /var/www/html/
#
apache2ctl -D FOREGROUND


