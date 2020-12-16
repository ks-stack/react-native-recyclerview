import React from 'react';
import { View } from 'react-native';

export type RenderForItem = (index: number, size: { height: number; width: number }) => React.ReactElement;

interface Props {
    input: number[];
    output: number[];
    indexes: number[][];
    renderForItem: RenderForItem;
    itemHeightList: number[];
    debug?: boolean;
    horizontal?: boolean | null;
    containerSize: {
        height: number;
        width: number;
    };
    containerSizeMain: number;
    preOffset: number;
}

export default class Share extends React.Component<Props> {
    private currentIndex = -1;

    private noRepeatOutput!: number[];

    constructor(props: Props) {
        super(props);
        this.noRepeatOutput = [...new Set(props.output)];
    }

    UNSAFE_componentWillReceiveProps(next: Props) {
        if (next.output !== this.props.output) {
            this.noRepeatOutput = [...new Set(next.output)];
        }
    }

    update = (contentOffset: number, isForward?: boolean) => {
        const { input, output, preOffset } = this.props;
        if (isForward) {
            for (let i = 0; i < input.length; i++) {
                if (contentOffset + 0 >= input[i] && contentOffset <= input[i + 1]) {
                    const index = this.noRepeatOutput.indexOf(output[i]);
                    if (this.currentIndex !== index) {
                        this.currentIndex = index;
                        this.forceUpdate();
                    }
                    break;
                }
            }
        } else {
            for (let i = 0; i < input.length; i++) {
                if (contentOffset + 0 >= input[i] && contentOffset <= input[i + 1] + preOffset) {
                    const index = this.noRepeatOutput.indexOf(output[i]);
                    if (this.currentIndex !== index) {
                        this.currentIndex = index;
                        this.forceUpdate();
                    }
                    break;
                }
            }
        }
    };

    render() {
        const { indexes, renderForItem, itemHeightList, debug, horizontal, containerSize } = this.props;
        if (indexes[this.currentIndex] === undefined) {
            return null;
        }
        const { height, width } = containerSize;
        return indexes[this.currentIndex].map((index, i) => {
            const size = horizontal
                ? { width: itemHeightList[index], height }
                : { height: itemHeightList[index], width };
            const cell = renderForItem(index, size);
            const dom = React.cloneElement(cell, { key: cell.props.key || i });
            if (debug) {
                const debugStyle = horizontal
                    ? { width: itemHeightList[index] - 1, marginRight: 1 }
                    : { height: itemHeightList[index] - 1, marginBottom: 1 };
                return <View style={{ backgroundColor: '#aaa8', overflow: 'hidden', ...debugStyle }}>{dom}</View>;
            }
            return dom;
        });
    }
}
