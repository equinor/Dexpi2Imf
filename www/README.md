# Select boundary in browser

1) Run the dexpi.rdfox script, the documentation for this script is found [here](../rdfox/README.md)
2) Run the frontend as described in [RunGuide.md](./RunGuide.md)
3) Select the boundary points and an internal component
    - shift+left click to select or deselect the internal component
        1) If the node is not a member of the internal class:
            - Add the node to the internal class to indicate that it is selected
            - Update rdfox with the following triple :nodeId a :insideBoundary .
        2) If the node is a member of the internal class:
            - Remove the node from the internal class to indicate that it is deselected
            - Update rdfox, delete the following triple :nodeId a :insideBoundary .
        3) If the node is not a member of the internal class, but is a member of the boundary class:
            - Add the node to the internal class, and remove it from the boundary class.
            - Update rdfox, insert the following triple :nodeId a :insideBoundary .
            - Update rdfox, delete the following triple :nodeId a :boundary .
    - Left click to select or deselect boundary nodes
        1) If the node is not a member of the boundary class:
            - Add the node to the boundary class to indicate that it is selected
            - Update rdfox with the following triple :nodeId a :boundary .
        2) If the node is a member of the boundary class:
            - Remove the node from the boundary class to indicate that it is deselected
            - Update rdfox, delete the following triple :nodeId a :boundary .
        3) If the node is not a member of the boundary class, but is a member of the internal class:
            - Add the node to the boundary class, and remove it from the internal class.
            - Update rdfox, insert the following triple :nodeId a :boundary .
            - Update rdfox, delete the following triple :nodeId a :insideBoundary .
4) Hit enter to query RDFox for the boundary - the output of the query can be found in the logs.