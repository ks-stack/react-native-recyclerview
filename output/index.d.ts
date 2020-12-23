import React from 'react';
import { ListViewProps } from './type';
export * from './type';
export default class ListView extends React.PureComponent<ListViewProps> {
    private ref;
    scrollTo: (option?: {
        x?: number | undefined;
        y?: number | undefined;
        animated?: boolean | undefined;
        duration?: number | undefined;
    } | undefined) => void;
    scrollToEnd: (option?: {
        animated?: boolean | undefined;
        duration?: number | undefined;
    } | undefined) => void;
    flashScrollIndicators: () => void;
    render(): JSX.Element;
}
