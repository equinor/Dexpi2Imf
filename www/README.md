# Commissioning Package creation in browser

1) Run docker. [See the Docker README for instructions.](../docker/README.md)
2) React frontend will now run on http://localhost:8081/
3) Use the *Select Boundaries* tool from the tool selector on the left to set boundaries for your commissioning package. Click again to deselect.
   1) If the selected node is not already a boundary:
      - Add the node as a boundary
      - Update rdfox with the following triple :nodeId a :boundary .
   2) If the selected node is already a boundary:
      - Remove the node as a boundary
      - Update rdfox, delete the following triple :nodeId a :boundary .
   3) If the selected node is not a boundary, but is an internal node:
      - Remove the node as an internal node, then add it as a boundary node.
      - Update rdfox, insert the following triple :nodeId a :boundary .
      - Update rdfox, delete the following triple :nodeId a :insideBoundary .
4) Use the *Select Inside of Boundary* tool to select the inside of your boundary. Click again to deselect.
   1) If the selected node is not an internal node:
       - Add the node as an internal node.
       - Update rdfox with the following triple :nodeId a :insideBoundary .
   2) If the node is an internal node:
       - Remove the node as an internal node.
       - Update rdfox, delete the following triple :nodeId a :insideBoundary .
   3) If the selected node is not an internal node, but is a boundary node:
       - Remove the node as a boundary.
       - Add the node as an internal node.
       - Update rdfox, insert the following triple :nodeId a :insideBoundary .
       - Update rdfox, delete the following triple :nodeId a :boundary .
5) Use the *Create new Commissioning Package* button to open the commissioning package creation window. Define a display name, ID and color for your package.
   - All package IDs are automatically prefixed with "asset:".
6) Define boundaries and internals for the new package as you did with the first package.
7) Switch between packages by using the *Commissioning Packages* dropdown. The packages are labeled with their display name. Your active package is displayed in the top bar.