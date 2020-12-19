export function getItemHeight(heightForItem: ((index: number) => number) | number, index: number) {
    if (typeof heightForItem === 'number') {
        return heightForItem;
    }
    return heightForItem(index);
}

export function findRangeIndex(itemOffsets: number[], contentOffset: number, containerSizeMain: number) {
    let firstIndex = -1;
    let lastIndex = -1;
    for (let i = 0; i < itemOffsets.length; i++) {
        if (itemOffsets[i] > contentOffset && firstIndex < 0) {
            firstIndex = i;
        }
        if (firstIndex > -1) {
            if (itemOffsets[i] > contentOffset + containerSizeMain) {
                lastIndex = i;
                break;
            }
        }
    }
    if (lastIndex === -1) {
        lastIndex = itemOffsets.length - 1;
    }
    return { firstIndex, lastIndex };
}

// export function getItemHeight(heightForItem: (index: number) => number, countForItem: number, height: number) {
//     if (typeof height !== 'number') {
//         return { itemHeightList: [], fullScreenNeedCountList: [] };
//     }
//     const itemHeightList = [];
//     for (let i = 0; i < countForItem; i++) {
//         const itemHeight = heightForItem(i);
//         itemHeightList.push(itemHeight);
//     }
//     return { itemHeightList, fullScreenNeedCountList: getFullScreenNeedCountList(itemHeightList, height) };
// }

// function getFullScreenNeedCountList(itemHeightList: number[], height: number) {
//     const res: number[] = [];
//     let currentItems: number[] = [];
//     let currentSumHeight = 0;
//     itemHeightList.forEach((v, i) => {
//         currentSumHeight -= currentItems[0] || 0;
//         currentItems = currentItems.slice(1);
//         if (currentSumHeight < height) {
//             for (let j = i + currentItems.length; j < itemHeightList.length - 1; j++) {
//                 currentSumHeight += itemHeightList[j];
//                 currentItems.push(itemHeightList[j]);
//                 if (currentSumHeight >= height) {
//                     break;
//                 }
//             }
//         }
//         if (currentSumHeight < height) {
//             res.push(res[res.length - 1]);
//         } else {
//             res.push(currentItems.length);
//         }
//     });
//     return res;
// }
