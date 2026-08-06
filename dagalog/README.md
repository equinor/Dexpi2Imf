# dagalog scripts for testing the DEXPI to IMF/RDF translation

This project uses [dagalog](https://github.com/daghovland/rdf-datalog) as its
RDF triplestore/reasoning backend (previously RDFox). Unlike RDFox, dagalog has
no interactive scripting DSL - everything is driven by command-line flags, so
the scripts here are thin `sh` wrappers around the `dagalog` binary rather than
`.rdfox` scripts.

## Prerequisites

Install `dagalog` - either build it from the
[rdf-datalog](https://github.com/daghovland/rdf-datalog) source
(`cargo build --release --bin dagalog`) and put the resulting binary on your
`PATH`, or use the `ghcr.io/daghovland/dagalog:latest` Docker image (see
[../docker/docker-compose.yml](../docker/docker-compose.yml) for the
containerised setup used by the demo stack).

Run the rml mapper scripts as described in
[../rml_mappings/README.md](../rml_mappings/README.md). This will create a file
[../rml_mappings/pandid.trig](../rml_mappings/pandid.trig).

## Running the example commissioning package

In this folder, run
```
./dexpi.sh
```
This will load the ontologies and Datalog rules, and in addition load the data
in [../rml_mappings/pandid.trig](../rml_mappings/pandid.trig), then serve a
SPARQL HTTP endpoint on port 3030.

There may be warnings about axioms in the IMF ontology that cannot be handled.
This can safely be ignored. Other warnings and errors should be checked.

## Querying

Once a server is running (any of the scripts below), query it with `curl`, e.g.
```
curl -s -X POST http://localhost:3030/ds/sparql \
  -H "Content-Type: application/sparql-query" \
  -H "Accept: application/sparql-results+json" \
  --data 'PREFIX imf: <http://ns.imfid.org/imf#> SELECT * WHERE { ?asset imf:connectedTo ?d }'
```
or run a one-shot query directly from the CLI instead of starting a server, by
passing `--query` (or `-Q`) instead of `--serve` to `dexpi.sh`/`connected.sh`,
e.g.
```
./dexpi.sh --query 'SELECT * WHERE { ?s a <https://rdf.equinor.com/completion#CommissioningPackage> }'
```

## Running just a server for the boundaries app

To run a server for use with [Boundaries cli](../client/Boundaries/Boundaries.sln), run
```
./boundaries.sh
```
This will load the ontologies and Datalog rules, but no data - the Boundaries
backend adds/removes triples itself via SPARQL Update once the endpoint is up.

## Running the pump connections example

In this folder, run
```
./connected.sh
```
This will load the ontologies and the `surrounding.datalog` rules instead of
`noaka_boundary.datalog`, and in addition load the data in
[../rml_mappings/pandid.trig](../rml_mappings/pandid.trig).

## Running the spade-list example

Edit [dexpi.sh](dexpi.sh) (or [boundaries.sh](boundaries.sh)) to load
[../datalog/spade_list.datalog](../datalog/spade_list.datalog) instead of
`noaka_boundary.datalog`, then click the front-end to select an internal
object.

## Known limitations vs. RDFox

* dagalog has one-shot SHACL validation (`POST /{dataset}/shacl`) rather than
  RDFox's continuous on-commit SHACL/consistency check
  (`commit-procedure.sparql`, dropped in this migration). This is currently
  acceptable since [../shacl/imf-dexpi.shacl.ttl](../shacl/imf-dexpi.shacl.ttl)
  is empty, so the RDFox commit procedure was already a no-op in practice.
* Known dagalog bugs/gaps found while migrating are tracked upstream:
  [#388](https://github.com/daghovland/rdf-datalog/issues/388) (literals not
  accepted as Datalog rule atom arguments),
  [#389](https://github.com/daghovland/rdf-datalog/issues/389) (SELECT/ASK
  silently ignore undeclared prefixes),
  [#390](https://github.com/daghovland/rdf-datalog/issues/390) (feature
  request: dynamic ruleset load/unload endpoint), and
  [#392](https://github.com/daghovland/rdf-datalog/issues/392) (SPARQL Update
  rejects prefixed names/relative IRIs even when declared in the same
  request - worked around client-side in
  [../client/Boundaries/Boundaries/DagalogApi.cs](../client/Boundaries/Boundaries/DagalogApi.cs)).
