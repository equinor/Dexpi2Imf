from lxml import etree
from prettytable import PrettyTable

tree = etree.parse('jcb_stikk_2.xml')

def create_table(dict, col_names):
    table = PrettyTable()
    table.field_names = col_names
    for category, count in dict.items():
            table.add_row([category, count])
    return table

def check_required_elements():
    findings = {}
    required_elems = ["Equipment", 
                "Equipment/Nozzle", 
                "PipingNetworkSystem",
                "PipingNetworkSystem/PipingNetworkSegment", 
                "PipingNetworkSystem/PipingNetworkSegment/PipingComponent",
                "ShapeCatalogue"]

    for e in required_elems:
        element = tree.find(e)
        if element:
            findings[e] = "✅"
        else:
            findings[e] = "❌"
        
    table = create_table(findings, ["Element", "Present"])
    print(table)
    
def check_piping_components():
    findings = {}
    connection_points = tree.xpath("PipingNetworkSystem/PipingNetworkSegment/PipingComponent/ConnectionPoints")
    process_node_count = 0
    connection_points_with_one_process_node_count = 0

    for point in connection_points:
        processNodes = point.xpath("Node[@Type='process']")
        if processNodes:
            process_node_count += 1
            if len(processNodes) == 1:
                connection_points_with_one_process_node_count += 1

    findings["PipingComponents"] = len(tree.xpath("PipingNetworkSystem/PipingNetworkSegment/PipingComponent"))
    findings["ConnectionPoints"] = len(connection_points)
    findings["ConnectionPoints with at least one ProcessNode"] = process_node_count
    findings["ConnectionPoints with only one ProcessNode"] = connection_points_with_one_process_node_count

    table = create_table(findings, ["Category", "Count"])
    print(table)

def check_piping_network_segments():
    findings = {}
    piping_network_segments = tree.xpath("PipingNetworkSystem/PipingNetworkSegment")
    piping_network_segments_with_connections = tree.xpath("PipingNetworkSystem/PipingNetworkSegment/Connection")
    piping_network_segments_without_children_count = 0
    
    for piping in piping_network_segments:
        if not piping.xpath("PipingComponent"):
            piping_network_segments_without_children_count += 1

    findings["PipingNetworkSegments"] = len(piping_network_segments)
    findings["PipingNetworkSegments with Connection"] = len(piping_network_segments_with_connections)
    findings["PipingNetworkSegments without PipingComponents"] = piping_network_segments_without_children_count

    table = create_table(findings, ["Category", "Count"])
    print(table)

def check_symbols():
    if (not tree.xpath("ShapeCatalogue")):
        return

    findings = {}

    with open('noaka_symbols.txt', 'r') as file:
        file_contents = file.read()
    noaka_symbols = file_contents.split("\n")

    componentNames = set([ elem.get("ComponentName").replace("_SHAPE", "") for elem in tree.xpath("//*[@ComponentName]") ])
    unkown_shapes = [name for name in componentNames if name not in noaka_symbols]
    known_shapes = [name for name in componentNames if name in noaka_symbols]

    
    shape_value = tree.xpath("ShapeCatalogue/*/GenericAttributes/GenericAttribute[@Value]")
    shapes = tree.xpath("ShapeCatalogue/*")

    findings["Elements in ShapeCatalogue"] = len(shapes)
    findings["Elements in ShapeCatalogue with GenericAttribute[@Value]"] = len(shape_value)
    findings["Known shapes"] = len(known_shapes)
    findings["Unkown shapes"] = len(unkown_shapes)

    category_count_table = create_table(findings, ["Category", "Count"])
    print(category_count_table)

    print("Known shapes:")
    print("--------------")
    for known in known_shapes:
        print(f"  {known}")
    print()
    print("Unkown shapes:")
    print("--------------")
    for unkown in unkown_shapes:
        print(f"  {unkown}")
    
def check_all():
    check_required_elements()
    check_piping_components()
    check_piping_network_segments()
    check_symbols()

check_all()

def view_hierarchy():
    systems = tree.xpath('PipingNetworkSystem')
    for system in systems:
        print_helper(system, 0)
        segments = system.xpath('PipingNetworkSegment')
        for segment in segments:
            print_helper(segment, 3)
            pipings = segment.xpath('PipingComponent')
            print(len(pipings))
            for piping in pipings:
                print_helper(piping, 6)

def print_helper(elem, num_indent):
    indent = '-' * num_indent
    id = elem.get('ID')
    tag = elem.get('TagName')
    componentClass = elem.get('ComponentClass')
    print(f'{indent}{componentClass} {id} : {tag}')



view_hierarchy()