import {XMLParser} from "fast-xml-parser";
import Equipment from "./Equipment.tsx";
import {EquipmentProps, XMLProps} from "../types/Diagram.ts";
import {useEffect, useState} from "react";

export default function Pandid() {
    const [xmlData, setXmlData] = useState<XMLProps | null>(null);
    const [viewBox, setViewBox] = useState<string>('');
    const [equipment, setEquipment] = useState<EquipmentProps[]>([]);
    const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: ''});

    useEffect(() => {
        fetch('/DISC_EXAMPLE-02-02.xml')
            .then(response => response.text())
            .then(data => {
                const result = parser.parse(data) as XMLProps;
                setXmlData(result);
            });
    }, []);

    useEffect(() => {
        if (!xmlData) return;
        setEquipment(xmlData.PlantModel.Equipment);
        console.log(xmlData.PlantModel.Equipment)
        setViewBox(`${xmlData.PlantModel.Drawing.Extent.Min.X} ${xmlData.PlantModel.Drawing.Extent.Min.Y} ${xmlData.PlantModel.Drawing.Extent.Max.X} ${xmlData.PlantModel.Drawing.Extent.Max.Y}`);
    }, [xmlData]);

    return (
        <>
        {xmlData && viewBox && <svg viewBox={viewBox}>
            {equipment.map((eq: EquipmentProps, index: number) => <Equipment key={index} {...eq}/>)}
        </svg>
        }
        </>
);}