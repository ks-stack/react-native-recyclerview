import React from 'react';
import { Platform } from 'react-native';
import DiffItemHeight from './DiffItemHeight';
import SameItemHeight from './SameItemHeight';
export default class ListView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.ref = React.createRef();
        this.scrollTo = (option) => {
            this.ref.current?.scrollTo(option);
        };
        this.scrollToEnd = (option) => {
            this.ref.current?.scrollToEnd(option);
        };
        this.flashScrollIndicators = () => {
            this.ref.current?.flashScrollIndicators();
        };
    }
    render() {
        const { preOffset = Platform.OS === 'ios' ? 200 : 800, numColumns = 1, horizontal, heightForItem } = this.props;
        const C = typeof heightForItem === 'number' ? SameItemHeight : DiffItemHeight;
        return (React.createElement(C, Object.assign({}, this.props, { ref: this.ref, preOffset: preOffset, numColumns: numColumns, horizontal: horizontal || false })));
    }
}
