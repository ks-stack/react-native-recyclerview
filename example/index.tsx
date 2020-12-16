import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ListView from '../src';
import images from './images';
import Item from './Item';

interface Props {
    horizontal?: boolean;
    index?: number;
}

export default class App extends React.Component<Props> {
    onRefresh = () => {};

    onEndReached = () => {};

    heightForItem = (index: number) => {
        return 200;
    };

    renderForItem = (index: number, size: { height: number; width: number }) => (
        <Item data={images[index]} size={size} />
    );

    renderForHeader = () => {
        return (
            <View style={{ backgroundColor: '#ffa' }}>
                <Text>header</Text>
            </View>
        );
    };

    renderForFooter = () => {
        return (
            <View style={{ backgroundColor: '#ffa' }}>
                <Text>footer</Text>
            </View>
        );
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.top} />
                <ListView
                    renderForItem={this.renderForItem}
                    heightForItem={this.heightForItem}
                    // heightForHeader={100}
                    // renderForHeader={this.renderForHeader}
                    // heightForFooter={100}
                    // renderForFooter={this.renderForFooter}
                    countForItem={images.length}
                    // shareCount={6}
                    shareMinHeight={200}
                    preOffset={500}
                    // debug
                    style={styles.style}
                    onEndReachedThreshold={1}
                    onEndReached={this.onEndReached}
                />
                <View style={styles.top} />
                <View style={[styles.absTop, styles.top]} />
                <View style={[styles.absBottom, styles.top]} />
            </View>
        );
    }
}

const marginHeight = 0;
const styles = StyleSheet.create({
    // style: { overflow: 'visible', flex: 1 },
    style: { overflow: 'hidden', flex: 1 },
    absTop: {
        position: 'absolute',
        backgroundColor: '#333a',
    },
    absBottom: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#333a',
    },
    top: {
        height: marginHeight,
        width: '100%',
    },
});
