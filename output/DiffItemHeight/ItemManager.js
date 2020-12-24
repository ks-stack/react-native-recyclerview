import React from 'react';
function isDiffArr(arr1, arr2) {
    const arr = arr1.length > arr2.length ? arr1 : arr2;
    for (const i in arr) {
        if (arr1[i] !== arr2[i]) {
            return true;
        }
    }
    return false;
}
export default class ItemManager extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.list = [];
        this.update = (contentOffset, isForward) => {
            const { itemOffsets, containerSize, preOffset, horizontal, itemHeightList } = this.props;
            const arr = [];
            if (isForward || contentOffset < 50) {
                for (let i = 0; i < itemOffsets.length; i++) {
                    const { left, top } = itemOffsets[i];
                    const offset = horizontal ? left : top;
                    if (offset >= contentOffset - preOffset * 0.2) {
                        if (offset - itemHeightList[i] <= contentOffset + containerSize + preOffset * 0.8) {
                            arr.push(i);
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            else {
                for (let i = 0; i < itemOffsets.length; i++) {
                    const { left, top } = itemOffsets[i];
                    const offset = horizontal ? left : top;
                    if (offset >= contentOffset - preOffset * 0.8) {
                        if (offset - itemHeightList[i] <= contentOffset + containerSize + preOffset * 0.2) {
                            arr.push(i);
                        }
                        else {
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
    }
    render() {
        const { renderForItem, itemHeightList, horizontal, contentSize, itemOffsets, numColumns } = this.props;
        return this.list.map((index) => {
            const { height, width } = contentSize;
            const { left, top } = itemOffsets[index];
            const offset = (horizontal ? left : top) - itemHeightList[index];
            const sizeOne = (horizontal ? height : width) / numColumns;
            const style = horizontal
                ? { width: itemHeightList[index], height: sizeOne, left: offset, top }
                : { height: itemHeightList[index], width: sizeOne, top: offset, left };
            const cell = renderForItem(index, { ...style, position: 'absolute' });
            const dom = React.cloneElement(cell, { key: index });
            return dom;
        });
    }
}
