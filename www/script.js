var nodes = document.querySelectorAll(".node");

document.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        var internalNodes = document.querySelectorAll('.internal');
        var boundaryNodes = document.querySelectorAll('.boundary');
    }
    if(internalNodes.length == 1 && boundaryNodes.length >=2) {
        // Log IDs of 'internal' nodes
        internalNodes.forEach(node => { console.log(`internal ${node.id}`); });
        // Log IDs of 'boundary' nodes
        boundaryNodes.forEach(node => { console.log(`boundary ${node.id}`); });
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

