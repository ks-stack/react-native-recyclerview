import React from 'react';
import {
    Animated,
    ScrollViewProps,
    StyleSheet,
    LayoutChangeEvent,
    ScrollView,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
} from 'react-native';
import ShareManager, { RenderForItem } from './ShareManager';
import { getPosition, findRangeIndex, getShareCount } from './utils';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export interface ListViewProps extends ScrollViewProps {
    countForItem: number;

    renderForHeader?: () => React.ReactElement | null;
    renderForItem: RenderForItem;
    renderForFooter?: () => React.ReactElement | null;
    ListEmptyComponent?: () => React.ReactElement | React.ReactElement | null;

    heightForItem: (index: number) => number;
    heightForHeader?: number;
    heightForFooter?: number;

    debug?: boolean;

    shareCount?: number;
    shareMinHeight?: number;
    preOffset?: number;

    onEndReachedThreshold?: number;
    onEndReached?: (distanceFromEnd: number) => void;

    onVisibleItemsChange?: (firstItemIndex: number, lastItemIndex: number) => void;
}

export default class List extends React.PureComponent<ListViewProps> {
    private ref = React.createRef<any>();

    private shareManagerRef = React.createRef<ShareManager>();

    private offset: Animated.Value;

    private contentOffset: number = 0;

    private onScrollEvent: any;

    private firstItemIndex: number = -1;

    private lastItemIndex: number = -1;

    private itemOffsets: number[] = [];

    private onLoadedOffset: number = 0;

    private firstOnVisibleItemsChange = true;

    private containerSize = { height: 0, width: 0 };

    private containerSizeMain = 0;

    constructor(props: ListViewProps) {
        super(props);
        const { style, horizontal } = props;
        const { height, width } = StyleSheet.flatten(style);
        this.containerSize = {
            height: typeof height === 'number' ? height : 0,
            width: typeof width === 'number' ? width : 0,
        };
        this.containerSizeMain = horizontal ? this.containerSize.width : this.containerSize.height;
        this.offset = new Animated.Value(0);
        const event = horizontal
            ? [{ nativeEvent: { contentOffset: { x: this.offset } } }]
            : [{ nativeEvent: { contentOffset: { y: this.offset } } }];
        this.onScrollEvent = Animated.event(event, { useNativeDriver: true, listener: this.onScroll });
    }

    componentDidUpdate(oldProps: ListViewProps) {
        const { countForItem, horizontal, onEndReached, heightForItem } = this.props;
        if (!this.containerSizeMain) {
            return;
        }
        if (countForItem < oldProps.countForItem) {
            this.onLoadedOffset = 0;
            this.firstOnVisibleItemsChange = true;
        }
        if (countForItem > 0 && this.firstOnVisibleItemsChange) {
            this.onContentOffsetChange();
        }
        if (onEndReached && countForItem > 0 && this.onLoadedOffset <= this.containerSizeMain) {
            this.onEndReached(
                Array(countForItem)
                    .fill('')
                    .reduce((sum, v, i) => sum + heightForItem(i), 0),
            );
        }
        if (horizontal !== oldProps.horizontal) {
            const event = horizontal
                ? [{ nativeEvent: { contentOffset: { x: this.offset } } }]
                : [{ nativeEvent: { contentOffset: { y: this.offset } } }];
            this.onScrollEvent = Animated.event(event, { useNativeDriver: true, listener: this.onScroll });
        }
    }

    private onContentOffsetChange = (isForward?: boolean) => {
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

    private onEndReached = (contentHeight: number) => {
        const { onEndReached, onEndReachedThreshold = 1 } = this.props;
        const distanceFromEnd = contentHeight - this.contentOffset - this.containerSizeMain;
        if (
            this.onLoadedOffset <= this.containerSizeMain ||
            (distanceFromEnd <= onEndReachedThreshold * this.containerSizeMain && contentHeight > this.onLoadedOffset)
        ) {
            this.onLoadedOffset = contentHeight;
            onEndReached?.(distanceFromEnd);
        }
    };

    private onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { onEndReached, horizontal, onScroll } = this.props;
        const nextContentOffset = horizontal ? e.nativeEvent.contentOffset.x : e.nativeEvent.contentOffset.y;
        const isForward = nextContentOffset > this.contentOffset;
        this.contentOffset = nextContentOffset;
        this.onContentOffsetChange(isForward);
        onScroll?.(e);
        if (onEndReached) {
            this.onEndReached(horizontal ? e.nativeEvent.contentSize.width : e.nativeEvent.contentSize.height);
        }
    };

