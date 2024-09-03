var nodes = document.querySelectorAll(".node");

document.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        var internalNodes = document.querySelectorAll('.internal');
        var boundaryNodes = document.querySelectorAll('.boundary');
    }
    if(internalNodes.length == 1 && boundaryNodes.length >=2) {
        let insertQuery = `INSERT DATA { <${internalNodes[0].id}> a data:insideBoundary . `
        boundaryNodes.forEach(node => { 
            insertQuery += `<${node.id}> a data:boundary . `
        });
        insertQuery += '}'

        console.log(insertQuery)

        fetch('http://localhost:12110/datastores/boundaries/sparql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: `update=${insertQuery}`
          })
          .then(response => response.text()) 
          .then(data => {
            console.log(data); 
          })
          .catch(error => {
            console.error('Error:', error); 
          });
    }
});

nodes.forEach(function(node) {
    node.addEventListener('click', () => {
        if (node.classList.contains('boundary')) {
            node.classList.remove('boundary');
            console.log("Remove boundary");
        } else {
            node.classList.add('boundary');
            if(node.classList.contains('internal')){
                node.classList.remove('internal')
            }
            console.log(`Add ${node.id} to boundary`);
        }
    });

    node.addEventListener('contextmenu', () => {
        if (node.classList.contains('internal')) {
            node.classList.remove('internal');
            console.log("Remove internal node");
        } else {
            node.classList.add('internal');
            if(node.classList.contains('boundary')){
                node.classList.remove('boundary')
            }
            console.log(`Add ${node.id} as internal`);
        }
    })
});

