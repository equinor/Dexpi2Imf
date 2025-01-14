import { Table, Typography } from "@equinor/eds-core-react";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import {
  getBoundaryNodesForTable,
  getInsideNodesForTable,
} from "../../utils/Triplestore.ts";
import { useEffect } from "react";

export default function NodeTable() {
  const packageIri = useCommissioningPackageContext().activePackage.id;
  const insideNodes: string[] = getInsideNodesForTable(packageIri);
  const boundaryNodes: string[] = getBoundaryNodesForTable(packageIri);

  useEffect(() => {}, []);
  return (
    <Table>
      <Table.Caption>
        <Typography variant="h2">{headerTitle}</Typography>
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
  );
}
