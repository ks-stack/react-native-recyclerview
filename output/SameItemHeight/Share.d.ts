import React from 'react';
import { RenderForItem } from '../type';
interface Props {
    indexes: number[];
    renderForItem: RenderForItem;
    horizontal?: boolean | null;
    containerSize: {
        height: number;
        width: number;
    };
    containerSizeMain: number;
    heightForItem: number;
    preOffset: number;
    output: number[];
    input: number[];
    numColumns: number;
    countForItem: number;
}
export default class Share extends React.Component<Props> {
    private currentIndex;
    private noRepeatOutput;
    constructor(props: Props);
    UNSAFE_componentWillReceiveProps(next: Props): void;
    update: (contentOffset: number, isForward?: boolean | undefined) => void;
    render(): JSX.Element | null;
}
export {};
