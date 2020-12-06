import { Platform } from 'react-native';

export function getPosition(option: {
    containerSizeMain: number;
    countForItem: number;
    horizontal?: boolean;
    heightForHeader?: number;
    heightForFooter?: number;
    heightForItem: (index: number) => number;
    shareCount?: number;
}) {
    const {
        containerSizeMain,
        countForItem,
        heightForItem,
        heightForHeader = 0,
        heightForFooter = 0,
        shareCount = 20,
    } = option;
    const inputs: number[][] = [];
    const outputs: number[][] = [];
    const shareGroup: number[][] = [];
    const itemHeightList: number[] = [];
    let sumHeight = heightForHeader;
    if (typeof containerSizeMain !== 'number') {
        return { inputs, outputs, sumHeight, shareGroup, itemHeightList };
    }
    const lastOffset = [];
    const itemOffsets = [];
    let currentShareIndex = 0;
    for (let i = 0; i < shareCount; i++) {
        inputs.push([Number.MIN_SAFE_INTEGER]);
        outputs.push(i === 0 ? [sumHeight] : []);
        lastOffset.push(sumHeight);
        shareGroup.push([]);
    }

    for (let i = 0; i < countForItem; i++) {
        const itemHeight = heightForItem(i);
        itemHeightList.push(itemHeight);
        shareGroup[currentShareIndex].push(i);
        if (i === countForItem - 1) break;
        currentShareIndex += 1;
        currentShareIndex %= shareCount;

        // 安卓需要预渲染下一个item
        const input =
            Platform.OS === 'ios' ? sumHeight - containerSizeMain + itemHeight : sumHeight - containerSizeMain;
        inputs[currentShareIndex].push(input);
        inputs[currentShareIndex].push(input);
        sumHeight += itemHeight;
        if (outputs[currentShareIndex].length === 0) {
            outputs[currentShareIndex].push(sumHeight);
            outputs[currentShareIndex].push(sumHeight);
        } else {
            outputs[currentShareIndex].push(lastOffset[currentShareIndex]);
        }
        outputs[currentShareIndex].push(sumHeight);
        lastOffset[currentShareIndex] = sumHeight;
        itemOffsets.push(sumHeight);
    }
    sumHeight += heightForFooter;
    inputs.forEach((range) => range.push(Number.MAX_SAFE_INTEGER));
    outputs.forEach((range) => range.push(range[range.length - 1]));
    return { inputs, outputs, sumHeight, shareGroup, itemOffsets, itemHeightList };
}

export function getItemHeight(heightForItem: (index: number) => number, countForItem: number, height: number) {
    if (typeof height !== 'number') {
        return { itemHeightList: [], fullScreenNeedCountList: [] };
    }
    const itemHeightList = [];
    for (let i = 0; i < countForItem; i++) {
        const itemHeight = heightForItem(i);
        itemHeightList.push(itemHeight);
    }
    return { itemHeightList, fullScreenNeedCountList: getFullScreenNeedCountList(itemHeightList, height) };
}

function getFullScreenNeedCountList(itemHeightList: number[], height: number) {
    const res: number[] = [];
    let currentItems: number[] = [];
    let currentSumHeight = 0;
    itemHeightList.forEach((v, i) => {
        currentSumHeight -= currentItems[0] || 0;
        currentItems = currentItems.slice(1);
        if (currentSumHeight < height) {
            for (let j = i + currentItems.length; j < itemHeightList.length - 1; j++) {
                currentSumHeight += itemHeightList[j];
                currentItems.push(itemHeightList[j]);
                if (currentSumHeight >= height) {
                    break;
                }
            }
        }
        if (currentSumHeight < height) {
            res.push(res[res.length - 1]);
        } else {
            res.push(currentItems.length);
        }
    });
    return res;
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
