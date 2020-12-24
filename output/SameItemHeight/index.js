import React from 'react';
import { Animated } from 'react-native';
import ShareManager from './ShareManager';
import Base from '../Base';
export default class SameItemHeight extends Base {
    constructor(props) {
        super(props);
        this.inputs = [];
        this.outputs = [];
        this.shareGroup = [];
        this.shareManagerRef = React.createRef();
        this.onHorizontalChange = () => {
            const { horizontal } = this.props;
            const event = horizontal
                ? [{ nativeEvent: { contentOffset: { x: this.offset } } }]
                : [{ nativeEvent: { contentOffset: { y: this.offset } } }];
            this.onScrollEvent = Animated.event(event, { useNativeDriver: true, listener: this.onScroll });
        };
        this.onContentOffsetChange = (isForward) => {
            const { onVisibleItemsChange, heightForItem } = this.props;
            this.shareManagerRef.current?.update(this.contentOffset, isForward);
            if (onVisibleItemsChange) {
                const firstIndex = Math.floor(this.contentOffset / heightForItem);
                const lastIndex = Math.ceil((this.contentOffset + this.containerSize) / heightForItem);
                if (this.firstItemIndex !== firstIndex || this.lastItemIndex !== lastIndex) {
                    this.firstOnVisibleItemsChange = false;
                    this.firstItemIndex = firstIndex;
                    this.lastItemIndex = lastIndex;
                    onVisibleItemsChange?.(this.firstItemIndex, this.lastItemIndex);
                }
            }
        };
        this.getSumHeight = () => {
            const { countForItem, heightForItem, heightForHeader = 0, heightForFooter = 0, preOffset, numColumns, } = this.props;
            const inputs = [];
            const outputs = [];
            const shareGroup = [];
            let sumHeight = heightForHeader;
            if (!this.containerSize) {
                return sumHeight;
            }
            const itemCount = Math.ceil(countForItem / numColumns);
            const itemHeight = typeof heightForItem === 'number' ? heightForItem : 0;
            const shareCount = Math.floor((this.containerSize + preOffset) / itemHeight) + 2;
            const lastOffset = [];
            for (let i = 0; i < shareCount; i++) {
                inputs.push(i === 0 ? [Number.MIN_SAFE_INTEGER] : []);
                outputs.push(i === 0 ? [sumHeight] : []);
                lastOffset.push(sumHeight);
                shareGroup.push([]);
            }
            let currentShareIndex = 0;
            for (let i = 0; i < itemCount; i++) {
                sumHeight += itemHeight;
                shareGroup[currentShareIndex].push(i);
                currentShareIndex += 1;
                currentShareIndex %= shareCount;
                if (i === itemCount - 1)
                    break;
                if (inputs[currentShareIndex].length === 0) {
                    inputs[currentShareIndex].push(Number.MIN_SAFE_INTEGER);
                }
                const input = sumHeight - this.containerSize;
                inputs[currentShareIndex].push(input);
                inputs[currentShareIndex].push(input);
                if (outputs[currentShareIndex].length === 0) {
                    outputs[currentShareIndex].push(sumHeight);
                    outputs[currentShareIndex].push(sumHeight);
                }
                else {
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
            return sumHeight;
        };
        this.renderMain = () => {
            const { renderForItem, horizontal, heightForItem, preOffset, numColumns, countForItem, shareStyle, } = this.props;
            return (React.createElement(ShareManager, { shareStyle: shareStyle, shareGroup: this.shareGroup, inputs: this.inputs, outputs: this.outputs, ref: this.shareManagerRef, renderForItem: renderForItem, numColumns: numColumns, offset: this.offset, horizontal: horizontal, contentSize: this.contentSize, containerSize: this.containerSize, heightForItem: heightForItem, preOffset: preOffset, countForItem: countForItem }));
        };
        this.offset = new Animated.Value(0);
        this.onHorizontalChange();
    }
}
