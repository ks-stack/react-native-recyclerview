import React from 'react';
import { View } from 'react-native';

export type RenderForItem = (index: number, size: { height: number; width: number }) => React.ReactElement;

interface Props {
    output: number[];
    input: number[];
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

    private noRepeatOutput: number[] = [];

    constructor(props: Props) {
        super(props);
        this.noRepeatOutput = [...new Set(props.output)];
    }

    UNSAFE_componentWillReceiveProps(next: Props) {
        if (next.output !== this.props.output) {
            this.noRepeatOutput = [...new Set(next.output)];
        }
    }

    // 目前仅做安卓更新用
    onContentOffsetChange = (offset: number) => {
        const index = this.noRepeatOutput.findIndex((v) => v > offset - 100);
        if (index !== this.currentIndex) {
            this.currentIndex = index;
            this.forceUpdate();
        }
    };

    // 目前仅做ios更新用
    update = (firstIndex: number, lastIndex: number) => {
        const { indexes } = this.props;
        const index = indexes.findIndex((v) => v >= firstIndex - 0 && v <= lastIndex + 0);
        // const index = indexes.findIndex((v) => v >= firstIndex - 1 && v <= lastIndex + 1);
        if (index !== this.currentIndex) {
            this.currentIndex = index;
            this.forceUpdate();
        }
    };

    render() {
        const { indexes, renderForItem, itemHeightList, debug, horizontal, containerSize, input, output } = this.props;
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
