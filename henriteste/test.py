from lxml import etree


tree = etree.parse('pandid.xml')
segments = tree.xpath("//PipingNetworkSegment")


def test():
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

test()