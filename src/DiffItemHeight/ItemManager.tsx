/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unreachable */
import React from 'react';
import { RenderForItem } from '../type.d';

interface Props {
    renderForItem: RenderForItem;
    itemHeightList: number[];
    itemOffsets: { top: number; left: number }[];
    horizontal?: boolean | null;
    containerSize: { height: number; width: number };
    containerSizeMain: number;
    preOffset: number;
    numColumns: number;
}

function isDiffArr(arr1: number[], arr2: number[]) {
    const arr = arr1.length > arr2.length ? arr1 : arr2;
    for (const i in arr) {
        if (arr1[i] !== arr2[i]) {
            return true;
        }
    }
    return false;
}

export default class ItemManager extends React.PureComponent<Props> {
    list: number[] = [];

    update = (contentOffset: number, isForward?: boolean) => {
        const { itemOffsets, containerSizeMain, preOffset, horizontal, itemHeightList } = this.props;
        const arr = [];
        // contentOffset < 50防止上滑道顶部时不预渲染
        if (isForward || contentOffset < 50) {
            for (let i = 0; i < itemOffsets.length; i++) {
                const { left, top } = itemOffsets[i];
                const offset = horizontal ? left : top;
                if (offset >= contentOffset - preOffset * 0.2) {
                    if (offset - itemHeightList[i] <= contentOffset + containerSizeMain + preOffset * 0.8) {
                        arr.push(i);
                    } else {
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < itemOffsets.length; i++) {
                const { left, top } = itemOffsets[i];
                const offset = horizontal ? left : top;
                if (offset >= contentOffset - preOffset * 0.8) {
                    if (offset - itemHeightList[i] <= contentOffset + containerSizeMain + preOffset * 0.2) {
                        arr.push(i);
                    } else {
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
        const { renderForItem, itemHeightList, horizontal, containerSize, itemOffsets, numColumns } = this.props;
        return this.list.map((index) => {
            const { height, width } = containerSize;
            const { left, top } = itemOffsets[index];
            const offset = (horizontal ? left : top) - itemHeightList[index];
            const sizeOne = (horizontal ? height : width) / numColumns;
            const style = horizontal
                ? { width: itemHeightList[index], height: sizeOne, left: offset, top }
                : { height: itemHeightList[index], width: sizeOne, top: offset, left };
            const cell = renderForItem(index, { ...style, position: 'absolute' as 'absolute' });
            const dom = React.cloneElement(cell, { key: index });
            return dom;
        });
    }
}
