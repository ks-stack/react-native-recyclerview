/// <reference types="react" />
import { ScrollViewProps } from 'react-native';
export declare type ItemStyle = {
    position?: 'absolute';
    height: number;
    width: number;
    top?: number;
    left?: number;
};
export declare type RenderForItem = (index: number, style: ItemStyle) => React.ReactElement;
export interface ListViewProps extends ScrollViewProps {
    countForItem: number;
    numColumns?: number;
    renderForItem: RenderForItem;
    renderForHeader?: () => React.ReactElement | null;
    renderForFooter?: () => React.ReactElement | null;
    ListEmptyComponent?: () => React.ReactElement | React.ReactElement | null;
    heightForItem: ((index: number) => number) | number;
    heightForHeader?: number;
    heightForFooter?: number;
    preOffset?: number;
    onEndReachedThreshold?: number;
    onEndReached?: (distanceFromEnd: number) => void;
    onVisibleItemsChange?: (firstItemIndex: number, lastItemIndex: number) => void;
}
