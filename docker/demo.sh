#!/bin/bash
# This script is for use inside the docker container defined in the Dockerfile in this folder

java -jar rmlmapper.jar -m local/rml_mappings/*map*ttl -s trig -o local/rml_mappings/pandid.trig
