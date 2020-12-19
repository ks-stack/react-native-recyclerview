import React from 'react';
import Image from 'react-native-fast-image';
import { View, Text } from 'react-native';
import { ItemStyle } from '../src';

interface Props {
    data: string;
    style: ItemStyle;
    index: number;
}

export default class Item extends React.PureComponent<Props> {
    render() {
        const { data, style, index } = this.props;
        return (
            <View style={style}>
                <Image style={{ height: style.height, width: style.width }} source={{ uri: data }} />
                <Text style={{ position: 'absolute' }}>5555555555555</Text>
                <Text style={{ position: 'absolute', fontSize: 40, color: 'red', fontWeight: 'bold' }}>{index}</Text>
            </View>
        );
    }
}
