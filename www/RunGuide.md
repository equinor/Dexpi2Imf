# Running the NOAKADEXPI Program

This guide will help you run the NOAKADEXPI program that converts DEPI XML files to SVG format using the DEXPI2SVG tool.

## Prerequisites

To run the code, you need to have Node.js installed. [You can download node here](https://nodejs.org/en).

Open a terminal in the `www` directory, and run ```npm install```.

## Steps to Run the Program

1. **Navigate to the Tool Directory**

   Open a command prompt or terminal window and navigate to the `Client/boundaries/Dexpi2svg` directory within the
   `NOAKADEXPI` repository.

2. **Run the Conversion Command**

   Use the following command to convert your DEPI XML file to SVG format:

   ```sh
   dotnet run "<path-to-your-xml-file>" "<path-to-your-xslt-file>" > output.svg
   ```

   Replace `<path-to-your-xml-file>` with the generic path to your DEPI XML file and `<path-to-your-xslt-file>` with the
   generic path to your XSLT file.

3. **Addressing Missing Symbol Error**

   If you encounter an error about a missing symbol `PV001A_Origio.svg`, you will need to create it by following these
   steps:

   a. Create a new file inside the `NOAKADEXPI/SYMBOL/Origo` directory.

   b. Paste the following SVG content into the new file:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
width="3.43931mm" height="17.4611mm" viewBox="-0.40625 -2.03125 0.8125 4.125">
<defs vector-effect="non-scaling-stroke" />
<g>
<g id="cell-SPPeGkMqv3PPZ88ONVvg-0" layer="Symbol">
<path d="M0 2L0-2" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10"
pointer-events="stroke" stroke-width="0.25" stroke-linecap="round"
stroke-linejoin="round" />
</g>

        <g id="cell-JrQDJ3AAwTKKgfP51pYv-3"
            content="&lt;object label=&quot;Connection&quot; PipingConnector=&quot;Y&quot; LabelConnector=&quot;N&quot; SignalConnector=&quot;Y&quot; Direction=&quot;0, 180&quot; AuxiliaryConnector=&quot;N&quot;/&gt;"
            data-label="Connection" data-PipingConnector="Y" data-LabelConnector="N"
            data-SignalConnector="Y" data-Direction="0, 180" data-AuxiliaryConnector="N"
            layer="Connection">
            <ellipse cx="0" cy="0" rx="0.375" ry="0.375" fill="none" stroke="#00ff00"
                vector-effect="non-scaling-stroke" />
        </g>
        <g id="cell-JrQDJ3AAwTKKgfP51pYv-1" content="&lt;object label=&quot;origo&quot;/&gt;"
            data-label="origo" layer="Origo">
            <ellipse cx="0" cy="0" rx="0.25" ry="0.25" fill="none" stroke="#ff0000"
                vector-effect="non-scaling-stroke" />
        </g>

        <g id="cell-SPPeGkMqv3PPZ88ONVvg-0" layer="Symbol">
            <path d="M2 2L2-2" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10"
                pointer-events="stroke" stroke-width="0.25" stroke-linecap="round"
                stroke-linejoin="round" />
        </g>

        <g id="cell-JrQDJ3AAwTKKgfP51pYv-30"
            content="&lt;object label=&quot;Connection&quot; PipingConnector=&quot;Y&quot; LabelConnector=&quot;N&quot; SignalConnector=&quot;Y&quot; Direction=&quot;0, 180&quot; AuxiliaryConnector=&quot;N&quot;/&gt;"
            data-label="Connection" data-PipingConnector="Y" data-LabelConnector="N"
            data-SignalConnector="Y" data-Direction="0, 180" data-AuxiliaryConnector="N"
            layer="Connection">
            <ellipse cx="2" cy="0" rx="0.375" ry="0.375" fill="none" stroke="#00ff00"
                vector-effect="non-scaling-stroke" />
        </g>
        <g id="cell-JrQDJ3AAwTKKgfP51pYv-10" content="&lt;object label=&quot;origo&quot;/&gt;"
            data-label="origo" layer="Origo">
            <ellipse cx="2" cy="0" rx="0.25" ry="0.25" fill="none" stroke="#ff0000"
                vector-effect="non-scaling-stroke" />
        </g>
    </g>

</svg>
   ```

Name this file `PV001A_Origio.svg`.

4. **Integrate the SVG Output**

   Once you have the `output.svg` file, move it to ```www\src\assets```


5. **View the Result**

   In a terminal inside the `www` folder, run `npm run dev`. Click the link to open it in the browser. You should now be
   able to
   click on the components within the SVG as intended.
   If you want to be able to create boundaries you must use RDFox as well, to manage this see the README in
   client/boundaries.