    private onLayout = (e: LayoutChangeEvent) => {
        const { onLayout, horizontal } = this.props;
        const { height, width } = e.nativeEvent.layout;
        if (this.containerSize.height !== height || this.containerSize.width !== width) {
            this.containerSize = { height, width };
            this.containerSizeMain = horizontal ? width : height;
            this.forceUpdate();
        }
        onLayout?.(e);
    };

    scrollTo = (option?: { x?: number; y?: number; animated?: boolean; duration?: number }) => {
        this.ref.current?._component.scrollTo(option);
    };

    scrollToEnd = (option?: { animated?: boolean; duration?: number }) => {
        this.ref.current?._component.scrollToEnd(option);
    };

    flashScrollIndicators = () => {
        this.ref.current?._component.flashScrollIndicators();
    };

    render() {
        const {
            countForItem,
            heightForItem,
            renderForItem,
            debug,
            ListEmptyComponent,
            horizontal,
            renderForHeader,
            heightForHeader,
            heightForFooter,
            renderForFooter,
            shareMinHeight = 150,
            preOffset = Platform.OS === 'ios' ? 0 : 500,
        } = this.props;
        const { height, width } = this.containerSize;
        const shareCount = getShareCount(this.containerSizeMain + preOffset * 2, shareMinHeight, this.props.shareCount);

        const { outputs, inputs, sumHeight, shareGroup, itemOffsets = [], itemHeightList } = getPosition({
            containerSizeMain: this.containerSizeMain + preOffset * 2,
            heightForItem,
            countForItem,
            shareMinHeight,
            heightForHeader,
            heightForFooter,
            shareCount,
        });

        this.itemOffsets = itemOffsets;
        const EmptyComponent = typeof ListEmptyComponent === 'function' ? ListEmptyComponent() : ListEmptyComponent;
        let FooterComponent = renderForFooter?.();
        if (FooterComponent && heightForFooter) {
            FooterComponent = React.cloneElement(FooterComponent, {
                style: [
                    styles.footer,
                    sumHeight > this.containerSizeMain
                        ? { [horizontal ? 'right' : 'bottom']: 0 }
                        : { [horizontal ? 'left' : 'top']: sumHeight - heightForFooter },
                    horizontal ? { height, width: heightForFooter } : { width, height: heightForFooter },
                    FooterComponent.props.style,
                ],
            });
        }
        const contentStyle = horizontal
            ? { width: Math.max(sumHeight, width), height }
            : { height: Math.max(sumHeight, height), width };
        return (
            <AnimatedScrollView
                {...this.props}
                onLayout={this.onLayout}
                onScroll={this.onScrollEvent}
                scrollEventThrottle={1}
                ref={this.ref}
                contentContainerStyle={contentStyle}
            >
                {countForItem < 1 && EmptyComponent}
                {renderForHeader?.()}
                <ShareManager
                    shareGroup={shareGroup}
                    inputs={inputs}
                    ref={this.shareManagerRef}
                    outputs={outputs}
                    renderForItem={renderForItem}
                    itemHeightList={itemHeightList}
                    offset={this.offset}
                    debug={debug}
                    horizontal={horizontal}
                    itemOffsets={this.itemOffsets}
                    containerSize={this.containerSize}
                    containerSizeMain={this.containerSizeMain}
                    preOffset={preOffset}
                />
                {FooterComponent}
            </AnimatedScrollView>
        );
    }
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
    },
});
