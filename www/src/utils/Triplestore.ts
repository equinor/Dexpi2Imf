import HighlightColors from "../enums/HighlightColors.ts";

export enum BoundaryActions {
  Insert = "INSERT DATA ",
  Delete = "DELETE DATA ",
}

export enum BoundaryParts {
  InsideBoundary = "comp:isInPackage",
  Boundary = "comp:isBoundaryOf",
}

export enum Method {
  Post = "POST",
  Get = "GET",
}

export async function makeSparqlAndUpdateStore(
  nodeId: string,
  action: string,
  type: string,
  packageIri: string,
) {
  const sparql = `${action} { <${assetIri(nodeId)}> ${type} ${packageIri} . }`;
  await queryTripleStore(sparql, Method.Post);
}

export async function addCommissioningPackage(
  packageIri: string,
  packageName: string,
  packageColor: HighlightColors,
) {
  let sparql = `INSERT DATA {
  <${packageIri}> comp:hasColor "${packageColor}" .
  <${packageIri}> comp:hasName "${packageName}" .
`;
  await queryTripleStore(sparql, Method.Post);
}

export async function cleanTripleStore() {
  const deleteBoundary = `DELETE WHERE { ?boundary comp:isBoundaryOf ?p . }`;
  const deleteInternal = `DELETE WHERE { ?internal comp:isInPackage ?p . }`;
  await queryTripleStore(deleteBoundary, Method.Post);
  await queryTripleStore(deleteInternal, Method.Post);
}

export async function deletePackageFromTripleStore(packageId: string) {
  const deleteBoundary = "DELETE WHERE { ?boundary comp:isBoundaryOf " + packageId + " . }";
  const deleteInternal = "DELETE WHERE { ?internal comp:isInPackage " + packageId + " . }";
  await queryTripleStore(deleteBoundary, Method.Post);
  await queryTripleStore(deleteInternal, Method.Post);
}

export async function getCommissioningPackage(packageIri: string) {
  const query = `
    SELECT ?node ?name ?color WHERE {
      OPTIONAL { ?node comp:isInPackage <${packageIri}> . }
      <${packageIri}> comp:hasName ?name .
      <${packageIri}> comp:hasColor ?color .
    }
  `;
  const result = await queryTripleStore(query, Method.Get);
  return parseCommissioningPackage(result!, packageIri);
}

function parseCommissioningPackage(result: string, packageIri: string) {
  const lines = result.split("\n").filter((line) => line.trim() !== "").slice(1);
  const nodes: string[] = [];
  let name = "Unnamed Package";
  let color = HighlightColors.LASER_LEMON;

  lines.forEach((line) => {
    const [node, nameValue, colorValue] = line.split("\t").map((value) => value.replace(/"/g, "").trim());
    if (node) {
      nodes.push(node.replace(/[<>]/g, ""));
    }
    if (nameValue) {
      name = nameValue;
    }
    if (colorValue) {
      color = Object.values(HighlightColors).includes(colorValue as HighlightColors) ? colorValue as HighlightColors : HighlightColors.LASER_LEMON;
    }
  });

  return {
    id: packageIri.replace(/[<>]/g, ""),
    color: color,
    name: name,
    boundaryIds: [],
    internalIds: [],
    nodeIds: nodes,
  };
}

export async function queryTripleStore(
  sparql: string,
  method: Method.Get | Method.Post,
) {
  if (method === Method.Get) {
    try {
      const encoded = encodeURIComponent(sparql);
      const response = await fetch(
        `http://localhost:12110/datastores/boundaries/sparql?query=${encoded}`,
        {
          method: "GET",
        },
      );
      return await response.text();
    } catch (error) {
      console.error("Error:", error);
    }
  } else if (method === Method.Post) {
    try {
      await fetch("http://localhost:12110/datastores/boundaries/sparql", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `update=${sparql}`,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

export const assetIri = (id: string) => {
  return `https://assetid.equinor.com/plantx#${id}`;
};
