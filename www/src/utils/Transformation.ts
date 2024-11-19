export default function calculateAngleAndRotation(refX: number, refY: number, posX: number, posY: number) {
    const transformations = [];
    //Pointing up
    if (refX == 0 && refY == 1) {
        transformations.push('rotate(-90 ' + posX + ' ' + posY + ')');
    }
    // Pointing down
    if (refX == 0 && refY == -1) {
        transformations.push('rotate(90 ' + posX + ' ' + posY + ')');
    }
    // Pointing left
    if (refX == -1 && refY == 0) {
        transformations.push('rotate(180 ' + posX + ' ' + posY + ')');
    }
    // Apply translation
    transformations.push('translate('+ posX + ' ' + posY + ')');
    return transformations.join('');
}