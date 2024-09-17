from lxml import etree


tree = etree.parse('pandid.xml')
segments = tree.xpath("//PipingNetworkSegment")

for s in segments:
   test = s.xpath("Connection/@FromID[not(contains(., 'Nozzle'))]")
   print(test)

