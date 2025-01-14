import {Table, Typography} from '@equinor/eds-core-react'

export default function NodeTable (nodeIds : string[], headerTitle : string) {
        return (
            <Table>
                <Table.Caption>
                    <Typography variant="h2">{headerTitle}</Typography>
                </Table.Caption>
                <Table.Head>
                    <Table.Row>
                        <Table.Cell>Node ID</Table.Cell>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>123-456</Table.Cell>
                        <Table.Cell>Kiwi</Table.Cell>
                        <Table.Cell>1.5</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>789-012</Table.Cell>
                        <Table.Cell>Apple</Table.Cell>
                        <Table.Cell>0.5</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>345-678</Table.Cell>
                        <Table.Cell>Mango</Table.Cell>
                        <Table.Cell>2.5</Table.Cell>
                    </Table.Row>
                </Table.Body>
                <Table.Foot>
                    <Table.Row>
                        <Table.Cell colspan={3}>Footer</Table.Cell>
                    </Table.Row>
                </Table.Foot>
            </Table>
        );
    }
