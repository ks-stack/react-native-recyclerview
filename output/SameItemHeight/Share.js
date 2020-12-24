import React from 'react';
export default class Share extends React.Component {
    constructor(props) {
        super(props);
        this.currentIndex = -1;
        this.update = (contentOffset, isForward) => {
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
            }
            else {
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
        this.noRepeatOutput = [...new Set(props.output)];
    }
    UNSAFE_componentWillReceiveProps(next) {
        if (next.output !== this.props.output) {
            this.noRepeatOutput = [...new Set(next.output)];
        }
    }
    render() {
        const { renderForItem, horizontal, heightForItem, contentSize, indexes, numColumns, countForItem } = this.props;
        const index = indexes[this.currentIndex];
        if (index < 0 || index === undefined) {
            return null;
        }
        if (numColumns === 1) {
            const style = horizontal
                ? { width: heightForItem, height: contentSize.height }
                : { height: heightForItem, width: contentSize.width };
            const cell = renderForItem(index, style);
            return cell;
        }
        const sizeOne = (horizontal ? contentSize.height : contentSize.width) / numColumns;
        const style = horizontal
            ? { width: heightForItem, height: sizeOne }
            : { height: heightForItem, width: sizeOne };
        return (React.createElement(React.Fragment, null, Array(numColumns)
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
        })));
    }
}
