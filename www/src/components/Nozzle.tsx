import {NozzleProps} from "../types/Diagram.ts";
import {useEffect, useState} from "react";

export default function Nozzle(props: NozzleProps) {
    let componentName = 'ND0002'
    if (props.ComponentName) {
        componentName = props.ComponentName.replace('_SHAPE', '');}
    const hasPosition: boolean = Boolean(props.Position);

    // Fetch SVG
    useEffect(() => {
        fetch(`https://raw.githubusercontent.com/equinor/NOAKADEXPI/refs/heads/main/Symbols/Origo/${componentName}_Origo.svg`)
            .then(res => res.text())
            .then(data => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(data, "image/svg+xml");
                const gElement = svgDoc.querySelector('svg > g');
                if (gElement) {
                    const serializedGElement = new XMLSerializer().serializeToString(gElement);
                    setSvg(serializedGElement);
                } else {
                    console.error('No g tag found inside the SVG');
                }
            })
            .catch(error => {
                console.error('Error fetching or parsing SVG: ', error);
            });
    }, []);

    const [svg, setSvg] = useState<string>('');

    function calculateAngleAndRotation(refX: number, refY: number, posX: number, posY: number) {
        let transformations = [];
        //Pointing up
        if (refX == 0 && refY == 1) {
            transformations.push('rotate(-90 ' + posX + ' ' + posY + ')');
        }
        // Pointing down
        if (refX == 0 && refY == -1) {
            transformations.push('rotate(90 ' + posX + ' ' + posY + ')');
        }
        // Pointing left
        if (refX == -1 && refY == 0) {
            transformations.push('rotate(180 ' + posX + ' ' + posY + ')');
        }
        // Apply translation
        transformations.push('translate('+ posX + ' ' + posY + ')');
        return transformations.join('');
    }

    return (
        <>
            {svg &&
                <g transform={hasPosition ?
                    calculateAngleAndRotation(props.Position.Reference.X, props.Position.Reference.Y, props.Position.Location.X, props.height! - props.Position.Location.Y): ''}
                   className={'.node'}
                   dangerouslySetInnerHTML={{__html: svg }}/>}
        </>);
}