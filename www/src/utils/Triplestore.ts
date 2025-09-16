export enum Method {
  Post = "POST",
  Get = "GET",
}

//TODO - remove when API is finished
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
        ?node comp:isInPackage <${completionPackageIri}> . 
        ?node dexpi:SequenceAssignmentClass ?o .
        { ?node dexpi:TagNameAssignmentClass ?tagNr. }
            UNION
            { ?node dexpi:ItemTagAssignmentClass ?tagNr. }
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
    ?node comp:isBoundaryOf <${completionPackageIri}> . 
    ?node dexpi:SequenceAssignmentClass ?o .
        {
            { ?node dexpi:TagNameAssignmentClass ?tagNr. }
            UNION
            { ?node dexpi:ObjectDisplayNameAssignmentClass ?tagNr. }
            UNION
            { ?node dexpi:ItemTagAssignmentClass ?tagNr. }
        }
    }
    `;

  const resultBoundary = await queryTripleStore(queryBoundary, Method.Get);
  if (resultBoundary === undefined) {
    throw new Error("Query for boundary nodes returned undefined");
  }
  return parseSparqlSelectResult(resultBoundary);
}
