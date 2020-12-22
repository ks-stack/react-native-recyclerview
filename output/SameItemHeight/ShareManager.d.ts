import React from 'react';
import { Animated } from 'react-native';
import Share from './Share';
import { RenderForItem } from '../type';
interface Props {
    shareGroup: number[][];
    inputs: number[][];
    outputs: number[][];
    renderForItem: RenderForItem;
    offset: Animated.Value;
    horizontal?: boolean | null;
    containerSize: {
        height: number;
        width: number;
    };
    containerSizeMain: number;
    heightForItem: number;
    preOffset: number;
    numColumns: number;
    countForItem: number;
}
export default class ShareManager extends React.PureComponent<Props> {
    shareRefs: React.RefObject<Share>[];
    constructor(props: Props);
    UNSAFE_componentWillReceiveProps(next: Props): void;
    update: (contentOffset: number, isForward?: boolean | undefined) => void;
    render(): JSX.Element[];
}
export {};
