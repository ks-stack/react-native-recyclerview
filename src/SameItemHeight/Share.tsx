import React from 'react';
import { RenderForItem } from '../type';

interface Props {
    indexes: number[];
    renderForItem: RenderForItem;
    horizontal?: boolean | null;
    containerSize: { height: number; width: number };
    containerSizeMain: number;
    heightForItem: number;
}

export default class Share extends React.Component<Props> {
    private currentIndex = -1;

    update = (contentOffset: number, isForward?: boolean) => {
        const { indexes, heightForItem, containerSizeMain } = this.props;
        let index = -1;
        if (isForward) {
            index = indexes.findIndex((v) => (v + 1) * heightForItem >= contentOffset);
        } else {
            index = indexes.findIndex((v) => {
                return v >= (contentOffset + containerSizeMain) / heightForItem;
            });
            index -= 1;
        }

        if (index > -1 && index !== this.currentIndex) {
            this.currentIndex = index;
            this.forceUpdate();
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
