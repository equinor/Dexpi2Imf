# Program Overview

## Overview of XSLT Stylesheet for SVG Conversion

This document outlines the components of the XSLT stylesheet designed to transform XML data from NOAKADexpi into a graphical SVG format. Specific templates within the stylesheet are responsible for various aspects of the SVG output.

### SVG Structure and Design

- **Base SVG Output (`/PlantModel` Template)**: This template is responsible for generating the foundational SVG structure, including setting the `width` and `viewBox` attributes based on the XML input.

### Dynamic Visual Elements

- **Matching piping linesTemplate**: This template draws SVG paths for elements like `CenterLine`, applying styles such as dashed lines to denote information flows.
- **Positioning and Transformations**: It calculates the correct positioning and rotation for SVG elements.
- **Template for PipingNetworkSystem**: Manages the creation of text labels on the lines, and its text orientation.
- **Shape Catalog Template**:  defines SVG symbols. It locates the appropriate `_Origo.svg` file based on the `shapeValue` and then processes text elements, passing their values as arguments to populate text fields within the Symbol SVG. Before appyling another template to the symbols.

### Special Considerations and Notes

- **Symbol Library Location**: The symbol library repo must be located in a adjacent folder to SSI-DEXPI-TEMP for the stylesheet to function correctly. 
- **Shape Exclusions and Fallbacks**: 
  - The `BORDER_A1_Origo.svg` file does not exist, necessitating an `if` check to handle its absence.
  - Since `PV001A_Origo.svg` is also missing, an empty SVG text element was created as a placeholder.


### Known Issues and Limitations
  - Not all nozzles are present in the provided data.


- **Style-Based Exclusions (`Style-Based Filtering` Section)**: Elements with specific stroke or fill colors are excluded from the output, which is a deliberate filtering process to manage the visual output when showing the symbols.
- **Direct Element Copying (`Generic Copying` Section)**: To ensure all SVG elements not explicitly matched by other templates are included in the output, a generic copying process is employed.



---