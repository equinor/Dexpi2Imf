from lxml import etree


tree = etree.parse('pandid.xml')
result = tree.xpath("//PipingComponent/ConnectionPoints/Node")
lol = "../../following-sibling::PipingComponent[1]/@ID"

for r in result:
    test = r.xpath("../..")
    for t in test:
        print(t.xpath("@ID"))
        print(f"       {t.xpath("following-sibling::PipingComponent[1]/@ID")}")

