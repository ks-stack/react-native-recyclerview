/// <reference types="react" />
import Base, { BaseProps } from '../Base';
export default class DiffItemHeight extends Base {
    private itemOffsets;
    private itemHeightList;
    private shareManagerRef;
    constructor(props: BaseProps);
    onHorizontalChange: () => void;
    onContentOffsetChange: (isForward: boolean) => void;
    getPosition: () => {
        sumHeight: number;
    };
    renderMain: () => JSX.Element;
}
