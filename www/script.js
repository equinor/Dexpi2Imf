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
    let highlightRects = pipe.querySelectorAll('.commissionHighlight');
    if (highlightRects.length !== 0)
        return;
    let d = pipe.getAttribute('d');

    // Create a new rect element
    let highlightRect = document.createElementNS("http://www.w3.org/2000/svg", "path");

    highlightRect.setAttribute('d', d);
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
    let highlightRects = pipe.querySelectorAll('.commissionHighlight');
    highlightRects.forEach(rect => rect.remove());
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
    })
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
