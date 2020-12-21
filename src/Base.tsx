import React from 'react';
import {
    Animated,
    StyleSheet,
    LayoutChangeEvent,
    ScrollView,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';
import { getItemHeight } from './utils';
import { ListViewProps } from './type';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export interface BaseProps extends ListViewProps {
    preOffset: number;
    numColumns: number;
}

export default abstract class Base extends React.PureComponent<BaseProps> {
    abstract onHorizontalChange: () => void;

    abstract renderMain: () => void;

    abstract getPosition: () => {
        sumHeight: number;
        inputs?: number[][];
        outputs?: number[][];
        shareGroup?: number[][];
    };

    abstract onContentOffsetChange: (isForward: boolean) => void;

    public onScrollEvent: any;

    public contentOffset: number = 0;

    public containerSize = { height: 0, width: 0 };

    public containerSizeMain = 0;

    public firstItemIndex: number = -1;

    public lastItemIndex: number = -1;

    public firstOnVisibleItemsChange = true;

    private ref = React.createRef<any>();

    private onLoadedOffset: number = 0;

    constructor(props: BaseProps) {
        super(props);
        const { style, horizontal } = props;
        const { height, width } = StyleSheet.flatten(style);
        this.containerSize = {
            height: typeof height === 'number' ? height : 0,
            width: typeof width === 'number' ? width : 0,
        };
        this.containerSizeMain = horizontal ? this.containerSize.width : this.containerSize.height;
    }

    componentDidUpdate(oldProps: BaseProps) {
        const { countForItem, horizontal, onEndReached, heightForItem, numColumns = 1 } = this.props;
        if (!this.containerSizeMain) {
            return;
        }
        if (countForItem < oldProps.countForItem) {
            this.onLoadedOffset = 0;
            this.firstOnVisibleItemsChange = true;
        }
        if (countForItem > 0 && this.firstOnVisibleItemsChange) {
            this.onContentOffsetChange(false);
        }
        if (onEndReached && countForItem > 0 && this.onLoadedOffset <= this.containerSizeMain) {
            this.onEndReached(
                Array(Math.ceil(countForItem / numColumns))
                    .fill('')
                    .reduce((sum, v, i) => sum + getItemHeight(heightForItem, i), 0),
            );
        }
        if (horizontal !== oldProps.horizontal) {
            this.onHorizontalChange();
        }
    }

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

    public onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
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
            ListEmptyComponent,
            horizontal,
            renderForHeader,
            heightForFooter,
            renderForFooter,
            heightForHeader,
        } = this.props;
        const { height, width } = this.containerSize;

        const { sumHeight } = this.getPosition();

        const EmptyComponent = typeof ListEmptyComponent === 'function' ? ListEmptyComponent() : ListEmptyComponent;

        // header
        let HeaderComponent = renderForHeader?.();
        if (HeaderComponent && heightForHeader) {
            HeaderComponent = React.cloneElement(HeaderComponent, {
                style: [
                    horizontal ? { height, width: heightForHeader } : { width, height: heightForHeader },
                    HeaderComponent.props.style,
                ],
            });
        }

        // footer
        let FooterComponent = renderForFooter?.();
        if (FooterComponent && heightForFooter) {
            FooterComponent = React.cloneElement(FooterComponent, {
                style: [
                    { position: 'absolute' },
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
                {HeaderComponent}
                {this.renderMain()}
                {FooterComponent}
            </AnimatedScrollView>
        );
    }
}
