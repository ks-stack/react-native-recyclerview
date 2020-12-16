import React from 'react';
import Image from 'react-native-fast-image';

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
                {/* {!loaded && <Image style={[size, { position: 'absolute' }]} source={require('./default.png')} />} */}
                <Image style={[size]} onLoadEnd={this.onLoadEnd} source={{ uri: data }} />
            </>
        );
    }
}
