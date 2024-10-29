let nodes = document.querySelectorAll('.node');
let pipes = document.querySelectorAll('.piping');
let completionPackageIri = 'asset:Package1';

window.addEventListener('load', async () => {
    for (const node of nodes) {
        await makeSparqlAndUpdateStore(node.id, boundary_actions.delete, boundary_parts.boundary);
        await makeSparqlAndUpdateStore(node.id, boundary_actions.delete, boundary_parts.insideBoundary);
        node.classList.remove('insideBoundary', 'boundary');
        removeCommissionHighlight(node);
    }

    for (const pipe of pipes) {
        await makeSparqlAndUpdateStore(pipe.id, boundary_actions.delete, boundary_parts.boundary);
        pipe.classList.remove('pipeBoundary');
        removePipeHighlight(pipe);
    }
});

nodes.forEach((node) => {
    node.addEventListener('click', async (event) => {
        await handleNodeClick(node, event);
        await updateInCommissioningPackage();
    });
});

pipes.forEach((pipe) => {
    pipe.addEventListener('click', async () => {
        await handlePipeClick(pipe)
        await updateInCommissioningPackage();
    });
});

async function handlePipeClick(pipe) {
    pipe.classList.add('pipeBoundary');
    await makeSparqlAndUpdateStore(pipe.id, boundary_actions.insert, boundary_parts.boundary);
    addPipeHighlight(pipe, color = 'rgb(251, 131, 109)')
}

