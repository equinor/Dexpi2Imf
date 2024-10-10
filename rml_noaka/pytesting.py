from lxml import etree as ET

file_path = "pandid.xml"
dexpi = ET.parse(file_path)

def Connector(xml): 
      systems = xml.xpath("//PipingNetworkSegment")
      for system in systems: 
        print()
        print()
        print(system.get('ID').upper())
        print(f"    FromID: {system.xpath("Connection")[0].get("FromID")}")
        print(f"    ToID: {system.xpath("Connection")[0].get("ToID")}")
        print("--------------------------")
        for piping in system.xpath("PipingComponent"):
            precedingSiblings = piping.xpath("preceding-sibling::PipingComponent")
            isFirstElem = True if len(precedingSiblings) == 0 else False

            if(isFirstElem):
                print(piping.get('ID').upper())
                for node in piping.xpath("ConnectionPoints/Node[@Type='process' and position()=2]"):
                    print(f"  -{node.get('ID')}")


Connector(dexpi)