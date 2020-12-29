import React from 'react';
import { RenderForItem } from '../type';

interface Props {
    indexes: number[];
    renderForItem: RenderForItem;
    horizontal?: boolean | null;
    containerSize: number;
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
                    if (index !== this.currentIndex) {
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
                    if (index !== this.currentIndex) {
                        this.currentIndex = index;
                        this.forceUpdate();
                    }
                    break;
                }
            }
        }
    };

    render() {
        const { renderForItem, indexes, numColumns, countForItem } = this.props;
        const index = indexes[this.currentIndex];
        if (index < 0 || index === undefined) {
            return null;
        }
        if (numColumns === 1) {
            const cell = renderForItem(index);
            return cell;
        }
        return (
            <>
                {Array(numColumns)
                    .fill('')
                    .map((v, i) => {
                        const key = index * numColumns + i;
                        if (key < countForItem) {
                            return React.cloneElement(renderForItem(key), { key: i });
                        }
                        return null;
                    })}
            </>
        );
    }
}
