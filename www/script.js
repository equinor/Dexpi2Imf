let nodes = document.querySelectorAll('.node');
let pipes = document.querySelectorAll('.piping');

nodes.forEach((node) => {
    node.addEventListener('click', async (event) => {
        await handleNodeClick(node, event);
        await updateInCommissioningPackage();
    });
});

window.addEventListener('load', async () => {
    for (const node of nodes) {
        await makeSparqlAndUpdateStore(node.id, 'delete', 'boundary');
        await makeSparqlAndUpdateStore(node.id, 'delete', 'insideBoundary');
        node.classList.remove('insideBoundary', 'boundary');
        removeCommissionHighlight(node);
    }
});

async function handleNodeClick(node, event) {
    // ctrl + left click - select or deselect nodes as insideBoundary
    if (event.ctrlKey) {
        if (node.classList.contains('insideBoundary')) {
            node.classList.remove('insideBoundary');
            removeCommissionHighlight(node);
            await makeSparqlAndUpdateStore(node.id, 'delete', 'insideBoundary');
        } else {
            node.classList.add('insideBoundary');
            await makeSparqlAndUpdateStore(node.id, 'insert', 'insideBoundary');
            if (node.classList.contains('boundary')) {
                node.classList.remove('boundary');
                removeCommissionHighlight(node);
                await makeSparqlAndUpdateStore(node.id, 'delete', 'boundary');
            }
        }
    // left click - select or deselect nodes as boundary
    } else {
        if (node.classList.contains('boundary')) {
            node.classList.remove('boundary');
            removeCommissionHighlight(node);
            await makeSparqlAndUpdateStore(node.id, 'delete', 'boundary');
        } else {
            node.classList.add('boundary');
            await makeSparqlAndUpdateStore(node.id, 'insert', 'boundary');
            if (node.classList.contains('insideBoundary')) {
                node.classList.remove('insideBoundary');
                removeCommissionHighlight(node);
                await makeSparqlAndUpdateStore(node.id, 'delete', 'insideBoundary');
            }
        }
    }
}

function createHighlightBox(node) {
    var highlightRects = node.querySelectorAll('.commissionHighlight');
    if (highlightRects.length !== 0)
        return;
    var bbox = node.getBBox();

    // Create a new rect element
    var highlightRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    highlightRect.setAttribute('x', bbox.x);
    highlightRect.setAttribute('y', bbox.y);
    highlightRect.setAttribute('width', bbox.width);
    highlightRect.setAttribute('height', bbox.height);
    highlightRect.setAttribute('fill', 'yellow'); // Highlight color
    highlightRect.setAttribute('fill-opacity', '0.2'); // Semi-transparent
    highlightRect.setAttribute('class', 'commissionHighlight');
    node.appendChild(highlightRect);
}



function addPipeHighlight(pipe) {
    let connectorId = pipe.id + '_highlight';
    let existingHighlightRect = document.getElementById(connectorId);
    if (existingHighlightRect)
        return;
    let d = pipe.getAttribute('d');

    // Create a new rect element
    let highlightRect = document.createElementNS("http://www.w3.org/2000/svg", "path");

    highlightRect.setAttribute('d', d);
    highlightRect.setAttribute('id', connectorId)
    highlightRect.setAttribute('fill', 'none');
    highlightRect.setAttribute('stroke-linecap', 'round');
    highlightRect.setAttribute('stroke-linejoin', 'round');
    highlightRect.setAttribute('stroke', 'yellow'); // Highlight color
    highlightRect.setAttribute('stroke-width', '5'); // Semi-transparent
    highlightRect.setAttribute('stroke-opacity', '0.5'); // Semi-transparent
    highlightRect.setAttribute('class', 'commissionHighlight');
    pipe.parentNode.appendChild(highlightRect);
}


function removePipeHighlight(pipe) {

    let connectorId = pipe.id + '_highlight';
    let highlightRect = document.getElementById(connectorId);
    if (highlightRect)
        highlightRect.remove();
}

function addCommissionHighlight(node){
    createHighlightBox(node);
}

function removeCommissionHighlight(node) {
    let highlightRects = node.querySelectorAll('.commissionHighlight');
    highlightRects.forEach(rect => rect.remove());
}

