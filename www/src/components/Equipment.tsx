import {EquipmentProps} from "../types/Diagram.ts";
import {useEffect, useState} from "react";

export default function Equipment(props: EquipmentProps) {
    const componentName = props.ComponentName.replace('_SHAPE', '');
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        fetch(`https://raw.githubusercontent.com/equinor/NOAKADEXPI/refs/heads/main/Symbols/Origo/${componentName}_Origo.svg`)
            .then(res => res.text())
            .then(data => {
                // Create a new DOMParser instance
                const parser = new DOMParser();
                // Parse the SVG data
                const svgDoc = parser.parseFromString(data, "image/svg+xml");
                // Extract the content inside the first <g> tag which is a direct child of the <svg> tag
                const gElement = svgDoc.querySelector('svg > g');
                // Serialize the <g> element and its content to a string
                if (gElement) {
                    const serializedGElement = new XMLSerializer().serializeToString(gElement);
                    // Update the svgContent state with the serialized string
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
            {svg && <g transform={`translate(${props.Position.Location.X}, ${props.Position.Location.Y})`}
                       className={'.node'} dangerouslySetInnerHTML={{__html: svg}}/>}

        </>);

}