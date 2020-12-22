/// <reference types="react" />
import Base, { BaseProps } from '../Base';
export default class SameItemHeight extends Base {
    private offset;
    private inputs;
    private outputs;
    private shareGroup;
    private shareManagerRef;
    constructor(props: BaseProps);
    onHorizontalChange: () => void;
    onContentOffsetChange: (isForward: boolean) => void;
    getPosition: () => {
        sumHeight: number;
    };
    renderMain: () => JSX.Element;
}
