using System;
using System.Xml;
using System.Xml.Xsl;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        if(args.Length < 2)
        {
            Console.WriteLine("Usage: dotnet run input.xml style.xslt");
            return;
        }
        string xmlData = File.ReadAllText(args[0]);

        string xsltData = File.ReadAllText(args[1]);

        // Load XML and XSLT
        XmlDocument xmlDoc = new XmlDocument();
        xmlDoc.LoadXml(xmlData);

        XslCompiledTransform xslt = new XslCompiledTransform();
        using (StringReader sr = new StringReader(xsltData))
        using (XmlReader xr = XmlReader.Create(sr))
        {
            xslt.Load(xr);
        }
        
        MathExtensions mathExtensions = new MathExtensions();
        ColorExtensions colorExtensions = new ColorExtensions();
        
        XsltArgumentList xsltArgs = new XsltArgumentList();
        xsltArgs.AddExtensionObject("urn:math", mathExtensions);
        xsltArgs.AddExtensionObject("urn:color", colorExtensions);
        
        XmlWriterSettings settings = xslt.OutputSettings?.Clone() ?? throw new Exception("No xslt output settings found!");
        settings.OmitXmlDeclaration = true;
        // Transform XML to SVG
        using (StringWriter sw = new StringWriter())
        using (XmlWriter xw = XmlWriter.Create(sw, settings))
        {
            xslt.Transform(xmlDoc, xsltArgs, xw);
            string svgOutput = sw.ToString();

            // Save or use the SVG output
            Console.WriteLine(svgOutput);
        }
    }
}