async function handleNodeClick(node, event) {
    // ctrl + left click - select or deselect nodes as insideBoundary
    if (event.ctrlKey) {
        if (node.classList.contains('insideBoundary')) {
            node.classList.remove('insideBoundary');
            removeCommissionHighlight(node);
            await makeSparqlAndUpdateStore(node.id, boundary_actions.delete, boundary_parts.insideBoundary);
        } else {
            node.classList.add('insideBoundary');
            await makeSparqlAndUpdateStore(node.id, boundary_actions.insert, boundary_parts.insideBoundary);
            if (node.classList.contains('boundary')) {
                node.classList.remove('boundary');
                removeCommissionHighlight(node);
                await makeSparqlAndUpdateStore(node.id, boundary_actions.delete, boundary_parts.boundary);
            }
        }
    // left click - select or deselect nodes as boundary
    } else {
        if (node.classList.contains('boundary')) {
            node.classList.remove('boundary');
            removeCommissionHighlight(node);
            await makeSparqlAndUpdateStore(node.id, boundary_actions.delete, boundary_parts.boundary);
        } else {
            node.classList.add('boundary');
            await makeSparqlAndUpdateStore(node.id, boundary_actions.insert, boundary_parts.boundary);
            if (node.classList.contains('insideBoundary')) {
                node.classList.remove('insideBoundary');
                removeCommissionHighlight(node);
                await makeSparqlAndUpdateStore(node.id, boundary_actions.delete, boundary_parts.insideBoundary);
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

function addPipeHighlight(pipe, color = 'yellow') {
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
    highlightRect.setAttribute('stroke', color); // Highlight color
    highlightRect.setAttribute('stroke-width', '5'); // Semi-transparent
    highlightRect.setAttribute('stroke-opacity', '0.5'); // Semi-transparent
    highlightRect.setAttribute('class', 'commissionHighlight');

    highlightRect.addEventListener('click', async () => {
        let highlightRect = document.getElementById(connectorId);
        if (pipe.classList.contains('pipeBoundary')) {
            highlightRect.remove();
            pipe.classList.remove('pipeBoundary');
            await makeSparqlAndUpdateStore(pipe.id, boundary_actions.delete, boundary_parts.boundary);
        } else {
            pipe.classList.add('pipeBoundary')
            await makeSparqlAndUpdateStore(pipe.id, boundary_actions.insert, boundary_parts.boundary);
        }
        await updateInCommissioningPackage()
    }); 

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
    var parentElement = node.parentNode;
    if(parentElement.tagName === 'symbol'){
        var internalPaths = parentElement.querySelectorAll('path, ellipse, rect, circle');
        internalPaths.forEach(path => {
            path.setAttribute('fill', 'none');
            path.setAttribute('fill-opacity', '0.0');
        });
    }
    let highlightRects = node.querySelectorAll('.commissionHighlight');
    highlightRects.forEach(rect => rect.remove());
}

async function updateInCommissioningPackage() {
    if (checkOnlyInsideBoundary()) { return ;}
    let packageIds = await getNodeIdsInCommissioningPackage();
    await updateTable()

    nodes.forEach(node => {
        if (packageIds.includes(node.id) && !node.classList.contains('boundary')) {
            addCommissionHighlight(node);
        } else {
            removeCommissionHighlight(node);
        }
    });
    pipes.forEach(pipe => {
        if (packageIds.includes(pipe.id) && !pipe.classList.contains('boundary') && !pipe.classList.contains('insideBoundary')) {
            addPipeHighlight(pipe);
        } else if (pipe.classList.contains('pipeBoundary')) {
            return;
        } else {
            removePipeHighlight(pipe);
        }
    });

}

async function getNodeIdsInCommissioningPackage(){
    let query = 'SELECT ?node WHERE{?node comp:isInPackage ' + completionPackageIri + ' .}';
    let result = await queryTripleStore(query);
    return parseNodeIds(result);
}

async function updateTable() {
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
    let resultInside = await queryTripleStore(queryInside);
    let nodeIdsInside = parseNodeIds(resultInside);
    let resultBoundary = await queryTripleStore(queryBoundary);
    let nodeIdsBoundary = parseNodeIds(resultBoundary);

    if (nodeIdsInside.length > 0 || nodeIdsBoundary.length > 0) {
        // Remove elements that are in both inside boundary and boundary
        nodeIdsInside = nodeIdsInside.filter(nodeId => !nodeIdsBoundary.includes(nodeId));
        displayTablesAndDownloadButton(nodeIdsInside, 'Inside Boundary', 'inside-boundary-table-container', nodeIdsBoundary, 'Boundary', 'boundary-table-container');
    } else {
        // Clear the container if there are no nodes

        document.getElementById('inside-boundary-table-container').innerHTML = '';
        document.getElementById('boundary-table-container').innerHTML = '';
    }
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

const boundary_actions = {
    'insert': 'INSERT DATA ',
    'delete': 'DELETE DATA '
}

const boundary_parts = {
    'insideBoundary': 'comp:isInPackage',
    'boundary': 'comp:isBoundaryOf'
}

async function makeSparqlAndUpdateStore(nodeId, action, type) {
    let sparql = `${action} { <${nodeId}> ${type} ${completionPackageIri} . }`;
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

function displayTablesAndDownloadButton(nodeIdsInside, headerTitleInside, containerIdInside, nodeIdsBoundary, headerTitleBoundary, containerIdBoundary) {
    createTable(nodeIdsInside, headerTitleInside, containerIdInside);
    createTable(nodeIdsBoundary, headerTitleBoundary, containerIdBoundary);

    // Create a single download button for both tables
    const downloadButtonContainer = document.getElementById(containerIdInside); 
    let downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Excel';
    downloadButton.style.margin = '10px';
    downloadButton.style.padding = '5px 10px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.onclick = function() {
        downloadWorkbook(nodeIdsInside, nodeIdsBoundary, 'node_data.xlsx');
    };

    // Append the download button to the container
    downloadButtonContainer.appendChild(downloadButton);
}

function createTable(nodeIds, headerTitle, containerId) {
    const tableContainer = document.getElementById(containerId);
    tableContainer.innerHTML = ''; // Clear any existing content

    let header = document.createElement('h2');
    header.textContent = headerTitle;
    header.style.textAlign = 'center';

    let table = document.createElement('table');
    table.id = `${containerId}-table`;

    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    let th = document.createElement('th');
    th.textContent = 'Node ID';
    headerRow.appendChild(th);

    nodeIds.forEach(nodeId => {
        let tr = table.insertRow();
        let td = tr.insertCell();
        let shortNodeId = nodeId.split('#').pop();
        td.textContent = shortNodeId;
    });

    tableContainer.appendChild(header);
    tableContainer.appendChild(table);
}

function downloadWorkbook(nodeIdsInside, nodeIdsBoundary, filename) {
    const wb = XLSX.utils.book_new();

    const wsInside = XLSX.utils.json_to_sheet(nodeIdsInside.map(id => ({ 'Inside boundary': id })));
    XLSX.utils.book_append_sheet(wb, wsInside, 'Inside Boundary');

    const wsBoundary = XLSX.utils.json_to_sheet(nodeIdsBoundary.map(id => ({ 'Boundary': id })));
    XLSX.utils.book_append_sheet(wb, wsBoundary, 'Boundary');

    const combinedData = nodeIdsInside.concat(nodeIdsBoundary);
    const wsCombined = XLSX.utils.json_to_sheet(combinedData.map(id => ({ 'Combined': id })));
    XLSX.utils.book_append_sheet(wb, wsCombined, 'Combined');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    
    function s2ab(s) {
        const buffer = new ArrayBuffer(s.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buffer;
    }

    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename);
}

