import {setAttributes} from "./Highlighting.ts";

export default function setTextStyle(text: SVGTextElement) {
    setAttributes(text, {
        'font-size': '45px',
        'fill': 'black',
    })
}