// Get knight image path based on equipped items

export function getKnightImagePath(effectArray) {
    let name = 'knight';
    if (effectArray[0]) name += '_bronze';
    else if (effectArray[1]) name += '_gold';
    else if (effectArray[2]) name += '_diamond';
    if (effectArray[3]) name += '_rainbow';
    return 'images/' + name + '.png';
}