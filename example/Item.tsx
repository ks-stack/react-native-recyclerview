import React from 'react';
import Image from 'react-native-fast-image';
import { View, Text } from 'react-native';

interface Props {
    data: string;
    size: { height: number; width: number };
}

export default class Item extends React.PureComponent<Props> {
    state = {
        loaded: false,
    };

    onLoadEnd = () => {
        this.setState({ loaded: true });
    };

    render() {
        const { data, size } = this.props;
        const { loaded } = this.state;
        return (
            <>
                {!loaded && <Image style={[size, { position: 'absolute' }]} source={require('./default.png')} />}
                <Image style={size} onLoadEnd={this.onLoadEnd} source={{ uri: data }} />
            </>
        );
        return (
            <View style={[size, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text>55555555555555555</Text>
                <Text>55555555555555555</Text>
                <Text>55555555555555555</Text>
                <Text>55555555555555555</Text>
            </View>
        );
    }
}
