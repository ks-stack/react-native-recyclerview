/* eslint-disable no-nested-ternary */
import React from 'react';
import { Platform } from 'react-native';
import { ListViewProps } from './type';
import DiffItemHeight from './DiffItemHeight';
import SameItemHeight from './SameItemHeight';

export * from './type';

export default (props: ListViewProps) => {
    const preOffset = props.preOffset !== undefined ? props.preOffset : Platform.OS === 'ios' ? 100 : 800;
    const numColumns = props.numColumns === undefined ? 1 : props.numColumns;
    if (typeof props.heightForItem === 'number') {
        return <SameItemHeight {...props} preOffset={preOffset} numColumns={numColumns} />;
    }
    return <DiffItemHeight {...props} preOffset={preOffset} numColumns={numColumns} />;
};
