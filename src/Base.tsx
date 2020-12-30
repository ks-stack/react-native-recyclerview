import React from 'react';
import { Animated, LayoutChangeEvent, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { getItemHeight } from './utils';
import { ListViewProps } from './type';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export interface BaseProps extends ListViewProps {
    preOffset: number;
    numColumns: number;
    horizontal: boolean;
    heightForHeader: number;
}

export default abstract class Base extends React.PureComponent<BaseProps> {
    abstract onHorizontalChange: () => void;

    abstract renderMain: () => void;

    abstract getSumHeight: () => number;

    abstract onContentOffsetChange: (isForward: boolean) => void;

    public offset: Animated.Value = new Animated.Value(0);

    public onScrollEvent: any;

    public contentOffset: number = 0;

    public contentSize = 0;

    public containerSize = 0;

    public firstItemIndex: number = -1;

    public lastItemIndex: number = -1;

    public firstOnVisibleItemsChange = true;

    private ref = React.createRef<any>();

    private onLoadedOffset: number = 0;

    componentDidUpdate(oldProps: BaseProps) {
        const { countForItem, horizontal, onEndReached, heightForItem, numColumns = 1 } = this.props;
        if (!this.containerSize) {
            return;
        }
        if (countForItem < oldProps.countForItem) {
            this.onLoadedOffset = 0;
            this.firstOnVisibleItemsChange = true;
        }
        if (countForItem > 0 && this.firstOnVisibleItemsChange) {
            this.onContentOffsetChange(false);
        }
        if (onEndReached && countForItem > 0 && this.onLoadedOffset <= this.containerSize) {
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
        const distanceFromEnd = contentHeight - this.contentOffset - this.containerSize;
        if (
            this.onLoadedOffset <= this.containerSize ||
            (distanceFromEnd <= onEndReachedThreshold * this.containerSize && contentHeight > this.onLoadedOffset)
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

    private onContentSizeChange = (width: number, height: number) => {
        const { onContentSizeChange, horizontal } = this.props;
        if (this.contentOffset > 0 && (horizontal ? width : height) < this.contentOffset + this.containerSize) {
            this.contentOffset = Math.max(0, this.contentSize - this.containerSize);
            this.offset.setValue(this.contentOffset);
            this.onContentOffsetChange(true);
            this.scrollToEnd({ animated: false });
            onContentSizeChange?.(width, height);
        }
    };

    private onLayout = (e: LayoutChangeEvent) => {
        const { onLayout, horizontal } = this.props;
        const { height, width } = e.nativeEvent.layout;
        if (horizontal) {
            if (this.containerSize !== width) {
                this.containerSize = width;
                this.forceUpdate();
            }
        } else if (this.containerSize !== height) {
            this.containerSize = height;
            this.forceUpdate();
        }
        onLayout?.(e);
    };

    scrollTo = (option: { x?: number; y?: number; animated?: boolean; duration?: number }) => {
        this.ref.current?.scrollTo(option);
    };

    scrollToEnd = (option?: { animated?: boolean; duration?: number }) => {
        this.ref.current?.scrollToEnd(option);
    };

    flashScrollIndicators = () => {
        this.ref.current?.flashScrollIndicators();
    };

    render() {
        const {
            horizontal,
            renderForHeader,
            heightForFooter,
            renderForFooter,
            heightForHeader,
            contentContainerStyle,
        } = this.props;

        this.contentSize = this.getSumHeight();

        // header
        let HeaderComponent = renderForHeader?.();
        if (HeaderComponent && heightForHeader) {
            HeaderComponent = React.cloneElement(HeaderComponent, {
                style: [
                    { position: 'absolute' },
                    horizontal
                        ? { width: heightForHeader, height: '100%' }
                        : { height: heightForHeader, width: '100%' },
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
                    this.contentSize > this.containerSize
                        ? { [horizontal ? 'right' : 'bottom']: 0 }
                        : { [horizontal ? 'left' : 'top']: this.contentSize - heightForFooter },
                    horizontal
                        ? { width: heightForFooter, height: '100%' }
                        : { height: heightForFooter, width: '100%' },
                    FooterComponent.props.style,
                ],
            });
        }

        return (
            <AnimatedScrollView
                {...this.props}
                onLayout={this.onLayout}
                onScroll={this.onScrollEvent}
                scrollEventThrottle={1}
                ref={this.ref}
                onContentSizeChange={this.onContentSizeChange}
                contentContainerStyle={[
                    {
                        [horizontal ? 'height' : 'width']: '100%',
                        [horizontal ? 'width' : 'height']: Math.max(this.contentSize, this.containerSize),
                    },
                    contentContainerStyle,
                ]}
            >
                {this.renderMain()}
                {HeaderComponent}
                {FooterComponent}
            </AnimatedScrollView>
        );
    }
}
