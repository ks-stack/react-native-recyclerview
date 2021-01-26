import React from 'react';
import Image from 'react-native-fast-image';
import { View, Text } from 'react-native';

interface Props {
    data: string;
    index: number;
}

export default class Item extends React.PureComponent<Props> {
    render() {
        const { data, index } = this.props;
        return (
            <View>
                <Image style={{ height: 100, width: 100 }} source={{ uri: data }} />
                <Text style={{ position: 'absolute', fontSize: 40, color: 'red', fontWeight: 'bold' }}>{index}</Text>
            </View>
        );
    }
}
