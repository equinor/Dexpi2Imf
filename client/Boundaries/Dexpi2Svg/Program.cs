using System;
using System.Xml;
using System.Xml.Xsl;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        AppContext.SetSwitch("Switch.System.Xml.AllowDefaultResolver", true);//added
        if (args.Length < 2)
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
        //XsltSettings xsltSettings = new XsltSettings();
        //xsltSettings.EnableDocumentFunction = true;
        //xsltSettings.EnableScript = true;
        XsltSettings xsltSettings = new XsltSettings(true, true);//Added

        XmlReaderSettings readerSettings = new XmlReaderSettings(); //Added
        readerSettings.DtdProcessing = DtdProcessing.Parse; //added

        using (StringReader sr = new StringReader(xsltData))
        //using (XmlReader xr = XmlReader.Create(sr))
        using (XmlReader xr = XmlReader.Create(sr, readerSettings)) // added
        {
            xslt.Load(xr, xsltSettings, new XmlUrlResolver());//added
        }
        
        MathExtensions mathExtensions = new MathExtensions();
        ColorExtensions colorExtensions = new ColorExtensions();
        
        XsltArgumentList xsltArgs = new XsltArgumentList();
        xsltArgs.AddExtensionObject("urn:math", mathExtensions);
        xsltArgs.AddExtensionObject("urn:color", colorExtensions);
        
        XmlWriterSettings settings = xslt.OutputSettings?.Clone() ?? throw new Exception("No xslt output settings found!");
        settings.OmitXmlDeclaration = true;

        // Transform XML to SVG
        using (StringReader sr = new StringReader(xmlData))//added
        using (XmlReader xr = XmlReader.Create(sr, readerSettings)) //added
        using (StringWriter sw = new StringWriter())
        using (XmlWriter xw = XmlWriter.Create(sw, settings))
        {
            xslt.Transform(xr, xsltArgs, xw);
            //xslt.Transform(xmlDoc, xsltArgs, xw);
            string svgOutput = sw.ToString();//adedd

            // Save or use the SVG output
            Console.WriteLine(svgOutput);
        }
    }
}