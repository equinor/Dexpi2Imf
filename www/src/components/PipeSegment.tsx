import {CenterLineProps, CoordinateProps, PipingNetworkSegmentProps} from "../types/Diagram.ts";
import styled from "styled-components";

const StyledPath = styled.path`
    stroke: #000000;
    stroke-width: 0.25;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
`

export default function PipeSegment(props: PipingNetworkSegmentProps){
    const centerlines: CenterLineProps[] = Array.isArray(props.CenterLine)
        ? props.CenterLine
        : [props.CenterLine];

    function constructPath(coordinates: CoordinateProps[], height: number){
        let dString = 'M '
        for (let i = 0; i < coordinates.length; i++){
            const coordinate = coordinates[i];
            dString += `${coordinate.X} ${height - coordinate.Y}`
            if(i !== coordinates.length - 1){
                dString += ` L `
            }
        }
        return dString;
    }
    return (<>
        {centerlines.map((centerline: CenterLineProps, index: number) => centerline !== undefined ? <StyledPath key={index} d={constructPath(centerline.Coordinate, props.height!)}/> : '')}
    </>
        )
}