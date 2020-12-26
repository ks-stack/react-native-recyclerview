import React from 'react';
import { Animated, ScrollView, View } from 'react-native';
import { getItemHeight } from './utils';
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
export default class Base extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.contentOffset = 0;
        this.contentSize = { height: 0, width: 0 };
        this.containerSize = 0;
        this.firstItemIndex = -1;
        this.lastItemIndex = -1;
        this.firstOnVisibleItemsChange = true;
        this.ref = React.createRef();
        this.onLoadedOffset = 0;
        this.onEndReached = (contentHeight) => {
            const { onEndReached, onEndReachedThreshold = 1 } = this.props;
            const distanceFromEnd = contentHeight - this.contentOffset - this.containerSize;
            if (this.onLoadedOffset <= this.containerSize ||
                (distanceFromEnd <= onEndReachedThreshold * this.containerSize && contentHeight > this.onLoadedOffset)) {
                this.onLoadedOffset = contentHeight;
                onEndReached?.(distanceFromEnd);
            }
        };
        this.onScroll = (e) => {
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
        this.onLayout = (e) => {
            const { onLayout, horizontal } = this.props;
            const { height, width } = e.nativeEvent.layout;
            if (horizontal) {
                if (this.containerSize !== width) {
                    this.containerSize = width;
                    this.forceUpdate();
                }
            }
            else if (this.containerSize !== height) {
                this.containerSize = height;
                this.forceUpdate();
            }
            onLayout?.(e);
        };
        this.onViewLayout = (e) => {
            const { height, width } = e.nativeEvent.layout;
            if (this.contentSize.height !== height || this.contentSize.width !== width) {
                this.contentSize = { height, width };
                this.forceUpdate();
            }
        };
        this.scrollTo = (option) => {
            this.ref.current?.scrollTo(option);
        };
        this.scrollToEnd = (option) => {
            this.ref.current?.scrollToEnd(option);
        };
        this.flashScrollIndicators = () => {
            this.ref.current?.flashScrollIndicators();
        };
    }
    componentDidUpdate(oldProps) {
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
            this.onEndReached(Array(Math.ceil(countForItem / numColumns))
                .fill('')
                .reduce((sum, v, i) => sum + getItemHeight(heightForItem, i), 0));
        }
        if (horizontal !== oldProps.horizontal) {
            this.onHorizontalChange();
        }
    }
    render() {
        const { horizontal, renderForHeader, heightForFooter, renderForFooter, heightForHeader, } = this.props;
        const { height, width } = this.contentSize;
        const sumHeight = this.getSumHeight();
        let HeaderComponent = renderForHeader?.();
        if (HeaderComponent && heightForHeader) {
            HeaderComponent = React.cloneElement(HeaderComponent, {
                style: [
                    { position: 'absolute' },
                    horizontal ? { height, width: heightForHeader } : { width, height: heightForHeader },
                    HeaderComponent.props.style,
                ],
            });
        }
        let FooterComponent = renderForFooter?.();
        if (FooterComponent && heightForFooter) {
            FooterComponent = React.cloneElement(FooterComponent, {
                style: [
                    { position: 'absolute' },
                    sumHeight > this.containerSize
                        ? { [horizontal ? 'right' : 'bottom']: 0 }
                        : { [horizontal ? 'left' : 'top']: sumHeight - heightForFooter },
                    horizontal ? { height, width: heightForFooter } : { width, height: heightForFooter },
                    FooterComponent.props.style,
                ],
            });
        }
        return (React.createElement(AnimatedScrollView, Object.assign({}, this.props, { onLayout: this.onLayout, onScroll: this.onScrollEvent, scrollEventThrottle: 1, ref: this.ref }),
            React.createElement(View, { onLayout: this.onViewLayout, style: {
                    [horizontal ? 'height' : 'width']: '100%',
                    [horizontal ? 'width' : 'height']: sumHeight,
                } },
                HeaderComponent,
                this.renderMain(),
                FooterComponent)));
    }
}
