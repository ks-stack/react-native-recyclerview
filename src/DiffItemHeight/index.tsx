import React from 'react';
import ItemManager from './ItemManager';
import Base, { BaseProps } from '../Base';
import { getItemHeight, findRangeIndex } from '../utils';

export default class DiffItemHeight extends Base {
    private itemOffsets: number[] = [];

    private itemHeightList: number[] = [];

    private shareManagerRef = React.createRef<ItemManager>();

    constructor(props: BaseProps) {
        super(props);
        this.onScrollEvent = this.onScroll;
    }

    onHorizontalChange = () => {};

    onContentOffsetChange = (isForward: boolean) => {
        const { onVisibleItemsChange } = this.props;
        this.shareManagerRef.current?.update(this.contentOffset, isForward);
        if (onVisibleItemsChange) {
            const { firstIndex, lastIndex } = findRangeIndex(
                this.itemOffsets,
                this.contentOffset,
                this.containerSizeMain,
            );
            if (this.firstItemIndex !== firstIndex || this.lastItemIndex !== lastIndex) {
                this.firstOnVisibleItemsChange = false;
                this.firstItemIndex = firstIndex;
                this.lastItemIndex = lastIndex;
                onVisibleItemsChange?.(this.firstItemIndex, this.lastItemIndex);
            }
        }
    };

    getPosition = () => {
        const { countForItem, heightForItem, heightForHeader = 0, heightForFooter = 0 } = this.props;
        const itemHeightList: number[] = [];
        const itemOffsets: number[] = [];
        let sumHeight = heightForHeader;
        if (this.containerSizeMain) {
            for (let i = 0; i < countForItem; i++) {
                const itemHeight = getItemHeight(heightForItem, i);
                itemHeightList.push(itemHeight);
                sumHeight += itemHeight;
                itemOffsets.push(sumHeight);
            }
            sumHeight += heightForFooter;
            this.itemHeightList = itemHeightList;
            this.itemOffsets = itemOffsets;
        }
        return { sumHeight };
    };

    renderMain = () => {
        const { renderForItem, horizontal, preOffset } = this.props;
        return (
            <ItemManager
                ref={this.shareManagerRef}
                renderForItem={renderForItem}
                itemHeightList={this.itemHeightList}
                horizontal={horizontal}
                itemOffsets={this.itemOffsets}
                containerSize={this.containerSize}
                containerSizeMain={this.containerSizeMain}
                preOffset={preOffset}
            />
        );
    };
}
