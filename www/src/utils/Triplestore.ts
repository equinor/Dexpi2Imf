import HighlightColors from "../enums/HighlightColors.ts";
import CommissioningPackage from "../types/CommissioningPackage.ts";

export enum BoundaryActions {
  Insert = "INSERT DATA ",
  Delete = "DELETE DATA ",
}

export enum BoundaryParts {
  InsideBoundary = "comp:isInPackage",
  Boundary = "comp:isBoundaryOf",
  SelectedInternal = "comp:isSelectedInternal",
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
  const sparql = `${action} { <${nodeId}> ${type} ${packageIri} . }`;
  await queryTripleStore(sparql, Method.Post);
}

export async function deletePackageFromTripleStore(packageId: string) {
  const deleteBoundary =
    "DELETE WHERE { ?boundary comp:isBoundaryOf " + packageId + " . }";
  const deleteInternal =
    "DELETE WHERE { ?internal comp:isInPackage " + packageId + " . }";
  const deleteSelectedInternal =
    "DELETE WHERE { ?selectedInternal comp:isSelectedInternal " +
    packageId +
    " . }";
  const deleteName = `DELETE WHERE { <${packageId}> comp:hasName ?name . }`;
  const deleteColor = `DELETE WHERE { <${packageId}> comp:hasColor ?color . }`;
  await queryTripleStore(deleteBoundary, Method.Post);
  await queryTripleStore(deleteInternal, Method.Post);
  await queryTripleStore(deleteSelectedInternal, Method.Post);
  await queryTripleStore(deleteName, Method.Post);
  await queryTripleStore(deleteColor, Method.Post);
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
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `update=${sparql}`,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

export async function addCommissioningPackage(
  packageIri: string,
  packageName: string,
  packageColor: HighlightColors,
) {
  const sparql = `INSERT DATA {
  <${packageIri}> comp:hasColor "${packageColor}" .
  <${packageIri}> comp:hasName "${packageName}" .
  }`;
  await queryTripleStore(sparql, Method.Post);
}

export async function getCommissioningPackage(packageIri: string) {
  const getNameAndColorQuery = `
    SELECT ?name ?color WHERE {
      <${packageIri}> comp:hasName ?name .
      <${packageIri}> comp:hasColor ?color .
    }
  `;
  const result = await queryTripleStore(getNameAndColorQuery, Method.Get);
  const packageData = parseCommissioningPackage(result!, packageIri);
  const nodes = await getNodes(packageIri);
  return { ...packageData, ...nodes };
}

export async function getNodes(packageIri: string) {
  const getNodesAndTypesQuery = `
    SELECT ?node ?type WHERE {
      ?node ?type ${packageIri} .
    }
  `;
  const result = await queryTripleStore(getNodesAndTypesQuery, Method.Get);
  return parseNodeIds(result!);
}

function parseCommissioningPackage(result: string, packageIri: string) {
  const lines = result.split("\n").filter((line) => line.trim() !== "");
  const [nameValue, colorValue] = lines[1]
    .split("\t")
    .map((value) => value.replace(/[<>"]/g, "").trim());

  const name = nameValue || "Unnamed Package";
  const color = Object.values(HighlightColors).includes(
    colorValue as HighlightColors,
  )
    ? (colorValue as HighlightColors)
    : HighlightColors.LASER_LEMON;

  return {
    id: packageIri.replace(/[<>]/g, ""),
    color: color,
    name: name,
    boundaryIds: [],
    internalIds: [],
    selectedInternalIds: [],
  };
}

export async function getAllCommissioningPackages() {
  const query = `
    SELECT ?package ?name ?color WHERE {
      ?package comp:hasName ?name .
      ?package comp:hasColor ?color .
    }
  `;
  const result = await queryTripleStore(query, Method.Get);
  const packages = parseAllCommissioningPackages(result!);

  for (const pkg of packages) {
    const nodes = await getNodes(pkg.id);
    pkg.boundaryIds = nodes.boundaryIds;
    pkg.internalIds = nodes.internalIds;
    pkg.selectedInternalIds = nodes.selectedInternalIds;
  }

  return packages;
}

function parseAllCommissioningPackages(result: string): CommissioningPackage[] {
  const lines = result
    .split("\n")
    .filter((line) => line.trim() !== "")
    .slice(1);
  return lines.map((line) => {
    const [packageIri, name, color] = line
      .split("\t")
      .map((value) => value.replace(/"/g, "").trim());
    return {
      id: packageIri.replace(/[<>]/g, ""),
      name: name,
      color: Object.values(HighlightColors).includes(color as HighlightColors)
        ? (color as HighlightColors)
        : HighlightColors.LASER_LEMON,
      boundaryIds: [],
      internalIds: [],
      selectedInternalIds: [],
    };
  });
}

function parseNodeIds(result: string) {
  const lines = result
    .split("\n")
    .filter((line) => line.trim() !== "")
    .slice(1);
  const boundaryIds: string[] = [];
  const internalIds: string[] = [];
  const selectedInternalIds: string[] = [];

  lines.forEach((line) => {
    const [node, type] = line
      .split("\t")
      .map((value) => value.replace(/[<>"]/g, "").trim());
    const typeShort = type.split("#")[1];
    if (typeShort === BoundaryParts.Boundary.split(":")[1]) {
      boundaryIds.push(node);
    } else if (typeShort === BoundaryParts.InsideBoundary.split(":")[1]) {
      internalIds.push(node);
    } else if (typeShort === BoundaryParts.SelectedInternal.split(":")[1]) {
      selectedInternalIds.push(node);
    }
  });

  return { boundaryIds, internalIds, selectedInternalIds };
}

function parseSparqlSelectResult(result: string) {
  return result
    .split("\n")
    .filter((line) => line.trim() !== "")
      .map((line) => line.replace(/^"|"$/g, ""))
    .slice(1);
}

export async function getInsideNodesForTable(completionPackageIri: string) {
  const queryInside = `
    SELECT ?tagNr WHERE {
        ?node comp:isInPackage ${completionPackageIri} . 
        ?node <http://noaka.org/rdl/SequenceAssignmentClass> ?o .
        { ?node <http://sandbox.dexpi.org/rdl/TagNameAssignmentClass> ?tagNr. }
            UNION
            { ?node <http://noaka.org/rdl/ItemTagAssignmentClass> ?tagNr. }
          FILTER NOT EXISTS { ?node a imf:Terminal . }
    }
    `;
  const result = await queryTripleStore(queryInside, Method.Get);
  if (result === undefined) {
    throw new Error("Query for inside nodes returned undefined");
  }
  return parseSparqlSelectResult(result);
}

export async function getBoundaryNodesForTable(completionPackageIri: string) {
  const queryBoundary = `
    SELECT DISTINCT  ?tagNr WHERE {
    ?node comp:isBoundaryOf ${completionPackageIri} . 
    ?node <http://noaka.org/rdl/SequenceAssignmentClass> ?o .
        {
            { ?node <http://sandbox.dexpi.org/rdl/TagNameAssignmentClass> ?tagNr. }
            UNION
            { ?node <http://noaka.org/rdl/ObjectDisplayNameAssignmentClass> ?tagNr. }
            UNION 
            { ?node <http://noaka.org/rdl/ItemTagAssignmentClass> ?tagNr. }
        }
    }
    `;

  const resultBoundary = await queryTripleStore(queryBoundary, Method.Get);
  if (resultBoundary === undefined) {
    throw new Error("Query for boundary nodes returned undefined");
  }
  return parseSparqlSelectResult(resultBoundary);
}
