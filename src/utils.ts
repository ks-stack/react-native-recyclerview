export function getPosition(option: {
    containerSizeMain: number;
    countForItem: number;
    heightForHeader?: number;
    heightForFooter?: number;
    heightForItem: (index: number) => number;
    shareCount: number;
    shareMinHeight: number;
}) {
    const {
        containerSizeMain,
        shareCount,
        shareMinHeight,
        countForItem,
        heightForItem,
        heightForHeader = 0,
        heightForFooter = 0,
    } = option;
    const inputs: number[][] = [];
    const outputs: number[][] = [];
    const shareGroup: number[][][] = [];
    const itemHeightList: number[] = [];
    let indexes: number[] = [];
    let sumHeight = heightForHeader;
    if (!containerSizeMain) {
        return { inputs, outputs, sumHeight, shareGroup, itemHeightList };
    }
    const lastOffset = [];
    const itemOffsets = [];
    let currentShareHeight = 0;
    let currentShareIndex = 0;
    for (let i = 0; i < shareCount; i++) {
        inputs.push(i === 0 ? [Number.MIN_SAFE_INTEGER] : []);
        outputs.push(i === 0 ? [sumHeight] : []);
        lastOffset.push(sumHeight);
        shareGroup.push([]);
    }
    for (let i = 0; i < countForItem; i++) {
        const itemHeight = heightForItem(i);
        itemHeightList.push(itemHeight);
        currentShareHeight += itemHeight;
        sumHeight += itemHeight;
        indexes.push(i);
        itemOffsets.push(sumHeight);
        if (currentShareHeight >= shareMinHeight || i === countForItem - 1) {
            shareGroup[currentShareIndex].push(indexes);
            indexes = [];
            currentShareHeight = 0;
            currentShareIndex += 1;
            currentShareIndex %= shareCount;
            if (i === countForItem - 1) break;
            if (inputs[currentShareIndex].length === 0) {
                inputs[currentShareIndex].push(Number.MIN_SAFE_INTEGER);
            }
            // const input = sumHeight - containerSizeMain - shareMinHeight;
            // 位置是原生动画，不需要提前移动
            const input = sumHeight - containerSizeMain;
            inputs[currentShareIndex].push(input);
            inputs[currentShareIndex].push(input);
            if (outputs[currentShareIndex].length === 0) {
                outputs[currentShareIndex].push(sumHeight);
                outputs[currentShareIndex].push(sumHeight);
            } else {
                outputs[currentShareIndex].push(lastOffset[currentShareIndex]);
            }
            outputs[currentShareIndex].push(sumHeight);
            lastOffset[currentShareIndex] = sumHeight;
        }
    }
    sumHeight += heightForFooter;
    inputs.forEach((range) => range.push(Number.MAX_SAFE_INTEGER));
    outputs.forEach((range) => range.push(range[range.length - 1]));
    return { inputs, outputs, sumHeight, shareGroup, itemOffsets, itemHeightList };
}

export function getShareCount(containerSizeMain: number, shareMinHeight: number, shareCount?: number) {
    if (!shareCount) {
        const dbCount = (containerSizeMain % shareMinHeight) / shareMinHeight;
        const intCount = Math.floor(containerSizeMain / shareMinHeight);
        if (dbCount > 0.5) {
            return intCount + 3;
        }
        return intCount + 2;
    }
    return shareCount;
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
