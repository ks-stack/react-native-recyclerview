/* eslint-disable operator-assignment */
import React from 'react';
import ItemManager from './ItemManager';
import Base, { BaseProps } from '../Base';
import { getItemHeight } from '../utils';

function findRangeIndex(
    itemOffsets: { top: number; left: number }[],
    contentOffset: number,
    containerSize: number,
    horizontal: boolean,
) {
    let firstIndex = -1;
    let lastIndex = -1;
    for (let i = 0; i < itemOffsets.length; i++) {
        const offset = horizontal ? itemOffsets[i].left : itemOffsets[i].top;
        if (offset > contentOffset && firstIndex < 0) {
            firstIndex = i;
        }
        if (firstIndex > -1) {
            if (offset > contentOffset + containerSize) {
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
    private itemOffsets: { top: number; left: number }[] = [];

    private itemHeightList: number[] = [];

    private shareManagerRef = React.createRef<ItemManager>();

    constructor(props: BaseProps) {
        super(props);
        this.onScrollEvent = this.onScroll;
    }

    onHorizontalChange = () => {};

    onContentOffsetChange = (isForward: boolean) => {
        const { onVisibleItemsChange, horizontal } = this.props;
        this.shareManagerRef.current?.update(this.contentOffset, isForward);
        if (onVisibleItemsChange) {
            const { firstIndex, lastIndex } = findRangeIndex(
                this.itemOffsets,
                this.contentOffset,
                this.containerSize,
                horizontal,
            );
            if (this.firstItemIndex !== firstIndex || this.lastItemIndex !== lastIndex) {
                this.firstOnVisibleItemsChange = false;
                this.firstItemIndex = firstIndex;
                this.lastItemIndex = lastIndex;
                onVisibleItemsChange?.(this.firstItemIndex, this.lastItemIndex);
            }
        }
    };

    getSumHeight = () => {
        const {
            countForItem,
            heightForItem,
            heightForHeader = 0,
            heightForFooter = 0,
            numColumns,
            horizontal,
        } = this.props;
        const itemHeightList: number[] = [];
        const itemOffsets: { top: number; left: number }[] = [];

        const groupOffset = Array(numColumns)
            .fill('')
            .map(() => heightForHeader);

        if (this.containerSize) {
            const sizeOne = (horizontal ? this.contentSize.height : this.contentSize.width) / numColumns;
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
        return Math.max(...groupOffset) + heightForFooter;
    };

    renderMain = () => {
        const { renderForItem, horizontal, preOffset, numColumns } = this.props;
        return (
            <ItemManager
                ref={this.shareManagerRef}
                renderForItem={renderForItem}
                itemHeightList={this.itemHeightList}
                horizontal={horizontal}
                itemOffsets={this.itemOffsets}
                contentSize={this.contentSize}
                containerSize={this.containerSize}
                preOffset={preOffset}
                numColumns={numColumns}
            />
        );
    };
}
