import {Method, queryTripleStore} from './Triplestore';

export function parseNodeIds(result: string): string[] {
    let lines = result.split('\n').filter(line => line.trim() !== '');
    return lines.slice(1).map(line => line.replace(/[<>]/g, ''));
}

export async function updateTable(completionPackageIri: string, displayTablesAndDownloadButton: Function) {
    let queryInside = `
    SELECT * WHERE {
        ?node comp:isInPackage ${completionPackageIri} . 
        ?node <http://noaka.org/rdl/SequenceAssignmentClass> ?o .
        { ?node <http://sandbox.dexpi.org/rdl/TagNameAssignmentClass> ?tagNr. }
            UNION
            { ?node <http://noaka.org/rdl/ItemTagAssignmentClass> ?tagNr. }
          FILTER NOT EXISTS { ?node a imf:Terminal . }
    }
    `;

    let queryBoundary = `
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
    let resultInside = await queryTripleStore(queryInside, Method.Get);
    if (resultInside === undefined) {
        throw new Error('Query for inside nodes returned undefined');
    }
    let nodeIdsInside = parseNodeIds(resultInside);
    let resultBoundary = await queryTripleStore(queryBoundary, Method.Get);
    if (resultBoundary === undefined) {
        throw new Error('Query for boundary nodes returned undefined');
    }
    let nodeIdsBoundary = parseNodeIds(resultBoundary);

    if (nodeIdsInside.length > 0 || nodeIdsBoundary.length > 0) {
        // Remove elements that are in both inside boundary and boundary
        nodeIdsInside = nodeIdsInside.filter(nodeId => !nodeIdsBoundary.includes(nodeId));
        displayTablesAndDownloadButton(nodeIdsInside, 'Inside Boundary', 'inside-boundary-table-container', nodeIdsBoundary, 'Boundary', 'boundary-table-container');
    } else {
        // Clear the container if there are no nodes
        // @ts-ignore
        const boundaryTableContainer = document.getElementById('boundary-table-container');
        if (boundaryTableContainer) {
            boundaryTableContainer.innerHTML = '';
        }
        const insideTableContainer = document.getElementById('inside-boundary-table-container');
        if (insideTableContainer) {
            insideTableContainer.innerHTML = '';
        }
    }
}