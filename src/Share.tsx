import React from 'react';
import { View, Platform } from 'react-native';

export type RenderForItem = (index: number, size: { height: number; width: number }) => React.ReactElement;

interface Props {
    output: number[];
    indexes: number[];
    renderForItem: RenderForItem;
    itemHeightList: number[];
    debug?: boolean;
    horizontal?: boolean;
    containerSize: {
        height: number;
        width: number;
    };
}

export default class Share extends React.Component<Props> {
    private currentIndex = -1;

    update = (firstIndex: number, lastIndex: number) => {
        const { indexes } = this.props;
        // 安卓需要预渲染下一个item
        const index =
            Platform.OS === 'ios'
                ? indexes.findIndex((v) => v >= firstIndex - 0 && v <= lastIndex + 0)
                : indexes.findIndex((v) => v >= firstIndex - 1 && v <= lastIndex + 1);
        if (index !== this.currentIndex) {
            this.currentIndex = index;
            this.forceUpdate();
        }
    };

    render() {
        const { indexes, renderForItem, itemHeightList, debug, horizontal, containerSize } = this.props;
        if (indexes[this.currentIndex] === undefined) {
            return null;
        }
        const { height, width } = containerSize;
        const index = indexes[this.currentIndex];
        const size = horizontal ? { width: itemHeightList[index], height } : { height: itemHeightList[index], width };
        const cell = renderForItem(index, size);
        if (debug) {
            const debugStyle = horizontal
                ? { width: itemHeightList[index] - 1, marginRight: 1 }
                : { height: itemHeightList[index] - 1, marginBottom: 1 };
            return <View style={{ backgroundColor: '#aaa8', overflow: 'hidden', ...debugStyle }}>{cell}</View>;
        }
        return cell;
    }
}
