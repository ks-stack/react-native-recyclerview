import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import Share from './Share';
export default class ShareManager extends React.PureComponent {
    constructor(props) {
        super(props);
        this.shareRefs = [];
        this.update = (contentOffset, isForward) => {
            this.shareRefs.forEach((v) => v.current?.update(contentOffset, isForward));
        };
        const { shareGroup } = this.props;
        this.shareRefs = shareGroup.map(() => React.createRef());
    }
    UNSAFE_componentWillReceiveProps(next) {
        if (next.shareGroup.length !== this.props.shareGroup.length) {
            this.shareRefs = next.shareGroup.map(() => React.createRef());
        }
    }
    render() {
        const { shareGroup, inputs, outputs, renderForItem, offset, horizontal, containerSize, containerSizeMain, heightForItem, preOffset, numColumns, countForItem, } = this.props;
        return shareGroup.map((indexes, index) => {
            let transform;
            if (inputs[index].length > 1) {
                transform = [
                    {
                        [horizontal ? 'translateX' : 'translateY']: offset.interpolate({
                            inputRange: inputs[index],
                            outputRange: outputs[index],
                        }),
                    },
                ];
            }
            return (React.createElement(Animated.View, { key: index, style: [{ transform }, horizontal ? styles.horizontalAbs : styles.abs] },
                React.createElement(Share, { indexes: indexes, numColumns: numColumns, renderForItem: renderForItem, ref: this.shareRefs[index], horizontal: horizontal, containerSize: containerSize, containerSizeMain: containerSizeMain, heightForItem: heightForItem, preOffset: preOffset, input: inputs[index], output: outputs[index], countForItem: countForItem })));
        });
    }
}
const styles = StyleSheet.create({
    abs: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
    },
    horizontalAbs: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
    },
});
