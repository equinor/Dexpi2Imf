#!/bin/sh
# Serve a dagalog SPARQL endpoint using the `surrounding.datalog` rules instead of
# `noaka_boundary.datalog` (the dagalog equivalent of the old `RDFox sandbox . connected`
# example), with the example commissioning package data preloaded.
set -e
cd "$(dirname "$0")"
DAGALOG="${DAGALOG:-dagalog}"

exec "$DAGALOG" --serve --port 3030 \
  --ontology ../owl/dexpi.ttl \
  --ontology ../owl/imf-ontology.owl.ttl \
  --ontology ../owl/boundary.ttl \
  --rules ../datalog/surrounding.datalog \
  --data ../rml_mappings/pandid.trig \
  "$@"
