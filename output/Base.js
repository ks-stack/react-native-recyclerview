import React from 'react';
import { Animated, StyleSheet, ScrollView, } from 'react-native';
import { getItemHeight } from './utils';
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
export default class Base extends React.PureComponent {
    constructor(props) {
        super(props);
        this.contentOffset = 0;
        this.containerSize = { height: 0, width: 0 };
        this.containerSizeMain = 0;
        this.firstItemIndex = -1;
        this.lastItemIndex = -1;
        this.firstOnVisibleItemsChange = true;
        this.ref = React.createRef();
        this.onLoadedOffset = 0;
        this.onEndReached = (contentHeight) => {
            const { onEndReached, onEndReachedThreshold = 1 } = this.props;
            const distanceFromEnd = contentHeight - this.contentOffset - this.containerSizeMain;
            if (this.onLoadedOffset <= this.containerSizeMain ||
                (distanceFromEnd <= onEndReachedThreshold * this.containerSizeMain && contentHeight > this.onLoadedOffset)) {
                this.onLoadedOffset = contentHeight;
                onEndReached === null || onEndReached === void 0 ? void 0 : onEndReached(distanceFromEnd);
            }
        };
        this.onScroll = (e) => {
            const { onEndReached, horizontal, onScroll } = this.props;
            const nextContentOffset = horizontal ? e.nativeEvent.contentOffset.x : e.nativeEvent.contentOffset.y;
            const isForward = nextContentOffset > this.contentOffset;
            this.contentOffset = nextContentOffset;
            this.onContentOffsetChange(isForward);
            onScroll === null || onScroll === void 0 ? void 0 : onScroll(e);
            if (onEndReached) {
                this.onEndReached(horizontal ? e.nativeEvent.contentSize.width : e.nativeEvent.contentSize.height);
            }
        };
        this.onLayout = (e) => {
            const { onLayout, horizontal } = this.props;
            const { height, width } = e.nativeEvent.layout;
            if (this.containerSize.height !== height || this.containerSize.width !== width) {
                this.containerSize = { height, width };
                this.containerSizeMain = horizontal ? width : height;
                this.forceUpdate();
            }
            onLayout === null || onLayout === void 0 ? void 0 : onLayout(e);
        };
        this.scrollTo = (option) => {
            var _a;
            (_a = this.ref.current) === null || _a === void 0 ? void 0 : _a._component.scrollTo(option);
        };
        this.scrollToEnd = (option) => {
            var _a;
            (_a = this.ref.current) === null || _a === void 0 ? void 0 : _a._component.scrollToEnd(option);
        };
        this.flashScrollIndicators = () => {
            var _a;
            (_a = this.ref.current) === null || _a === void 0 ? void 0 : _a._component.flashScrollIndicators();
        };
        const { style, horizontal } = props;
        const { height, width } = StyleSheet.flatten(style);
        this.containerSize = {
            height: typeof height === 'number' ? height : 0,
            width: typeof width === 'number' ? width : 0,
        };
        this.containerSizeMain = horizontal ? this.containerSize.width : this.containerSize.height;
    }
    componentDidUpdate(oldProps) {
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
            this.onEndReached(Array(Math.ceil(countForItem / numColumns))
                .fill('')
                .reduce((sum, v, i) => sum + getItemHeight(heightForItem, i), 0));
        }
        if (horizontal !== oldProps.horizontal) {
            this.onHorizontalChange();
        }
    }
    render() {
        const { countForItem, ListEmptyComponent, horizontal, renderForHeader, heightForFooter, renderForFooter, heightForHeader, } = this.props;
        const { height, width } = this.containerSize;
        const { sumHeight } = this.getPosition();
        const EmptyComponent = typeof ListEmptyComponent === 'function' ? ListEmptyComponent() : ListEmptyComponent;
        let HeaderComponent = renderForHeader === null || renderForHeader === void 0 ? void 0 : renderForHeader();
        if (HeaderComponent && heightForHeader) {
            HeaderComponent = React.cloneElement(HeaderComponent, {
                style: [
                    horizontal ? { height, width: heightForHeader } : { width, height: heightForHeader },
                    HeaderComponent.props.style,
                ],
            });
        }
        let FooterComponent = renderForFooter === null || renderForFooter === void 0 ? void 0 : renderForFooter();
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
        return (React.createElement(AnimatedScrollView, Object.assign({}, this.props, { onLayout: this.onLayout, onScroll: this.onScrollEvent, scrollEventThrottle: 1, ref: this.ref, contentContainerStyle: contentStyle }),
            countForItem < 1 && EmptyComponent,
            HeaderComponent,
            this.renderMain(),
            FooterComponent));
    }
}
