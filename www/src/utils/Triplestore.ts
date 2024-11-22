const completionPackageIri = 'asset:Package1';

export enum BoundaryActions {
    Insert = 'INSERT DATA ',
    Delete = 'DELETE DATA '
}

export enum BoundaryParts {
    InsideBoundary = 'comp:isInPackage',
    Boundary = 'comp:isBoundaryOf'
}

export async function makeSparqlAndUpdateStore(nodeId: string, action: string, type: string) {
    const sparql = `${action} { <${nodeId}> ${type} ${completionPackageIri} . }`;
    try {
        await fetch('http://localhost:12110/datastores/boundaries/sparql', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `update=${sparql}`
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function queryTripleStore(sparql: string) {
    try {
        const encoded = encodeURIComponent(sparql);
        const response = await fetch(`http://localhost:12110/datastores/boundaries/sparql?query=${encoded}`, {
            method: 'GET',
        });
        return await response.text();
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function adjacentToInternal(pipeIri: string) {
    const query = `SELECT ?node WHERE { <${pipeIri}> imf:adjacentTo ?node . ?node comp:isInPackage ?p .}`;
    const result = await queryTripleStore(query);
    const internalNeighbours = parseNodeIds(result!);
    return internalNeighbours.length > 0
}

export async function getNodeIdsInCommissioningPackage() {
    const query = 'SELECT ?node WHERE{?node comp:isInPackage ' + completionPackageIri + ' .}';
    const result = await queryTripleStore(query);
    return parseNodeIds(result!);
}

export async function updateTable() {
    const queryInside = `
    SELECT * WHERE {
        ?node comp:isInPackage ${completionPackageIri} . 
        ?node <http://noaka.org/rdl/SequenceAssignmentClass> ?o .
        { ?node <http://sandbox.dexpi.org/rdl/TagNameAssignmentClass> ?tagNr. }
            UNION
            { ?node <http://noaka.org/rdl/ItemTagAssignmentClass> ?tagNr. }
          FILTER NOT EXISTS { ?node a imf:Terminal . }

    }
    `;

    const queryBoundary = `
    SELECT DISTINCT  ?node ?tagNr WHERE {
    ?node comp:isBoundaryOf ${completionPackageIri} . 
    ?node <http://noaka.org/rdl/SequenceAssignmentClass> ?o .
        {
            { ?node <http://sandbox.dexpi.org/rdl/TagNameAssignmentClass> ?tagNr. }
            UNION
            { ?node <http://noaka.org/rdl/ObjectDisplayNameAssignmentClass> ?tagNr. }
            UNION 
            { ?node <http://noaka.org/rdl/ItemTagAssignmentClass> ?tagNr. }
        }
    }
    `;
    let resultInside = parseNodeIds(await queryTripleStore(queryInside) as string);
    const resultBoundary = parseNodeIds(await queryTripleStore(queryBoundary) as string);

    if (resultInside.length > 0 || resultBoundary.length > 0) {
        // Remove elements that are in both inside boundary and boundary
        resultInside = resultInside.filter((nodeId: string) => !resultBoundary.includes(nodeId));
        //displayTablesAndDownloadButton(resultInside, 'Inside Boundary', 'inside-boundary-table-container', resultBoundary, 'Boundary', 'boundary-table-container');
    } else {
        // Clear the container if there are no nodes

        //document.getElementById('inside-boundary-table-container').innerHTML = '';
        //document.getElementById('boundary-table-container').innerHTML = '';
    }
}

function parseNodeIds(result: string) {
    const lines = result.split('\n').filter(line => line.trim() !== '');
    return lines.slice(1).map(line => line.replace(/[<>]/g, ''));
}