#!/bin/sh
# Serve a dagalog SPARQL endpoint with ontology, Datalog rules and the example
# commissioning package data preloaded (the dagalog equivalent of the old
# `RDFox sandbox . dexpi` example). Use the `--query` flag on this same command
# instead of `--serve` to run a one-shot query from the command line.
set -e
cd "$(dirname "$0")"
DAGALOG="${DAGALOG:-dagalog}"

exec "$DAGALOG" --serve --port 3030 \
  --ontology ../owl/dexpi.ttl \
  --ontology ../owl/imf-ontology.owl.ttl \
  --ontology ../owl/boundary.ttl \
  --rules ../datalog/noaka_boundary.datalog \
  --data ../rml_mappings/pandid.trig \
  "$@"
