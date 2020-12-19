import React from 'react';
import { Animated } from 'react-native';
import ShareManager from './ShareManager';
import Base, { BaseProps } from '../Base';

export default class SameItemHeight extends Base {
    private offset: Animated.Value;

    private inputs: number[][] = [];

    private outputs: number[][] = [];

    private shareGroup: number[][] = [];

    private shareManagerRef = React.createRef<ShareManager>();

    constructor(props: BaseProps) {
        super(props);
        this.offset = new Animated.Value(0);
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
            const lastIndex = Math.ceil((this.contentOffset + this.containerSizeMain) / (heightForItem as number));
            if (this.firstItemIndex !== firstIndex || this.lastItemIndex !== lastIndex) {
                this.firstOnVisibleItemsChange = false;
                this.firstItemIndex = firstIndex;
                this.lastItemIndex = lastIndex;
                onVisibleItemsChange?.(this.firstItemIndex, this.lastItemIndex);
            }
        }
    };

    getPosition = () => {
        const { countForItem, heightForItem, heightForHeader = 0, heightForFooter = 0, preOffset } = this.props;
        const inputs: number[][] = [];
        const outputs: number[][] = [];
        const shareGroup: number[][] = [];
        let sumHeight = heightForHeader;
        if (!this.containerSizeMain) {
            return { sumHeight };
        }

        const itemHeight = typeof heightForItem === 'number' ? heightForItem : 0;
        const shareCount = Math.floor((this.containerSizeMain + preOffset) / itemHeight) + 2;
        const lastOffset = [];

        for (let i = 0; i < shareCount; i++) {
            inputs.push(i === 0 ? [Number.MIN_SAFE_INTEGER] : []);
            outputs.push(i === 0 ? [sumHeight] : []);
            lastOffset.push(sumHeight);
            shareGroup.push([]);
        }

        let currentShareIndex = 0;
        for (let i = 0; i < countForItem; i++) {
            sumHeight += itemHeight;
            shareGroup[currentShareIndex].push(i);

            currentShareIndex += 1;
            currentShareIndex %= shareCount;
            if (i === countForItem - 1) break;
            if (inputs[currentShareIndex].length === 0) {
                inputs[currentShareIndex].push(Number.MIN_SAFE_INTEGER);
            }
            // const input = sumHeight - containerSizeMain - shareMinHeight;
            // 位置是原生动画，不需要提前移动
            const input = sumHeight - this.containerSizeMain;
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
        sumHeight += heightForFooter;
        inputs.forEach((range) => range.push(Number.MAX_SAFE_INTEGER));
        outputs.forEach((range) => range.push(range[range.length - 1]));
        this.shareGroup = shareGroup;
        this.inputs = inputs;
        this.outputs = outputs;
        return { sumHeight };
    };

    renderMain = () => {
        const { renderForItem, horizontal, heightForItem } = this.props;
        return (
            <ShareManager
                shareGroup={this.shareGroup}
                inputs={this.inputs}
                outputs={this.outputs}
                ref={this.shareManagerRef}
                renderForItem={renderForItem}
                offset={this.offset}
                horizontal={horizontal}
                containerSize={this.containerSize}
                containerSizeMain={this.containerSizeMain}
                heightForItem={heightForItem as number}
            />
        );
    };
}
