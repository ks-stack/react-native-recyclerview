import React from 'react';
import ItemManager from './ItemManager';
import Base from '../Base';
import { getItemHeight } from '../utils';
function findRangeIndex(itemOffsets, contentOffset, containerSizeMain, horizontal) {
    let firstIndex = -1;
    let lastIndex = -1;
    for (let i = 0; i < itemOffsets.length; i++) {
        const offset = horizontal ? itemOffsets[i].left : itemOffsets[i].top;
        if (offset > contentOffset && firstIndex < 0) {
            firstIndex = i;
        }
        if (firstIndex > -1) {
            if (offset > contentOffset + containerSizeMain) {
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
export default class DiffItemHeight extends Base {
    constructor(props) {
        super(props);
        this.itemOffsets = [];
        this.itemHeightList = [];
        this.shareManagerRef = React.createRef();
        this.onHorizontalChange = () => { };
        this.onContentOffsetChange = (isForward) => {
            const { onVisibleItemsChange, horizontal } = this.props;
            this.shareManagerRef.current?.update(this.contentOffset, isForward);
            if (onVisibleItemsChange) {
                const { firstIndex, lastIndex } = findRangeIndex(this.itemOffsets, this.contentOffset, this.containerSizeMain, horizontal);
                if (this.firstItemIndex !== firstIndex || this.lastItemIndex !== lastIndex) {
                    this.firstOnVisibleItemsChange = false;
                    this.firstItemIndex = firstIndex;
                    this.lastItemIndex = lastIndex;
                    onVisibleItemsChange?.(this.firstItemIndex, this.lastItemIndex);
                }
            }
        };
        this.getPosition = () => {
            const { countForItem, heightForItem, heightForHeader = 0, heightForFooter = 0, numColumns, horizontal, } = this.props;
            const itemHeightList = [];
            const itemOffsets = [];
            const groupOffset = Array(numColumns)
                .fill('')
                .map(() => heightForHeader);
            if (this.containerSizeMain) {
                const sizeOne = (horizontal ? this.containerSize.height : this.containerSize.width) / numColumns;
                let currentGroupIndex = 0;
                for (let i = 0; i < countForItem; i++) {
                    currentGroupIndex = groupOffset.findIndex((v) => v === Math.min(...groupOffset));
                    const itemHeight = Number(getItemHeight(heightForItem, i).toFixed(2));
                    groupOffset[currentGroupIndex] = groupOffset[currentGroupIndex] + itemHeight;
                    itemHeightList.push(itemHeight);
                    itemOffsets.push({
                        top: groupOffset[currentGroupIndex],
                        left: sizeOne * currentGroupIndex,
                    });
                }
                this.itemHeightList = itemHeightList;
                this.itemOffsets = itemOffsets;
            }
            return { sumHeight: Math.max(...groupOffset) + heightForFooter };
        };
        this.renderMain = () => {
            const { renderForItem, horizontal, preOffset, numColumns } = this.props;
            return (React.createElement(ItemManager, { ref: this.shareManagerRef, renderForItem: renderForItem, itemHeightList: this.itemHeightList, horizontal: horizontal, itemOffsets: this.itemOffsets, containerSize: this.containerSize, containerSizeMain: this.containerSizeMain, preOffset: preOffset, numColumns: numColumns }));
        };
        this.onScrollEvent = this.onScroll;
    }
}
