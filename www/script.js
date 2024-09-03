var nodes = document.querySelectorAll(".node");

document.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        console.log("enter pressed")
        let query = 'SELECT ?node WHERE{?node a data:insideBoundary .}'
        var result = queryTripleStore(query)
        console.log(result.payload)
        console.log("tried to log")
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
nodes.forEach(function(node) {
    node.addEventListener('click', () => {
        if (node.classList.contains('boundary')) {
            node.classList.remove('boundary');
            let deleteSparql = `DELETE DATA {<${node.id}> a data:boundary . }`;
            updateTripleStore(deleteSparql);
        } else {
            node.classList.add('boundary');
            let insertSparql = `INSERT DATA { <${node.id}> a data:boundary . }`;
            updateTripleStore(insertSparql);
            if(node.classList.contains('internal')){
                node.classList.remove('internal');
                let deleteSparql = `DELETE DATA { <${node.id}> a data:insideBoundary . }`;
                updateTripleStore(deleteSparql);
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
    node.addEventListener('contextmenu', () => {
        if (node.classList.contains('internal')) {
            node.classList.remove('internal');
            let deleteSparql = `DELETE DATA {<${node.id}> a data:insideBoundary . }`;
            updateTripleStore(deleteSparql)
        } else {
            node.classList.add('internal');
            let insertSparql = `INSERT DATA { <${node.id}> a data:insideBoundary . }`;
            updateTripleStore(insertSparql);
            if(node.classList.contains('boundary')){
                node.classList.remove('boundary');
                let deleteSparql = `DELETE DATA {<${node.id}> a data:boundary . }`;
                updateTripleStore(deleteSparql);
            }
        }
    })
});

function updateTripleStore(sparql) {
    fetch('http://localhost:12110/datastores/boundaries/sparql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: `update=${sparql}`
      })
      .then(response => response.text()) 
      .then(data => {
        console.log(data); 
      })
      .catch(error => {
        console.error('Error:', error); 
      });
}

function queryTripleStore(sparql) {
    var encoded = encodeURI(sparql)
    fetch(`http://localhost:12110/datastores/boundaries/sparql?query=${encoded}`, {
        method: 'GET',
      })
      .then(response => {
        console.log("trying to log reposnse")
        console.log(response.text())})
      .then(data => {
        console.log("trying to log response")
        console.log(data); 
      })
      .catch(error => {
        console.error('Error:', error); 
      });
}