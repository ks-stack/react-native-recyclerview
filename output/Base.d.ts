import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ListViewProps } from './type';
export interface BaseProps extends ListViewProps {
    preOffset: number;
    numColumns: number;
    horizontal: boolean;
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
    onScrollEvent: any;
    contentOffset: number;
    containerSize: {
        height: number;
        width: number;
    };
    containerSizeMain: number;
    firstItemIndex: number;
    lastItemIndex: number;
    firstOnVisibleItemsChange: boolean;
    private ref;
    private onLoadedOffset;
    constructor(props: BaseProps);
    componentDidUpdate(oldProps: BaseProps): void;
    private onEndReached;
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
    private onLayout;
    scrollTo: (option?: {
        x?: number | undefined;
        y?: number | undefined;
        animated?: boolean | undefined;
        duration?: number | undefined;
    } | undefined) => void;
    scrollToEnd: (option?: {
        animated?: boolean | undefined;
        duration?: number | undefined;
    } | undefined) => void;
    flashScrollIndicators: () => void;
    render(): JSX.Element;
}