async function updateInCommissioningPackage() {
    if (checkOnlyInsideBoundary()) { return ;}
    let query = 'SELECT ?node WHERE{?node a data:insideBoundary .}';
    let result = await queryTripleStore(query);
    let nodeIds = parseNodeIds(result);
    // Insideboundary query
    let queryInside = `
    SELECT * WHERE {
        ?node a data:insideBoundary . 
        ?node <http://sandbox.dexpi.org/rdl/TagNameAssignmentClass> ?o .
    }
    `;
    let queryBoundary = `
    SELECT DISTINCT  ?node ?tagNr WHERE {
    ?node a data:boundary . 
    ?node <http://noaka.org/rdl/SequenceAssignmentClass> ?o .
    {
        { ?node <http://sandbox.dexpi.org/rdl/TagNameAssignmentClass> ?tagNr. }
        UNION
        { ?node <http://noaka.org/rdl/ObjectDisplayNameAssignmentClass> ?tagNr. }
    }
}
    `;
    let resultInside = await queryTripleStore(queryInside);
    let nodeIdsInside = parseNodeIds(resultInside);
    let resultBoundary = await queryTripleStore(queryBoundary);
    let nodeIdsBoundary = parseNodeIds(resultBoundary);

    if (nodeIdsInside.length > 0) {
        //Make a check so that you remove the elemnts from the inside boundary that are also in the boundary
        nodeIdsInside = nodeIdsInside.filter(nodeId => !nodeIdsBoundary.includes(nodeId));
        displayBoundaryTable(nodeIdsInside, 'Inside Boundary', 'inside-boundary-table-container');
        displayBoundaryTable(nodeIdsBoundary, 'Boundary', 'boundary-table-container');
    }
    else {
        document.getElementById('boundary-table-container').innerHTML = '';

    }
    nodes.forEach(node => {
        if (nodeIds.includes(node.id) && !node.classList.contains('boundary') && !node.classList.contains('insideBoundary')) {
            addCommissionHighlight(node);
        } else {
            removeCommissionHighlight(node);
        }
    });
    pipes.forEach(pipe => {
        if (nodeIds.includes(pipe.id) && !pipe.classList.contains('boundary') && !pipe.classList.contains('insideBoundary')) {
            addPipeHighlight(pipe);
        } else {
            removePipeHighlight(pipe);
        }
    });
}

function parseNodeIds(result) {
    let lines = result.split('\n').filter(line => line.trim() !== '');
    return lines.slice(1).map(line => line.replace(/[<>]/g, ''));
}

function checkOnlyInsideBoundary() {
    let hasBoundary = Array.from(nodes).some(node => node.classList.contains('boundary'));
    let hasInsideBoundary = Array.from(nodes).some(node => node.classList.contains('insideBoundary'));
    return hasInsideBoundary && !hasBoundary;
}

async function makeSparqlAndUpdateStore(nodeId, action, type) {
    let sparql = action === 'insert'
        ? `INSERT DATA { <${nodeId}> a data:${type} . }`
        : `DELETE DATA { <${nodeId}> a data:${type} . }`;
    await updateTripleStore(sparql);
}

async function updateTripleStore(sparql) {
    try {
        await fetch('http://localhost:12110/datastores/boundaries/sparql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
            body: `update=${sparql}`
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function queryTripleStore(sparql) {
    try {
        let encoded = encodeURI(sparql);
        let response = await fetch(`http://localhost:12110/datastores/boundaries/sparql?query=${encoded}`, {
            method: 'GET',
        });
        return await response.text();
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayBoundaryTable(nodeIds, headerTitle, containerId) {
    const tableContainer = document.getElementById(containerId);
    // Clear any existing content in the container
    tableContainer.innerHTML = '';

    let header = document.createElement('h2');
    header.textContent = headerTitle;
    header.style.textAlign = 'center';

    // Create a download button
    let downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Data';
    downloadButton.id = `${containerId}-download-btn`;
    downloadButton.onclick = function() {
        downloadTableAsCSV(`${containerId}-table`, `${headerTitle.replace(/\s+/g, '_')}_data.csv`);
    };
    // Add styles to the download button if necessary
    downloadButton.style.margin = '10px';
    downloadButton.style.padding = '5px 10px';
    downloadButton.style.cursor = 'pointer';

    // Create a table element
    let table = document.createElement('table');
    table.id = `${containerId}-table`;

    // Add table headers
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    let th = document.createElement('th');
    th.textContent = 'Node ID';
    headerRow.appendChild(th);

    // Add rows to the table
    nodeIds.forEach(nodeId => {
        let tr = table.insertRow();
        let td = tr.insertCell();
        let shortNodeId = nodeId.split('#').pop();
        td.textContent = shortNodeId;
    });

    // Append the header, download button, and table to the container
    tableContainer.appendChild(header);
    tableContainer.appendChild(downloadButton);
    tableContainer.appendChild(table);
}

