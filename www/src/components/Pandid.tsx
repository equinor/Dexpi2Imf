import {XMLParser} from "fast-xml-parser";
import Equipment from "./Equipment.tsx";
import {EquipmentProps, PipingNetworkSystemProps, XMLProps} from "../types/Diagram.ts";
import {useEffect, useState} from "react";
import PipeSystem from "./PipeSystem.tsx";

export default function Pandid() {
    const [xmlData, setXmlData] = useState<XMLProps | null>(null);
    const [viewBox, setViewBox] = useState<string>('');
    const [height, setHeight] = useState<number>(0);
    const [equipments, setEquipments] = useState<EquipmentProps[]>([]);
    const [pipingNetworkSystems, setPipingNetworkSystems] = useState<PipingNetworkSystemProps[]>([]);
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
        setEquipments(xmlData.PlantModel.Equipment);
        setPipingNetworkSystems(xmlData.PlantModel.PipingNetworkSystem);
        setHeight(xmlData.PlantModel.Drawing.Extent.Max.Y);
        setViewBox(`${xmlData.PlantModel.Drawing.Extent.Min.X} ${xmlData.PlantModel.Drawing.Extent.Min.Y} ${xmlData.PlantModel.Drawing.Extent.Max.X} ${xmlData.PlantModel.Drawing.Extent.Max.Y}`);
    }, [xmlData]);

    return (
        <>
        {xmlData && viewBox && height && pipingNetworkSystems && <svg viewBox={viewBox}>
            {equipments.map((equipment: EquipmentProps, index: number) => <Equipment key={index} {...equipment} height={height}/>)}
            {pipingNetworkSystems.map((piping: PipingNetworkSystemProps, index: number) => <PipeSystem key={index} {...piping} height={height}/>)}
        </svg>
        }
        </>
);}