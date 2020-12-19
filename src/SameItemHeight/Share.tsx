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
        const { renderForItem, horizontal, heightForItem, containerSize, indexes } = this.props;
        const index = indexes[this.currentIndex];
        if (index < 0) {
            return null;
        }
        const style = horizontal
            ? { width: heightForItem, height: containerSize.height }
            : { height: heightForItem, width: containerSize.width };

        const cell = renderForItem(index, style);
        return cell;
    }
}
