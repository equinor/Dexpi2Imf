import SVG from '../assets/output.svg?react'
import {useEffect, useRef} from "react";
import {
    adjacentToInternal,
    BoundaryActions,
    BoundaryParts,
    getNodeIdsInCommissioningPackage,
    makeSparqlAndUpdateStore,
} from "../utils/Triplestore.ts";
import {
    addCommissionHighlight, addPipeHighlight,
    changePipeHighLight,
    removeCommissionHighlight,
    removePipeHighlight
} from "../utils/Highlighting.ts";
import '../../style.css'
export default function Diagram() {
    const nodes = useRef<NodeListOf<HTMLElement>>();
    const piping = useRef<NodeListOf<HTMLElement>>();

    useEffect(() => {
        nodes.current = document.querySelectorAll('.node');
        piping.current = document.querySelectorAll('.piping');

        for (const node of nodes.current!) {
            node.addEventListener('click', handleNodeClick);
        }

        for (const pipe of piping.current!) {
            pipe.addEventListener('click', handlePipeClick);
        }

        const observer = new MutationObserver(() => {
            nodes.current = document.querySelectorAll('.node')
            piping.current = document.querySelectorAll('.piping');
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class'],
        });

        // Clean up the event listeners when the component un-mounts
        return () => {
            nodes.current?.forEach(async node => {
                node.removeEventListener('click', handleNodeClick);
                node.removeEventListener('click',updateInCommissioningPackage);
                await makeSparqlAndUpdateStore(node.id, BoundaryActions.Delete, BoundaryParts.Boundary);
                await makeSparqlAndUpdateStore(node.id, BoundaryActions.Delete, BoundaryParts.InsideBoundary);
                node.classList.remove('insideBoundary', 'boundary');
                removeCommissionHighlight(node);
            });
            piping.current?.forEach(async pipe => {
                pipe.removeEventListener('click',handlePipeClick);
                pipe.removeEventListener('click',updateInCommissioningPackage);
                await makeSparqlAndUpdateStore(pipe.id, BoundaryActions.Delete, BoundaryParts.Boundary);
                pipe.classList.remove('boundary');
                removePipeHighlight(pipe);
            });
        };
    }, []);

    async function handleNodeClick(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        if (event.shiftKey) {
            if (target.classList.contains('insideBoundary')) {
                target.classList.remove('insideBoundary');
                removeCommissionHighlight(target);
                await makeSparqlAndUpdateStore(target.id, BoundaryActions.Delete, BoundaryParts.InsideBoundary);
                updateInCommissioningPackage();
            } else {
                target.classList.add('insideBoundary');
                await makeSparqlAndUpdateStore(target.id, BoundaryActions.Insert, BoundaryParts.InsideBoundary);
                updateInCommissioningPackage();
                if (target.classList.contains('boundary')) {
                    target.classList.remove('boundary');
                    removeCommissionHighlight(target);
                    await makeSparqlAndUpdateStore(target.id, BoundaryActions.Delete, BoundaryParts.Boundary);
                    updateInCommissioningPackage();
                }
            }
        } else {
            if (target.classList.contains('boundary')) {
                target.classList.remove('boundary');
                removeCommissionHighlight(target);
                await makeSparqlAndUpdateStore(target.id, BoundaryActions.Delete, BoundaryParts.Boundary);
                updateInCommissioningPackage();
            } else {
                target.classList.add('boundary');
                await makeSparqlAndUpdateStore(target.id, BoundaryActions.Insert, BoundaryParts.Boundary);
                updateInCommissioningPackage();
                if (target.classList.contains('insideBoundary')) {
                    target.classList.remove('insideBoundary');
                    removeCommissionHighlight(target);
                    await makeSparqlAndUpdateStore(target.id, BoundaryActions.Delete, BoundaryParts.InsideBoundary);
                    updateInCommissioningPackage();
                }
            }
        }
    }

    async function handlePipeClick(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        target.classList.add('boundary');
        await makeSparqlAndUpdateStore(target.id, BoundaryActions.Insert, BoundaryParts.Boundary);
        addPipeHighlight(target, 'rgb(229,139,139)')
    }


    async function updateInCommissioningPackage() {
        if (checkOnlyInsideBoundary() || !nodes.current || !piping.current) {
            return;
        }
        const packageIds = await getNodeIdsInCommissioningPackage();
        console.log(packageIds)
        //await updateTable()
        nodes.current.forEach(node => {
            if (packageIds.includes(node.id) && !node.classList.contains('boundary')) {
                addCommissionHighlight(node);
            } else {
                removeCommissionHighlight(node);
            }
        });

        for (const pipe of piping.current) {
            const isAdjacent = await adjacentToInternal(pipe.id);
            if (pipe.classList.contains('boundary')) {
                if (isAdjacent) {
                    changePipeHighLight(pipe, 'yellow');
                } else {
                    changePipeHighLight(pipe, 'rgb(229,139,139)');
                }
            } else if (packageIds.includes(pipe.id) && isAdjacent) {
                addPipeHighlight(pipe);
            } else {
                removePipeHighlight(pipe);
            }
        }
    }

    function checkOnlyInsideBoundary() {
        if (!piping.current || !nodes.current) return;
        const hasPipingBoundary = Array.from(piping.current).some(pipe => pipe.classList.contains('boundary'));
        const hasNodeBoundary = Array.from(nodes.current).some(node => node.classList.contains('boundary'));
        const hasInsideBoundary = Array.from(nodes.current).some(node => node.classList.contains('insideBoundary'));
        return hasInsideBoundary && !hasPipingBoundary && !hasNodeBoundary;
    }

    return (
        <SVG/>
    );
}