from lxml import etree
from prettytable import PrettyTable
import click

@click.group()
def cli():
    """The chex CLI is a command-line tool for validating P&ID files with the essential criteria required for the XSLT and RML mappings in this repository.
    To use all commands run the cli in the following location Dexpi2Imf/cli/chex
    """

@cli.command()
@click.argument("file_path", type=str, nargs=1)
def elem(file_path: str):
    """Checks if the required elements are present"""
    tree = etree.parse(file_path)
    check_required_elements(tree)

@cli.command()
@click.argument("file_path", type=str, nargs=1)
def pipcom(file_path: str):
    """Checks if PipingComponents have ConnectionPoints with ProcessNodes"""
    tree = etree.parse(file_path)
    check_piping_components(tree)

@cli.command()
@click.argument("file_path", type=str, nargs=1)
def pipseg(file_path):
    """Checks if PipingNetworkSegments have Connections. Also checks if there exists PipingNetworkSegments with zero PipingComponents. Prints a table to view findings."""
    tree = etree.parse(file_path)
    check_piping_network_segments(tree)

@cli.command()
@click.argument("file_path", type=str, nargs=1)
def shapes(file_path):
    """Checks how many elements in the ShapeCatalouge have the correct formatting. Also checks how many known and unkown shapes are present."""
    tree = etree.parse(file_path)
    check_shapes(tree)

@cli.command()
@click.argument("file_path", type=str, nargs=1)
def unknown(file_path):
    """Prints all shapes in the P&ID that is unknown in the NOAKADEXPI symbol library"""
    tree = etree.parse(file_path)
    known_shapes = get_known_shapes(tree)
    print("Known shapes:")
    print("--------------")
    for known in known_shapes:
        print(f"  {known}")

@cli.command()
@click.argument("file_path", type=str, nargs=1)
def known(file_path):
    """Prints all shapes in the P&ID that is not known in the NOAKADEXPI symbol library"""
    tree = etree.parse(file_path)
    unknown_shapes = get_unkown_shapes(tree)
    print("Unknown shapes:")
    print("--------------")
    for unknown in unknown_shapes:
        print(f"  {unknown}")

@cli.command()    
@click.argument("file_path", type=str, nargs=1)
def all(file_path):
    """Runs all check"""
    tree = etree.parse(file_path)
    check_required_elements(tree)
    check_piping_components(tree)
    check_piping_network_segments(tree)
    check_shapes(tree)

@cli.command()
@click.argument("file_path", type=str, nargs=1)
def explore(file_path):
    """Shows how PipingComponents, PipingNetworkSegments and PipingNetworkSystems are structured"""
    tree = etree.parse(file_path)
    display_structure(tree)

### Functions for checking 
def check_required_elements(tree):
    findings = {}
    required_elems = ["Equipment", 
                "Equipment/Nozzle", 
                "PipingNetworkSystem",
                "PipingNetworkSystem/PipingNetworkSegment", 
                "PipingNetworkSystem/PipingNetworkSegment/PipingComponent",
                "ShapeCatalogue"]

    for e in required_elems:
        element = tree.find(e)
        if element is not None:
            findings[e] = "✅"
        else:
            findings[e] = "❌"
        
    table = create_table(findings, ["Element", "Present"])
    print(table)

def check_piping_components(tree):
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

def check_piping_network_segments(tree):
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

def check_shapes(tree):
    if (not tree.xpath("ShapeCatalogue")):
        return "No ShapeCatalogue present"

    findings = {}

    shape_value = tree.xpath("ShapeCatalogue/*/GenericAttributes/GenericAttribute[@Value]")
    shapes = tree.xpath("ShapeCatalogue/*")

    known_shapes = get_known_shapes(tree)
    unkown_shapes = get_unkown_shapes(tree)

    findings["Elements in ShapeCatalogue"] = len(shapes)
    findings["Elements in ShapeCatalogue with GenericAttribute[@Value]"] = len(shape_value)
    findings["Known shapes"] = len(known_shapes)
    findings["Unkown shapes"] = len(unkown_shapes)

    category_count_table = create_table(findings, ["Category", "Count"])
    print(category_count_table)

def display_structure(tree):
    systems = tree.xpath('PipingNetworkSystem')
    for system in systems:
        print_helper(system, 0)
        segments = system.xpath('PipingNetworkSegment')
        if(len(segments) == 0):
            print("------None")
        for segment in segments:
            print_helper(segment, 3)
            pipings = segment.xpath('PipingComponent')
            for piping in pipings:
                print_helper(piping, 6)

### Helper functions
def get_unkown_shapes(tree):
    noaka_symbols = get_noaka_symbols()
    componentNames = set([ elem.get("ComponentName").replace("_SHAPE", "") for elem in tree.xpath("//*[@ComponentName]") ])
    unkown_shapes = [name for name in componentNames if name not in noaka_symbols]
    return unkown_shapes

def get_known_shapes(tree):
    noaka_symbols = get_noaka_symbols()
    componentNames = set([ elem.get("ComponentName").replace("_SHAPE", "") for elem in tree.xpath("//*[@ComponentName]") ])
    known_shapes = [name for name in componentNames if name in noaka_symbols]
    return known_shapes

def get_noaka_symbols():
    with open('noaka_symbols.txt', 'r') as file:
        file_contents = file.read()
    return file_contents.split("\n")

def print_helper(elem, num_indent):
    indent = '-' * num_indent
    id = elem.get('ID')
    tag = elem.get('TagName')
    componentClass = elem.get('ComponentClass')
    result_string = f'{indent}{componentClass} {id} : {tag}' if tag is not None else f'{indent}{componentClass} {id}'
    print(result_string)

def create_table(dict, col_names):
    table = PrettyTable()
    table.field_names = col_names
    for category, count in dict.items():
            table.add_row([category, count])
    return table