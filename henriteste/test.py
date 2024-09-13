from lxml import etree


tree = etree.parse('pandid.xml')
result = tree.xpath("concat(//PipingComponent/../@ID, //PipingComponent/@ID)")

for r in result:
    print(r)