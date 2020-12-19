import React from 'react';
import { Platform } from 'react-native';
import { RenderForItem } from '../type';

interface Props {
    renderForItem: RenderForItem;
    itemHeightList: number[];
    itemOffsets: number[];
    horizontal?: boolean | null;
    containerSize: { height: number; width: number };
    containerSizeMain: number;
    preOffset: number;
}

function isDiffArr(arr1: number[], arr2: number[]) {
    if (arr1[0] !== arr2[0] || arr1[arr1.length - 1] !== arr2[arr2.length - 1]) {
        return true;
    }
    return false;
}

export default class ItemManager extends React.PureComponent<Props> {
    list: number[] = [];

    update = (contentOffset: number, isForward?: boolean) => {
        const { itemOffsets, containerSizeMain, preOffset } = this.props;
        const arr = [];
        // contentOffset < 50防止上滑道顶部时不预渲染
        if (isForward || contentOffset < 50) {
            for (let i = 0; i < itemOffsets.length; i++) {
                if (itemOffsets[i] >= contentOffset - preOffset * 0.2) {
                    if (itemOffsets[i] <= contentOffset + containerSizeMain + preOffset * 0.8) {
                        arr.push(i);
                    } else {
                        arr.push(i);
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < itemOffsets.length; i++) {
                if (itemOffsets[i] >= contentOffset - preOffset * 0.8) {
                    if (itemOffsets[i] <= contentOffset + containerSizeMain + preOffset * 0.2) {
                        arr.push(i);
                    } else {
                        arr.push(i);
                        break;
                    }
                }
            }
        }

        if (isDiffArr(this.list, arr)) {
            this.list = arr;
            this.forceUpdate();
        }
    };

    render() {
        const { renderForItem, itemHeightList, horizontal, containerSize, itemOffsets } = this.props;
        return this.list.map((index, i) => {
            const { height, width } = containerSize;
            const offset = itemOffsets[index] - itemHeightList[index];
            const style = horizontal
                ? { position: 'absolute' as 'absolute', width: itemHeightList[index], height, left: offset }
                : { position: 'absolute' as 'absolute', height: itemHeightList[index], width, top: offset };
            const cell = renderForItem(index, style);
            const dom = React.cloneElement(cell, { key: Platform.OS === 'ios' ? i : index });
            return dom;
        });
    }
}
