import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ListView, { ItemStyle } from '../src';
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
        return 100 + (index % 50);
    };

    marginForItem = (index: number) => {
        return { right: 10 };
    };

    renderForItem = (index: number, style: ItemStyle) => <Item index={index} style={style} data={images[index]} />;

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
                    // heightForItem={this.heightForItem}
                    heightForItem={150}
                    heightForHeader={100}
                    renderForHeader={this.renderForHeader}
                    heightForFooter={100}
                    renderForFooter={this.renderForFooter}
                    countForItem={images.length}
                    numColumns={3}
                    // preOffset={200}
                    contentContainerStyle={{ padding: 10 }}
                    style={styles.style}
                    onEndReachedThreshold={1}
                    onEndReached={this.onEndReached}
                    shareStyle={{ justifyContent: 'space-between', alignItems: 'flex-end' }}
                    // horizontal
                    // marginForItem={this.marginForItem}
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
