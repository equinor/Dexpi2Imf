let nodes = document.querySelectorAll('.node');

nodes.forEach((node) => {
    node.addEventListener('click', async (event) => {
        await handleNodeClick(node, event);
        await updateInCommissioningPackage();
    });
    window.addEventListener('unload', async () => {
        await handleWindowUnload(node);
    });
});

async function handleNodeClick(node, event) {
    // ctrl + left click - select or deselect nodes as insideBoundary
    if (event.ctrlKey) {
        if (node.classList.contains('insideBoundary')) {
            node.classList.remove('insideBoundary', 'inCommissioningPackage');
            await makeSparqlAndUpdateStore(node.id, 'delete', 'insideBoundary');
        } else {
            node.classList.add('insideBoundary');
            await makeSparqlAndUpdateStore(node.id, 'insert', 'insideBoundary');
            if (node.classList.contains('boundary')) {
                node.classList.remove('boundary', 'inCommissioningPackage');
                await makeSparqlAndUpdateStore(node.id, 'delete', 'boundary');
            }
        }
    // left click - select or deselect nodes as boundary
    } else {
        if (node.classList.contains('boundary')) {
            node.classList.remove('boundary', 'inCommissioningPackage');
            await makeSparqlAndUpdateStore(node.id, 'delete', 'boundary');
        } else {
            node.classList.add('boundary');
            await makeSparqlAndUpdateStore(node.id, 'insert', 'boundary');
            if (node.classList.contains('insideBoundary')) {
                node.classList.remove('insideBoundary', 'inCommissioningPackage');
                await makeSparqlAndUpdateStore(node.id, 'delete', 'insideBoundary');
            }
        }
    }
}

async function updateInCommissioningPackage() {
    let query = 'SELECT ?node WHERE{?node a data:insideBoundary .}';
    let result = await queryTripleStore(query);
    let nodeIds = parseNodeIds(result);
    nodes.forEach(node => {
        if (nodeIds.includes(node.id) && !node.classList.contains('boundary') && !node.classList.contains('insideBoundary')) {
            node.classList.add('inCommissioningPackage');
        } else {
            node.classList.remove('inCommissioningPackage');
        }
    });
}

function parseNodeIds(result) {
    let lines = result.split('\n').filter(line => line.trim() !== '');
    return lines.slice(1).map(line => line.replace(/[<>]/g, ''));
}

async function handleWindowUnload(node) {
    let type = node.classList.contains('insideBoundary') ? 'insideBoundary' : 'boundary';
    node.classList.remove('insideBoundary', 'boundary', 'inCommissioningPackage');
    await makeSparqlAndUpdateStore(node.id, 'delete', type);
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
