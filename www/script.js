let nodes = document.querySelectorAll('.node');

document.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        let query = 'SELECT ?node WHERE{?node a data:insideBoundary .}';
        let result = await queryTripleStore(query);
    }
});

nodes.forEach((node) => {
    node.addEventListener('click', async (event) => {
        await handleNodeClick(node, event);
    });
});

window.addEventListener('unload', async () => {
    await handleWindowUnload();
});

async function handleNodeClick(node, event) {
    let action, type;
    if (event.ctrlKey) {
        type = 'insideBoundary';
        if (node.classList.contains('internal')) {
            node.classList.remove('internal');
            action = 'delete';
        } else {
            node.classList.add('internal');
            action = 'insert';
            if (node.classList.contains('boundary')) {
                node.classList.remove('boundary');
                await makeSparqlAndUpdateStore(node.id, 'delete', 'boundary');
            }
        }
    } else {
        type = 'boundary';
        if (node.classList.contains('boundary')) {
            node.classList.remove('boundary');
            action = 'delete';
        } else {
            node.classList.add('boundary');
            action = 'insert';
            if (node.classList.contains('internal')) {
                node.classList.remove('internal');
                await makeSparqlAndUpdateStore(node.id, 'delete', 'insideBoundary');
            }
        }
    }
    await makeSparqlAndUpdateStore(node.id, action, type);
}

async function handleWindowUnload(nodes) {
    for (let node of nodes) {
        node.classList.remove('internal', 'boundary', 'inCommissioningPackage');
        let type = node.classList.contains('internal') ? 'insideBoundary' : 'boundary';
        await makeSparqlAndUpdateStore(node.id, 'delete', type);
    }
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
