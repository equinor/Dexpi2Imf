import {EquipmentProps, NozzleProps} from "../types/Diagram.ts";
import {useEffect, useState} from "react";
import Nozzle from "./Nozzle.tsx";

export default function Equipment(props: EquipmentProps) {
    const componentName = props.ComponentName.replace('_SHAPE', '');
    const [svg, setSvg] = useState<string>('');
    const nozzles: NozzleProps[] = props.Nozzle

    // Fetch SVG
    useEffect(() => {
        fetch(`https://raw.githubusercontent.com/equinor/NOAKADEXPI/refs/heads/main/Symbols/Origo/${componentName}_Origo.svg`)
            .then(res => res.text())
            .then(data => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(data, "image/svg+xml");
                // We do not want the svg element itself or the xml metadata, only the child g tag
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

    return (
        <>
            {svg && <g transform={`${props.Position.Reference.X === -1 ? 'rotate(-180deg)': ''}translate(${props.Position.Location.X}, ${props.height! - props.Position.Location.Y})`}
                       className={'.node'} dangerouslySetInnerHTML={{__html: svg }}/>}
            {nozzles.map((nozzle: NozzleProps, index: number) => <Nozzle key={index} {...nozzle} height={props.height} />)}
        </>);

}