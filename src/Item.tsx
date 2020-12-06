import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import Share, { RenderForItem } from './Share';

export type ShareRefs = React.RefObject<Share>[];
export * from './Share';

interface Props {
    shareGroup: number[][];
    inputs: number[][];
    outputs: number[][];
    renderForItem: RenderForItem;
    itemHeightList: number[];
    offset: Animated.Value;
    itemOffsets: number[];
    debug?: boolean;
    horizontal?: boolean;
    preShareCount?: number;
    containerSize: {
        height: number;
        width: number;
    };
}

export default class ShareManager extends React.PureComponent<Props> {
    shareRefs: React.RefObject<Share>[] = [];

    constructor(props: Props) {
        super(props);
        const { shareGroup } = this.props;
        this.shareRefs = shareGroup.map(() => React.createRef<Share>());
    }

    UNSAFE_componentWillReceiveProps(next: Props) {
        if (next.shareGroup.length !== this.props.shareGroup.length) {
            this.shareRefs = next.shareGroup.map(() => React.createRef<Share>());
        }
    }

    update = (firstIndex: number, lastIndex: number) => {
        this.shareRefs.forEach((v) => v.current?.update(firstIndex, lastIndex));
    };

    render() {
        const {
            shareGroup,
            inputs,
            outputs,
            itemHeightList,
            renderForItem,
            offset,
            debug,
            horizontal,
            containerSize,
        } = this.props;
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
            return (
                <Animated.View key={index} style={[{ transform }, horizontal ? styles.horizontalAbs : styles.abs]}>
                    <Share
                        indexes={indexes}
                        output={outputs[index]}
                        renderForItem={renderForItem}
                        itemHeightList={itemHeightList}
                        debug={debug}
                        ref={this.shareRefs[index]}
                        horizontal={horizontal}
                        containerSize={containerSize}
                    />
                </Animated.View>
            );
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
