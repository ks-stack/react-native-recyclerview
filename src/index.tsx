/* eslint-disable no-nested-ternary */
import React from 'react';
import { Platform } from 'react-native';
import { ListViewProps } from './type';
import DiffItemHeight from './DiffItemHeight';
import SameItemHeight from './SameItemHeight';

export * from './type';

export default (props: ListViewProps) => {
    if (typeof props.heightForItem === 'number') {
        const preOffset = props.preOffset !== undefined ? props.preOffset : Platform.OS === 'ios' ? 100 : 200;
        return <SameItemHeight {...props} preOffset={preOffset} />;
    }
    const preOffset = props.preOffset !== undefined ? props.preOffset : Platform.OS === 'ios' ? 100 : 500;
    return <DiffItemHeight {...props} preOffset={preOffset} />;
};
