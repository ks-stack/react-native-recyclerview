/* eslint-disable no-nested-ternary */
import React from 'react';
import { Platform } from 'react-native';
import { ListViewProps } from './type.d';
import DiffItemHeight from './DiffItemHeight';
import SameItemHeight from './SameItemHeight';

export * from './type.d';

export default class ListView extends React.PureComponent<ListViewProps> {
    private ref = React.createRef<SameItemHeight | DiffItemHeight>();

    scrollTo = (option?: { x?: number; y?: number; animated?: boolean; duration?: number }) => {
        this.ref.current?.scrollTo(option);
    };

    scrollToEnd = (option?: { animated?: boolean; duration?: number }) => {
        this.ref.current?.scrollToEnd(option);
    };

    flashScrollIndicators = () => {
        this.ref.current?.flashScrollIndicators();
    };

    render() {
        const { preOffset = Platform.OS === 'ios' ? 200 : 800, numColumns = 1, horizontal, heightForItem } = this.props;
        const C = typeof heightForItem === 'number' ? SameItemHeight : DiffItemHeight;
        return (
            <C
                {...this.props}
                ref={this.ref}
                preOffset={preOffset}
                numColumns={numColumns}
                horizontal={horizontal || false}
            />
        );
    }
}
