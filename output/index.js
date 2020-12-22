import React from 'react';
import { Platform } from 'react-native';
import DiffItemHeight from './DiffItemHeight';
import SameItemHeight from './SameItemHeight';
export * from './type';
export default (props) => {
    const preOffset = props.preOffset !== undefined ? props.preOffset : Platform.OS === 'ios' ? 200 : 800;
    const numColumns = props.numColumns === undefined ? 1 : props.numColumns;
    const horizontal = !!props.horizontal;
    if (typeof props.heightForItem === 'number') {
        return React.createElement(SameItemHeight, Object.assign({}, props, { preOffset: preOffset, numColumns: numColumns, horizontal: horizontal }));
    }
    return React.createElement(DiffItemHeight, Object.assign({}, props, { preOffset: preOffset, numColumns: numColumns, horizontal: horizontal }));
};
