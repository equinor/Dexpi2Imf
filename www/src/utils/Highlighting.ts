export function setAttributes(el: Element, attrs: { [key: string]: string }) {
    Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
}

export function setPathHighlight(d: string, connectorId: string, color: string) {
    const highlightRect = document.createElementNS("http://www.w3.org/2000/svg", "path");

    setAttributes(highlightRect, {
        'd': d,
        'id': connectorId,
        'fill': 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke': color,
        'stroke-width': '5',
        'stroke-opacity': '0.5',
        'class': 'commissionHighlight',
    })

    return highlightRect;
}

export function setEllipseHighlight(cx: string, cy: string, rx: string, ry: string, color = 'yellow') {
    const highlightEllipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    setAttributes(highlightEllipse, {
        'cx': cx,
        'cy': cy,
        'rx': rx,
        'ry': ry,
        'fill': 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke': color,
        'stroke-width': '5',
        'stroke-opacity': '0.5',
        'class': 'commissionHighlight',
    })

    return highlightEllipse;
}

export function addPipeHighlight(pipe: Element, color = 'yellow') {
    const connectorId = pipe.id + '_highlight';
    const existingHighlightRect = document.getElementById(connectorId);
    if (existingHighlightRect)
        return;
    const d = pipe.getAttribute('d')!;

    const highlightRect = setPathHighlight(d, connectorId, color);

    highlightRect.addEventListener('click', async () => {
        if (pipe.classList.contains('boundary')) {
            highlightRect.remove();
            pipe.classList.remove('boundary');
        } else {
            pipe.classList.add('boundary')
        }
    });

    const parent = pipe.parentNode!;
    parent.insertBefore(highlightRect, pipe);

}


export function changePipeHighLight(pipe: Element, color: string) {
    const connectorId = pipe.id + '_highlight';
    const highlightPath = document.getElementById(connectorId);
    if (highlightPath) {
        highlightPath.setAttribute('stroke', color);
    }
}

export function removePipeHighlight(pipe: Element) {
    const connectorId = pipe.id + '_highlight';
    const highlightRect = document.getElementById(connectorId);
    if (highlightRect)
        highlightRect.remove();
}

export function addNodeHighlight(node: Element, color = 'yellow') {
    const elements = node.querySelectorAll('ellipse, path');
    for (const element of elements) {
        const connectorId = element.id + '_highlight';
        switch (element.tagName) {
            case 'path': {
                element.parentNode!.parentNode!.prepend(setPathHighlight(element.getAttribute('d')!, connectorId, color));
                break;
            }
            case 'ellipse': {
                element.parentNode!.parentNode!.prepend(setEllipseHighlight(element.getAttribute('cx')!, element.getAttribute('cy')!, element.getAttribute('rx')!, element.getAttribute('ry')!, color));
                break;
            }
            default: {
                break;
            }
        }
    }
}

export function addCommissionHighlight(node: Element, color = 'yellow') {
    const highlightRects = node.querySelectorAll('.commissionHighlight');
    if (highlightRects.length !== 0)
        return;
    const svgElement = node as SVGGraphicsElement;
    const bbox = svgElement.getBBox();

    // Create a new rect element
    const highlightRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    setAttributes(highlightRect, {
        'x': `${bbox.x}`,
        'y': `${bbox.y}`,
        'width': `${bbox.width}`,
        'height': `${bbox.height}`,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke': color, 'stroke-width': '5', 'stroke-opacity': '0.5', 'class': 'commissionHighlight'
    })
    node.appendChild(highlightRect);
}

export function removeCommissionHighlight(node: Element) {
    const parentElement = node.parentNode!;
    if (parentElement.parentElement!.tagName === 'symbol') {
        const internalPaths = parentElement.querySelectorAll('path, ellipse, rect, circle');
        internalPaths.forEach(path => {
            path.setAttribute('fill', 'none');
            path.setAttribute('fill-opacity', '0.0');
        });
    }
    const highlightRects = node.querySelectorAll('.commissionHighlight');
    highlightRects.forEach(rect => rect.remove());
}