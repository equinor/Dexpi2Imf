import { Table, Typography } from "@equinor/eds-core-react";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";
import {
  getBoundaryNodesForTable,
  getInsideNodesForTable,
} from "../../utils/Triplestore.ts";
import { useEffect, useState } from "react";
import DownloadButton from "./DownloadButton.tsx";
import styled from "styled-components";

const StyledTableCaption = styled.div`
  display: flex;
  flex-direction: row;
  caption-side: top;
`;

export default function NodeTable() {
  const { activePackage } = useCommissioningPackages();
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
      <StyledTableCaption>
        <Typography variant="h2">{activePackage.name} </Typography>
        <DownloadButton
          filename={activePackage.name}
          nodeIdsInside={insideNodes}
          nodeIdsBoundary={boundaryNodes}
        />
      </StyledTableCaption>
      <Table>
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
    </>
  );
}
