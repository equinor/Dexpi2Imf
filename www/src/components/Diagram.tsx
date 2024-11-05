import SVG from '../assets/output.svg?react'
import {useEffect, useState} from "react";
import {
    adjacentToInternal,
    BoundaryActions,
    BoundaryParts,
    getNodeIdsInCommissioningPackage,
    makeSparqlAndUpdateStore, updateTable
} from "../utils/Triplestore.ts";
import {
    addCommissionHighlight, addPipeHighlight,
    changePipeHighLight,
    removeCommissionHighlight,
    removePipeHighlight
} from "../utils/Highlighting.ts";

export default function Diagram() {
    const [nodes, setNodes] = useState<NodeListOf<HTMLElement>>();
    const [piping, setPiping] = useState<NodeListOf<HTMLElement>>();

    useEffect(() => {
        const nodesFromDom: NodeListOf<HTMLElement> = document.querySelectorAll('.node');
        const pipingFromDom: NodeListOf<HTMLElement> = document.querySelectorAll('.piping');

        setNodes(nodesFromDom);
        setPiping(pipingFromDom);
    }, []);

    useEffect(() => {
        if (!nodes || !piping) {
            return;
        }
        const addEventListeners = async () => {
            for (const node of nodes) {
                await makeSparqlAndUpdateStore(node.id, BoundaryActions.Delete, BoundaryParts.Boundary);
                await makeSparqlAndUpdateStore(node.id, BoundaryActions.Delete, BoundaryParts.InsideBoundary);
                node.classList.remove('insideBoundary', 'boundary');
                removeCommissionHighlight(node);
                node.addEventListener('click', handleNodeClick);
                node.addEventListener('click', updateInCommissioningPackage);

            }

            for (const pipe of piping) {
                await makeSparqlAndUpdateStore(pipe.id, BoundaryActions.Delete, BoundaryParts.Boundary);
                pipe.classList.remove('boundary');
                removePipeHighlight(pipe);
                pipe.addEventListener('click', handlePipeClick);
                pipe.addEventListener('click', updateInCommissioningPackage);
            }
        }
        addEventListeners()

        // Clean up the event listeners when the component un-mounts
        return () => {
            nodes.forEach(node => {
                node.removeEventListener('click', (event) => handleNodeClick(event));
                node.removeEventListener('click', () => updateInCommissioningPackage());
            });
            piping.forEach(pipe => {
                pipe.removeEventListener('click', (event) => handlePipeClick(event));
                pipe.removeEventListener('click', () => updateInCommissioningPackage());
            });
        };
    }, [nodes, piping]);

    async function handleNodeClick(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        console.log(`Node clicked: ${target}`);
        // ctrl + left click - select or deselect nodes as insideBoundary
        if (event.ctrlKey) {
            if (target.classList.contains('insideBoundary')) {
                target.classList.remove('insideBoundary');
                removeCommissionHighlight(target);
                await makeSparqlAndUpdateStore(target.id, BoundaryActions.Delete, BoundaryParts.InsideBoundary);
            } else {
                target.classList.add('insideBoundary');
                await makeSparqlAndUpdateStore(target.id, BoundaryActions.Insert, BoundaryParts.InsideBoundary);
                if (target.classList.contains('boundary')) {
                    target.classList.remove('boundary');
                    removeCommissionHighlight(target);
                    await makeSparqlAndUpdateStore(target.id, BoundaryActions.Delete, BoundaryParts.Boundary);
                }
            }
            // left click - select or deselect nodes as boundary
        } else {
            if (target.classList.contains('boundary')) {
                target.classList.remove('boundary');
                removeCommissionHighlight(target);
                await makeSparqlAndUpdateStore(target.id, BoundaryActions.Delete, BoundaryParts.Boundary);
            } else {
                target.classList.add('boundary');
                await makeSparqlAndUpdateStore(target.id, BoundaryActions.Insert, BoundaryParts.Boundary);
                if (target.classList.contains('insideBoundary')) {
                    target.classList.remove('insideBoundary');
                    removeCommissionHighlight(target);
                    await makeSparqlAndUpdateStore(target.id, BoundaryActions.Delete, BoundaryParts.InsideBoundary);
                }
            }
        }
    }

    async function handlePipeClick(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        target.classList.add('boundary');
        await makeSparqlAndUpdateStore(target.id, BoundaryActions.Insert, BoundaryParts.Boundary);
        console.log('Pipe clicked', event.currentTarget);
        addPipeHighlight(target, 'rgb(251, 131, 109)')
    }


    async function updateInCommissioningPackage() {
        if (checkOnlyInsideBoundary() || !nodes || !piping) {
            return;
        }
        const packageIds = await getNodeIdsInCommissioningPackage();
        await updateTable()

        nodes.forEach(node => {
            if (packageIds.includes(node.id) && !node.classList.contains('boundary')) {
                addCommissionHighlight(node);
            } else {
                removeCommissionHighlight(node);
            }
        });

        for (const pipe of piping) {
            const isAdjacent = await adjacentToInternal(pipe.id);
            if (pipe.classList.contains('boundary')) {
                if (isAdjacent) {
                    changePipeHighLight(pipe, 'yellow');
                } else {
                    changePipeHighLight(pipe, 'rgb(251, 131, 109)');
                }
            } else if (packageIds.includes(pipe.id) && isAdjacent) {
                addPipeHighlight(pipe);
            } else {
                removePipeHighlight(pipe);
            }
        }
    }

    function checkOnlyInsideBoundary() {
        if (!piping || !nodes) return;
        const hasPipingBoundary = Array.from(piping).some(pipe => pipe.classList.contains('boundary'));
        const hasNodeBoundary = Array.from(nodes).some(node => node.classList.contains('boundary'));
        const hasInsideBoundary = Array.from(nodes).some(node => node.classList.contains('insideBoundary'));
        return hasInsideBoundary && !hasPipingBoundary && !hasNodeBoundary;
    }

    return (
        <SVG/>
    );
}