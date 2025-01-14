import { Table, Typography } from "@equinor/eds-core-react";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import {
  getBoundaryNodesForTable,
  getInsideNodesForTable,
} from "../../utils/Triplestore.ts";
import { useEffect, useState } from "react";
import DownloadButton from "./DownloadButton.tsx";

export default function NodeTable() {
  const { activePackage } = useCommissioningPackageContext();
  const [insideNodes, setInsideNodes] = useState<string[]>([]);
  const [boundaryNodes, setBoundaryNodes] = useState<string[]>([]);
  const packageIri = activePackage.id;

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setInsideNodes(await getInsideNodesForTable(packageIri));
        setBoundaryNodes(await getBoundaryNodesForTable(packageIri));
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchNodes();
  }, [activePackage]);

  return (
    <>
      <Table>
        <Table.Caption>
          <Typography variant="h2">{activePackage.name}</Typography>
        </Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Inside Boundary</Table.Cell>
            <Table.Cell>Boundary</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {Array.from({
            length: Math.max(insideNodes.length, boundaryNodes.length),
          }).map((_, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                {insideNodes[index] ? insideNodes[index] : ""}
              </Table.Cell>
              <Table.Cell>
                {boundaryNodes[index] ? boundaryNodes[index] : ""}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <DownloadButton
        filename={activePackage.name}
        nodeIdsInside={insideNodes}
        nodeIdsBoundary={boundaryNodes}
      />
    </>
  );
}
