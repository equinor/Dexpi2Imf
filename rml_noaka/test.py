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
   nodes = tree.xpath("//PipingNetworkSegment[@ID='PipingNetworkSegment-11']/PipingComponent/ConnectionPoints/Node")
   for n in nodes:
      middle_elem = n.xpath("../../preceding-sibling::PipingComponent[1]/@ID")
      if( middle_elem != []):
         connector = n.xpath("concat(../../preceding-sibling::PipingComponent[1]/@ID, '_connector')")
         print(connector)
      elif n.xpath("../../../Connection/@FromID"):
         first_connector = n.xpath("concat(../../../@ID, '_toComponentLevel')")
         print(first_connector)
      else:
         print("nothing happened")

def zestytesty():
   iterator = tree.xpath("//PipingNetworkSystem/PipingNetworkSegment/PropertyBreak")
   for node in iterator:
     object_name = node.xpath("GenericAttributes/GenericAttribute[@Name='ObjectDisplayNameAssignmentClass']/@Value")
     tag_name = node.xpath("GenericAttributes/GenericAttribute[@Name='ItemTagAssignmentClass']/@Value")
     if(len(object_name) > 0 or len(tag_name) > 0 ):
         print()
         print((node.xpath("@ID")[0]).upper())
         print("---ObjectDisplayNameClass---")
         print(object_name)
         print("---ItemTagAssignmentClass---")
         print(tag_name)
                              
zestytesty()