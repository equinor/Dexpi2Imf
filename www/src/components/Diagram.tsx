import SVG from '../assets/output.svg?react'
import React, {useEffect, useRef} from "react";
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
import {Action} from "../App.tsx";



interface DiagramProps {
    completionPackage: string[];
    setCompletionPackage:  React.Dispatch<React.SetStateAction<string[]>>;
    action: Action;
}

export default function Diagram({completionPackage, setCompletionPackage, action}: DiagramProps) {
    const nodes = useRef<NodeListOf<HTMLElement>>();
    const piping = useRef<NodeListOf<HTMLElement>>();
    const actionRef = useRef<Action>(action);

    /*
    * This useEffect runs once on component mount, and sets up a mutation observer which keeps the references to the nodes and pipes up to date
    */
    useEffect(() => {
        nodes.current = document.querySelectorAll('.node');
        piping.current = document.querySelectorAll('.piping');

        const observer = new MutationObserver(() => {
            nodes.current = document.querySelectorAll('.node')
            piping.current = document.querySelectorAll('.piping');

            // Clear old listeners and re-attach them to updated elements
            nodes.current.forEach((node) => {
                node.removeEventListener('click', handleNodeClick);
                node.addEventListener('click', handleNodeClick);
            });
            piping.current.forEach((pipe) => {
                pipe.removeEventListener('click', handlePipeClick);
                pipe.addEventListener('click', handlePipeClick);
            });
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class'],
        });

        // Clean up the event listeners and highlights when the component un-mounts
        return () => {
            nodes.current?.forEach(async node => {
                node.removeEventListener('click', handleNodeClick);
                await makeSparqlAndUpdateStore(node.id, BoundaryActions.Delete, BoundaryParts.Boundary);
                await makeSparqlAndUpdateStore(node.id, BoundaryActions.Delete, BoundaryParts.InsideBoundary);
                node.classList.remove('insideBoundary', 'boundary');
                removeCommissionHighlight(node);
            });
            piping.current?.forEach(async pipe => {
                pipe.removeEventListener('click',handlePipeClick);
                await makeSparqlAndUpdateStore(pipe.id, BoundaryActions.Delete, BoundaryParts.Boundary);
                await makeSparqlAndUpdateStore(pipe.id, BoundaryActions.Delete, BoundaryParts.InsideBoundary);
                pipe.classList.remove('insideBoundary','boundary');
                removePipeHighlight(pipe);
            });
        };
    }, []);

    /*
    * This useEffect updates the highlighting on the nodes and pipes whenever the completion package changes.
    */
    useEffect(()=> {
        if (!completionPackage || !nodes.current || !piping.current) return;
        console.log('updating nodes and pipes highlights');
        const highlightNodesAndPipes = async () => {
            nodes.current!.forEach(node => {
                if (completionPackage.includes(node.id) && !node.classList.contains('boundary')) {
                    addCommissionHighlight(node);
                } else {
                    removeCommissionHighlight(node);
                }
            });

            for (const pipe of piping.current!) {
                const isAdjacent = await adjacentToInternal(pipe.id); // Wait for the async call
                if (pipe.classList.contains('boundary')) {
                    if (isAdjacent) {
                        changePipeHighLight(pipe, 'yellow');
                    } else {
                        changePipeHighLight(pipe, 'rgb(229,139,139)');
                    }
                } else if (completionPackage.includes(pipe.id) && isAdjacent) {
                    addPipeHighlight(pipe);
                } else {
                    removePipeHighlight(pipe);
                }
            }
        }
        highlightNodesAndPipes();
    }, [completionPackage])

    useEffect(() => {actionRef.current = action}, [action])

    async function handleNodeClick(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        switch (actionRef.current) {
            case Action.InsideBoundary: {
                await toggleClassAndSparqlUpdate(target, 'insideBoundary', BoundaryParts.InsideBoundary);

                if (target.classList.contains('boundary')) {
                    await toggleClassAndSparqlUpdate(target, 'boundary', BoundaryParts.Boundary);
                }
                break;
            }
            case Action.Boundary:{
                console.log('boundary case')
                await toggleClassAndSparqlUpdate(target, 'boundary', BoundaryParts.Boundary);
                console.log('boundary updated')
                if (target.classList.contains('insideBoundary')) {
                    await toggleClassAndSparqlUpdate(target, 'insideBoundary', BoundaryParts.InsideBoundary);
                }
                break;
            }
        }
    }

    async function toggleClassAndSparqlUpdate(element: HTMLElement, className: string, boundaryParts: BoundaryParts) {
        element.classList.toggle(className);
        const updateAction = element.classList.contains(className) ? BoundaryActions.Insert : BoundaryActions.Delete;
        await updateInCommissioningPackage()
        console.log('commissioning package updated')
        await makeSparqlAndUpdateStore(element.id, updateAction, boundaryParts);
        if(updateAction === BoundaryActions.Delete){
            removeCommissionHighlight(element);
        }
    }

    async function handlePipeClick(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        target.classList.add('boundary');
        await makeSparqlAndUpdateStore(target.id, BoundaryActions.Insert, BoundaryParts.Boundary);
        addPipeHighlight(target, 'rgb(229,139,139)')
    }

    async function updateInCommissioningPackage() {
        if (checkOnlyInsideBoundary()) {
            return;
        }
        setCompletionPackage(await getNodeIdsInCommissioningPackage());

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