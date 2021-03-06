import React from 'react';
import { Animated } from 'react-native';
import ShareManager from './ShareManager';
import Base, { BaseProps } from '../Base';

export default class SameItemHeight extends Base {
    private inputs: number[][] = [];

    private outputs: number[][] = [];

    private shareGroup: number[][] = [];

    private shareManagerRef = React.createRef<ShareManager>();

    constructor(props: BaseProps) {
        super(props);
        this.onHorizontalChange();
    }

    onHorizontalChange = () => {
        const { horizontal } = this.props;
        const event = horizontal
            ? [{ nativeEvent: { contentOffset: { x: this.offset } } }]
            : [{ nativeEvent: { contentOffset: { y: this.offset } } }];
        this.onScrollEvent = Animated.event(event, { useNativeDriver: true, listener: this.onScroll });
    };

    onContentOffsetChange = (isForward: boolean) => {
        const { onVisibleItemsChange, heightForItem } = this.props;
        this.shareManagerRef.current?.update(this.contentOffset, isForward);
        if (onVisibleItemsChange) {
            const firstIndex = Math.floor(this.contentOffset / (heightForItem as number));
            const lastIndex = Math.ceil((this.contentOffset + this.containerSize) / (heightForItem as number));
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
            preOffset,
            numColumns,
            renderForFooter,
        } = this.props;
        const inputs: number[][] = [];
        const outputs: number[][] = [];
        const shareGroup: number[][] = [];
        let shareCurrentOffset = heightForHeader;
        const itemCount = Math.ceil(countForItem / numColumns);
        if (this.containerSize) {
            const itemHeight = typeof heightForItem === 'number' ? heightForItem : 0;
            const shareCount = Math.floor((this.containerSize + preOffset) / itemHeight) + 2;
            const lastOffset = [];

            for (let i = 0; i < shareCount; i++) {
                inputs.push(i === 0 ? [Number.MIN_SAFE_INTEGER] : []);
                outputs.push(i === 0 ? [shareCurrentOffset] : []);
                lastOffset.push(shareCurrentOffset);
                shareGroup.push([]);
            }

            let currentShareIndex = 0;
            const minItemCount = Math.max(itemCount, shareCount);
            for (let i = 0; i < minItemCount; i++) {
                shareCurrentOffset += itemHeight;
                shareGroup[currentShareIndex].push(i);

                currentShareIndex += 1;
                currentShareIndex %= shareCount;
                if (i === minItemCount - 1) break;
                if (inputs[currentShareIndex].length === 0) {
                    inputs[currentShareIndex].push(Number.MIN_SAFE_INTEGER);
                }
                // const input = sumHeight - containerSize - shareMinHeight;
                // 位置是原生动画，不需要提前移动
                const input = shareCurrentOffset - this.containerSize;
                inputs[currentShareIndex].push(input);
                inputs[currentShareIndex].push(input);
                if (outputs[currentShareIndex].length === 0) {
                    outputs[currentShareIndex].push(shareCurrentOffset);
                    outputs[currentShareIndex].push(shareCurrentOffset);
                } else {
                    outputs[currentShareIndex].push(lastOffset[currentShareIndex]);
                }
                outputs[currentShareIndex].push(shareCurrentOffset);
                lastOffset[currentShareIndex] = shareCurrentOffset;
            }
            inputs.forEach((range) => range.push(Number.MAX_SAFE_INTEGER));
            outputs.forEach((range) => range.push(range[range.length - 1] || 0));
            this.shareGroup = shareGroup;
            this.inputs = inputs;
            this.outputs = outputs;
        }

        return heightForHeader + itemCount * (heightForItem as number) + (renderForFooter?.() ? heightForFooter : 0);
    };

    renderMain = () => {
        const {
            renderForItem,
            horizontal,
            heightForItem,
            heightForHeader,
            preOffset,
            numColumns,
            countForItem,
            shareStyle,
        } = this.props;
        return (
            <ShareManager
                shareStyle={shareStyle}
                shareGroup={this.shareGroup}
                inputs={this.inputs}
                outputs={this.outputs}
                ref={this.shareManagerRef}
                renderForItem={renderForItem}
                numColumns={numColumns}
                offset={this.offset}
                horizontal={horizontal}
                containerSize={this.containerSize}
                heightForItem={heightForItem as number}
                preOffset={preOffset}
                countForItem={countForItem}
                heightForHeader={heightForHeader}
            />
        );
    };
}
