# Format requirement for graphical rendering frontend
This document outlines the requirements for the format to be passed to the frontend.

The graphical view of a P&ID can be broken into two parts:
- A symbol with an SVG
- A line

## Symbols

Symbols require:
- **Identificator**
  - A unique IRI calculated in the backend
- **Position**
  - An object containing x and y coordinates, plus rotation (between 0 and 360)
- **SVG data**
  - A SVG symbol with text already placed in the correct spots. The NOAKADEXPI symbols come with metadata and a svg tag wrapping a g tag, these can be removed, and the g tag and its contents can be returned.

```
{
  "id": "https://assetid.equinor.com/plantx#PressureVessel-1",
  "position": {
    "x": 390,
    "y": 210,
    "rotation": 0
  },
  "svg": "<g><g id=\"cell-B1rrrl92oq_uFDzy55uY-28\" layer=\"Symbol\"><path d=\"M-15.996356010437012 39.98589116483927C-15.996356010437012 44.469869709014894-8.834237549826502 48.10404184013605 0 48.10404184013605 8.834237549826502 48.10404184013605 15.996356010437012 44.469869709014894 15.996356010437012 39.98589116483927Z\" fill=\"none\" stroke=\"rgb(0, 0, 0)\" stroke-miterlimit=\"10\" pointer-events=\"all\" stroke-width=\"0.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><g id=\"cell-B1rrrl92oq_uFDzy55uY-26\" layer=\"Symbol\"><path d=\"M15.996356010437012-39.94340071070255C15.996356010437012-44.31865402261973 8.834237549826502-47.865346081808816 1.7759522752888181e-15-47.865346081808816-8.834237549826502-47.86534608180882-15.996356010437012-44.31865402261974-15.996356010437012-39.943400710702555Z\" fill=\"none\" stroke=\"rgb(0, 0, 0)\" stroke-miterlimit=\"10\" pointer-events=\"all\" stroke-width=\"0.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><g id=\"cell-B1rrrl92oq_uFDzy55uY-0\" layer=\"Symbol\"><path fill=\"none\" stroke=\"rgb(0, 0, 0)\" pointer-events=\"all\" d=\"M15.978860987646-39.97214345735053L15.978860987646003 39.98964114982147-16.013851033228025 39.98964114982149-16.013851033228025-39.97214345735053z\" stroke-width=\"0.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><g id=\"cell-jyOudCda0Ud9WsIjt9Yr-0\" content=\"&lt;object label=&quot;%LabelLines%&amp;amp;nbsp; &amp;amp;nbsp; &amp;amp;nbsp; &amp;amp;nbsp; &amp;amp;nbsp; &amp;amp;nbsp;%LabelIndex%&quot; placeholders=&quot;1&quot; LabelLines=&quot;1&quot; LabelIndex=&quot;A&quot;/&gt;\" data-label=\"%LabelLines%&amp;nbsp; &amp;nbsp; &amp;nbsp; &amp;nbsp; &amp;nbsp; &amp;nbsp;%LabelIndex%\" data-placeholders=\"1\" data-LabelLines=\"1\" data-LabelIndex=\"A\" layer=\"Label\"><path fill=\"none\" stroke=\"#ff0000\" pointer-events=\"all\" d=\"M-5.016357267647981-0.9910242434591063L4.981365238875153-0.9910242434591063 4.981365238875153 1.0085202578455201-5.016357267647981 1.0085202578455201z\" vector-effect=\"non-scaling-stroke\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><g><text x=\"90\" y=\"386\" fill=\"#FF0000\" font-family=\"Helvetica\" font-size=\"10px\" transform=\"scale(0.124972 0.124972) translate(-128 -383) translate(-0.5 -0.5)\" vector-effect=\"non-scaling-stroke\" stroke-linecap=\"round\" stroke-linejoin=\"round\">1           A</text></g></g><g id=\"cell-22vkG-h5v2N9dKBLQ-ZE-137\" content=\"&lt;object label=&quot;origo&quot;/&gt;\" data-label=\"origo\" layer=\"Origo\"><ellipse cx=\"0\" cy=\"0\" rx=\"0.25\" ry=\"0.25\" fill=\"none\" stroke=\"#ff0000\" vector-effect=\"non-scaling-stroke\"/></g></g>"
}
```

## Lines

Both pipes and signals are lines. What differentiates them is if they are dashed or not.

Lines require:
- **Identificator**
  - A unique IRI calculated in the backend
- **An array of x and y-coordinates**
  - Each coordinate represents a point, and a line will be drawn between points from the order they are given. A line will be drawn between point 1 and 2, then 2 and 3, etc.
- **Style** 
  - Whether the line is dashed or not. There are several different line types specified. If the line is solid, set to "none", if regular dashed line, set to "1,4" etc.
  - How wide the stroke is: a double.
  - Stroke color. RGB value, or a color name. "black" or "rgb(255,255,255)".

```
{
  "id": "https://assetid.equinor.com/plantx#GateValve-5-node2-connector",
  "coordinates": [
    {
      "x": 646,
      "y": 188
    },
    {
      "x": 646,
      "y": 180
    },
    {
      "x": 412,
      "y": 180
    }
  ],
  "style": {
    "stroke-dasharray": "none",
    "stroke-width": "1,4",
    "stroke": "rgb(255,255,255)"
  }
}
```

## Full JSON structure
The JSON file should contain two arrays, one for symbols and one for lines. The arrays will contain the individual symbols and lines, like this:

```
{
  "diagramName": "Test P&ID",
  "extent": {
    "min": {
      "x": 100,
      "y": 100
    },
    "max": {
      "x": 200,
      "y": 200
    }
  },
  "symbols": [
    {
      ... data for symbol 1 in here
    },
    {
      ... data for symbol 2 in here
    }
  ],
  "lines": [
    {
      ... data for line 1 in here
    },
    {
      ... data for line 2 in here
    }
  ]
}
```