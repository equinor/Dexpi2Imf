from lxml import etree

tree = etree.parse('pandid.xml')

def test():
   segments = tree.xpath("//PipingNetworkSegment")
   result = {}
   for s in segments:
      fromID = s.xpath("Connection/@FromID")
      toID = s.xpath("Connection/@ToID")
      if(len(fromID) == 1):
         result[f"{s.xpath('@ID')[0]}_FromID"] = fromID[0]
      if(len(toID) == 1):
         result[f"{s.xpath('@ID')[0]}_ToID"] = toID[0]

   for key, value in result.items():
      print("{} : {}".format(key, value))

def PropertyBreak():
   propertyBreak = tree.xpath("//PropertyBreak")
   for p in propertyBreak:
      flowInNode = p.xpath("ConnectionPoints/Node[position()=number(../@FlowIn)+1]/@ID")
      flowInDefault = p.xpath("ConnectionPoints/Node[position()=2]/@ID")
      print("Using the index stated in the FlowIn")
      print(flowInNode)
      print("Using default index")
      print(flowInDefault)

def FromId():
   segments = tree.xpath("//PipingNetworkSegment")
   for s in segments:
      print()
      res = s.xpath("Connection[not(contains(@FromID, 'Nozzle'))]/@FromID")
      print(res)

FromId()