import { ScrollViewProps, ViewStyle } from 'react-native';

export type RenderForItem = (index: number) => React.ReactElement;

export interface ListViewProps extends ScrollViewProps {
    countForItem: number;
    numColumns?: number;

    renderForItem: RenderForItem;
    renderForHeader?: () => React.ReactElement | null;
    renderForFooter?: () => React.ReactElement | null;

    /**
     * heightForItem为number时生效
     */
    shareStyle?: ViewStyle;

    heightForItem: ((index: number) => number) | number;
    heightForHeader?: number;
    heightForFooter?: number;

    preOffset?: number;

    onEndReachedThreshold?: number;
    onEndReached?: (distanceFromEnd: number) => void;

    onVisibleItemsChange?: (firstItemIndex: number, lastItemIndex: number) => void;
}
