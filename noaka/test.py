from lxml import etree


tree = etree.parse('pandid.xml')
result = tree.xpath("//Nozzle/../../PipingNetworkSystem/PipingNetworkSegment/Connection[@ToID='Nozzle-1']/../@ID")

for r in result:
    print(r)
