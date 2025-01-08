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
  console.log("makeSparqlAndUpdateStore ", nodeId, action, type, packageIri);
  const sparql = `${action} { <${nodeId}> ${type} ${packageIri} . }`;
  await queryTripleStore(sparql, Method.Post);
}

export async function deletePackageFromTripleStore(packageId: string) {
  const deleteBoundary = "DELETE WHERE { ?boundary comp:isBoundaryOf " + packageId + " . }";
  const deleteInternal = "DELETE WHERE { ?internal comp:isInPackage " + packageId + " . }";
  const deleteSelectedInternal = "DELETE WHERE { ?selectedInternal comp:isSelectedInternal " + packageId + " . }";
  await queryTripleStore(deleteBoundary, Method.Post);
  await queryTripleStore(deleteInternal, Method.Post);
  await queryTripleStore(deleteSelectedInternal, Method.Post);
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
    console.log("Sparql query sent");
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
  const query = `
    SELECT ?node ?name ?color ?type WHERE {
      OPTIONAL { ?node comp:isBoundaryOf ${packageIri} . BIND("boundary" AS ?type) }
      OPTIONAL { ?node comp:isInPackage ${packageIri} . BIND("insideBoundary" AS ?type) }
      OPTIONAL { ?node comp:isSelectedInternal ${packageIri} . BIND("selectedInternal" AS ?type) }
      <${packageIri}> comp:hasName ?name .
      <${packageIri}> comp:hasColor ?color .
    }
  `;
  console.log("getCommissioningPackage query ", query);
  const result = await queryTripleStore(query, Method.Get);
  console.log("getCommissioningPackage result ", result);
  return parseCommissioningPackage(result!, packageIri);
}

function parseCommissioningPackage(result: string, packageIri: string) {
  const lines = result.split("\n").filter((line) => line.trim() !== "").slice(1);
  const boundaryIds: string[] = [];
  const internalIds: string[] = [];
  const selectedInternalIds: string[] = [];
  let name = "Unnamed Package";
  let color = HighlightColors.LASER_LEMON;

  lines.forEach((line) => {
    const [node, nameValue, colorValue, type] = line.split("\t").map((value) => value.replace(/[<>"]/g, "").trim());
    if (node) {
      if (type === "boundary") {
        boundaryIds.push(node);
      } else if (type === "insideBoundary") {
        internalIds.push(node);
      } else if (type === "selectedInternal") {
        selectedInternalIds.push(node);
      }
    }
    if (nameValue) {
      name = nameValue;
    }
    if (colorValue) {
      color = Object.values(HighlightColors).includes(colorValue as HighlightColors) ? colorValue as HighlightColors : HighlightColors.LASER_LEMON;
    }
  });

  console.log(" selectedInternals ", selectedInternalIds);

  return {
    id: packageIri.replace(/[<>]/g, ""),
    color: color,
    name: name,
    boundaryIds: boundaryIds,
    internalIds: internalIds,
    selectedInternalIds: selectedInternalIds,
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
    const nodeQuery = `
      SELECT ?node ?type WHERE {
        OPTIONAL { ?node comp:isBoundaryOf ${pkg.id} . BIND("boundary" AS ?type) }
        OPTIONAL { ?node comp:isInPackage ${pkg.id} . BIND("insideBoundary" AS ?type) }
        OPTIONAL { ?node comp:isSelectedInternal ${pkg.id} . BIND("selectedInternal" AS ?type) }
      }
    `;
    const nodeResult = await queryTripleStore(nodeQuery, Method.Get);
    const { boundaryIds, internalIds, selectedInternalIds } = parseNodeIds(nodeResult!);
    pkg.boundaryIds = boundaryIds;
    pkg.internalIds = internalIds;
    pkg.selectedInternalIds = selectedInternalIds;
  }

  return packages;
}

function parseAllCommissioningPackages(result: string): CommissioningPackage[] {
  const lines = result.split("\n").filter((line) => line.trim() !== "").slice(1);
  return lines.map((line) => {
    const [packageIri, name, color] = line.split("\t").map((value) => value.replace(/"/g, "").trim());
    return {
      id: packageIri.replace(/[<>]/g, ""),
      name: name,
      color: Object.values(HighlightColors).includes(color as HighlightColors) ? color as HighlightColors : HighlightColors.LASER_LEMON,
      boundaryIds: [],
      internalIds: [],
      selectedInternalIds: [],
    };
  });
}

function parseNodeIds(result: string) {
  const lines = result.split("\n").filter((line) => line.trim() !== "").slice(1);
  const boundaryIds: string[] = [];
  const internalIds: string[] = [];
  const selectedInternalIds: string[] = [];

  lines.forEach((line) => {
    const [node, type] = line.split("\t").map((value) => value.replace(/[<>"]/g, "").trim());
    if (type === "boundary") {
      boundaryIds.push(node);
    } else if (type === "insideBoundary") {
      internalIds.push(node);
    } else if (type === "selectedInternal") {
      selectedInternalIds.push(node);
    }
  });

  return { boundaryIds, internalIds, selectedInternalIds };
}
