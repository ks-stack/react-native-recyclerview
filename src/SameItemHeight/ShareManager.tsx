import React from 'react';
import { Animated, ViewStyle } from 'react-native';
import Share from './Share';
import { RenderForItem } from '../type';

interface Props {
    shareGroup: number[][];
    inputs: number[][];
    outputs: number[][];
    renderForItem: RenderForItem;
    offset: Animated.Value;
    horizontal?: boolean | null;
    containerSize: number;
    heightForItem: number;
    preOffset: number;
    numColumns: number;
    countForItem: number;
    heightForHeader: number;
    shareStyle?: ViewStyle;
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

    update = (contentOffset: number, isForward?: boolean) => {
        this.shareRefs.forEach((v) => v.current?.update(contentOffset, isForward));
    };

    render() {
        const {
            shareGroup,
            inputs,
            outputs,
            renderForItem,
            offset,
            horizontal,
            containerSize,
            heightForItem,
            preOffset,
            numColumns,
            countForItem,
            shareStyle,
            heightForHeader,
        } = this.props;
        return shareGroup.map((indexes, index) => {
            let transform: any;
            if (inputs[index].length > 1) {
                transform = [
                    {
                        [horizontal ? 'translateX' : 'translateY']: offset.interpolate({
                            inputRange: inputs[index],
                            outputRange: outputs[index].map((v) => v - heightForHeader),
                        }),
                    },
                ];
            }
            if (!transform) {
                // eslint-disable-next-line no-console
                console.warn('@ks-stack/react-native-recyclerview组件的ShareManager类中transform转换有问题');
            }
            return (
                <Animated.View
                    key={index}
                    style={[
                        {
                            transform,
                            position: 'absolute',
                            [horizontal ? 'left' : 'top']: heightForHeader,
                            flexDirection: horizontal ? undefined : 'row',
                        },
                        shareStyle,
                    ]}
                >
                    <Share
                        indexes={indexes}
                        numColumns={numColumns}
                        renderForItem={renderForItem}
                        ref={this.shareRefs[index]}
                        horizontal={horizontal}
                        containerSize={containerSize}
                        heightForItem={heightForItem}
                        preOffset={preOffset}
                        input={inputs[index]}
                        output={outputs[index]}
                        countForItem={countForItem}
                    />
                </Animated.View>
            );
        });
    }
}
