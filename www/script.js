let nodes = document.querySelectorAll('.node');

document.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        let query = 'SELECT ?node WHERE{?node a data:insideBoundary .}';
        let result = await queryTripleStore(query);
    }
});

/**
 * Left clicking is used to select or deselect nodes as boundries:
 * 1) If the node is not a member of the boundary class:
 *      - Add the node to the boundary class to indicate that it is selected
 *      - Update rdfox with the following triple :nodeId a :boundary .
 * 2) If the node is a member of the boundary class:
 *      - Remove the node from the boundary class to indicate that it is deselected
 *      - Update rdfox, delete the following triple :nodeId a :boundary .
 * 3) If the node is not a member of the boundary class, but is a member of the internal class:
 *      - Add the node to the boundary class, and remove it from the internal class.
 *  *   - Update rdfox, insert the following triple :nodeId a :boundary .
 *      - Update rdfox, delete the following triple :nodeId a :insideBoundary .
 */
nodes.forEach( function(node) {
    node.addEventListener('click', async () => {
        if (node.classList.contains('boundary')) {
            node.classList.remove('boundary');
            await makeSparqlAndUpdateStore(node.id, 'delete', 'boundary');
        } else {
            node.classList.add('boundary');
            await makeSparqlAndUpdateStore(node.id, 'insert', 'boundary');
            if (node.classList.contains('internal')) {
                node.classList.remove('internal');
                await makeSparqlAndUpdateStore(node.id, 'delete', 'insideBoundary');
            }
        }
    });

/**
 * Right clicking is used to select or deselect a node as internal:
 * 1) If the node is not a member of the internal class:
 *      - Add the node to the internal class to indicate that it is selected
 *      - Update rdfox with the following triple :nodeId a :insideBoundary .
 * 2) If the node is a member of the internal class:
 *      - Remove the node from the internal class to indicate that it is deselected
 *      - Update rdfox, delete the following triple :nodeId a :insideBoundary .
 * 3) If the node is not a member of the internal class, but is a member of the boundary class:
 *      - Add the node to the internal class, and remove it from the boundary class.
 *  *   - Update rdfox, insert the following triple :nodeId a :insideBoundary .
 *      - Update rdfox, delete the following triple :nodeId a :boundary .
 */
    node.addEventListener('contextmenu', async () => {
        if (node.classList.contains('internal')) {
            node.classList.remove('internal');
            await makeSparqlAndUpdateStore(node.id, 'delete', 'insideBoundary');
        } else {
            node.classList.add('internal');
            await makeSparqlAndUpdateStore(node.id, 'insert', 'insideBoundary');
            if(node.classList.contains('boundary')){
                node.classList.remove('boundary');
                await makeSparqlAndUpdateStore(node.id, 'delete', 'boundary');
            }
        }
    });

    window.addEventListener('unload', async () => {
        node.classList.remove('internal', 'boundary', 'inCommissioningPackage');
        let type = node.classList.contains('internal') ? 'insideBoundary' : 'boundary';
        await makeSparqlAndUpdateStore(node.id, 'delete', type);
    });
});

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
