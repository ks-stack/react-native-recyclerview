import React from 'react';
import { RenderForItem } from '../type';
interface Props {
    renderForItem: RenderForItem;
    itemHeightList: number[];
    itemOffsets: {
        top: number;
        left: number;
    }[];
    horizontal?: boolean | null;
    containerSize: {
        height: number;
        width: number;
    };
    containerSizeMain: number;
    preOffset: number;
    numColumns: number;
}
export default class ItemManager extends React.PureComponent<Props> {
    list: number[];
    update: (contentOffset: number, isForward?: boolean | undefined) => void;
    render(): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[];
}
export {};
