export function getItemHeight(heightForItem, index) {
    if (typeof heightForItem === 'number') {
        return heightForItem;
    }
    return heightForItem(index);
}
