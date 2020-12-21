import React from 'react';
import { RenderForItem } from '../type';

interface Props {
    indexes: number[];
    renderForItem: RenderForItem;
    horizontal?: boolean | null;
    containerSize: { height: number; width: number };
    containerSizeMain: number;
    heightForItem: number;
    preOffset: number;
    output: number[];
    input: number[];
    numColumns: number;
    countForItem: number;
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
            const offset = preOffset + contentOffset;
            for (let i = 0; i < input.length; i++) {
                if (offset >= input[i] && offset <= input[i + 1]) {
                    const index = this.noRepeatOutput.indexOf(output[i]);
                    if (index > -1 && index !== this.currentIndex) {
                        this.currentIndex = index;
                        this.forceUpdate();
                    }
                    break;
                }
            }
        } else {
            for (let i = 0; i < input.length; i++) {
                if (contentOffset >= input[i] && contentOffset <= input[i + 1]) {
                    const index = this.noRepeatOutput.indexOf(output[i]);
                    if (index > -1 && index !== this.currentIndex) {
                        this.currentIndex = index;
                        this.forceUpdate();
                    }
                    break;
                }
            }
        }
    };

    render() {
        const {
            renderForItem,
            horizontal,
            heightForItem,
            containerSize,
            indexes,
            numColumns,
            countForItem,
        } = this.props;
        const index = indexes[this.currentIndex];
        if (index < 0 || index === undefined) {
            return null;
        }
        if (numColumns === 1) {
            const style = horizontal
                ? { width: heightForItem, height: containerSize.height }
                : { height: heightForItem, width: containerSize.width };

            const cell = renderForItem(index, style);
            return cell;
        }
        const sizeOne = (horizontal ? containerSize.height : containerSize.width) / numColumns;
        const style = horizontal
            ? { width: heightForItem, height: sizeOne }
            : { height: heightForItem, width: sizeOne };
        return (
            <>
                {Array(numColumns)
                    .fill('')
                    .map((v, i) => {
                        const key = index * numColumns + i;
                        if (key < countForItem) {
                            const cell = renderForItem(key, {
                                ...style,
                                [horizontal ? 'top' : 'left']: sizeOne * i,
                                position: 'absolute',
                            });
                            const dom = React.cloneElement(cell, { key });
                            return dom;
                        }
                        return null;
                    })}
            </>
        );
    }
}
