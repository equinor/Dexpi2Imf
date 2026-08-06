#!/bin/sh
# Serve a dagalog SPARQL endpoint with ontology + Datalog rules loaded, but no data.
# This is what the Boundaries backend (../client/Boundaries) talks to: it adds/removes
# triples itself via SPARQL Update once the endpoint is up.
#
# Run from this folder with `dagalog` on PATH (or DAGALOG=/path/to/dagalog ./boundaries.sh),
# or via docker: see ../docker/docker-compose.yml for the containerised equivalent.
set -e
cd "$(dirname "$0")"
DAGALOG="${DAGALOG:-dagalog}"

exec "$DAGALOG" --serve --port 3030 \
  --ontology ../owl/dexpi.ttl \
  --ontology ../owl/imf-ontology.owl.ttl \
  --ontology ../owl/boundary.ttl \
  --rules ../datalog/noaka_boundary.datalog
