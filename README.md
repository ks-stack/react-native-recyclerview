
# react-native-recyclerview

一个纯`react-native`实现的滚动列表，借鉴于[react-native-largelist](https://github.com/bolan9999/react-native-largelist)和[recyclerlistview](https://github.com/Flipkart/recyclerlistview)，更少的预渲染数量，更流畅的滚动表现。底层使用`react-native`自带的`ScrollView`，没有额外原生依赖

## Demerits
必须提前传入列表元素的高度(横向滚动时为宽度)

## Todo

1. 刷新头
2. 粘性item

## Getting started

`$ yarn add @ks-stack/react-native-recyclerview`

## Usage
参考[example](https://github.com/ks-stack/react-native-recyclerview/tree/main/example)文件夹

# Props
理论上兼容除[contentContainerStyle](https://reactnative.cn/docs/scrollview#contentcontainerstyle)的全部[ScrollView](https://reactnative.cn/docs/scrollview)的属性，以下为新增属性
Prop name              | Description   | Type      | Default value | Required
-----------------------|---------------|-----------|---------------|---------
`countForItem`         | 列表元素的总数量 | number | none | true
`renderForItem`        | 列表元素的渲染方法 | funtion | none | true
`heightForItem`        | 列表元素的高度(横向滚动时为宽度)，传入数值时采用`react-native-largelist`的模式，传入方法时采用`recyclerlistview`的模式 | funtion \| number | none | true
`numColumns`           | 同[FlatList](https://reactnative.cn/docs/flatlist#numcolumns) | number | 1 | false
`renderForHeader`      | 列表头部的渲染方法，注意头部不会复用，会一直存在 | funtion | none | false
`heightForHeader`      | 列表头部的高度 | number | none | false
`renderForFooter`      | 列表尾部的渲染方法，注意尾部不会复用，会一直存在 | funtion | none | false
`heightForFooter`      | 列表尾部的高度 | number | none | false
`ListEmptyComponent`   | 列表为空时渲染的组件 | funtion \| component | none | false
`preOffset`            | 预渲染的偏移量，增大该数值可减少图片渲染慢的白屏几率 | number | ios200，安卓800，因为glide渲染图片实在太慢了 | false
`onEndReachedThreshold`| 同[FlatList](https://reactnative.cn/docs/flatlist#onendreachedthreshold) | number | 1 | false
`onEndReached`         | 同[FlatList](https://reactnative.cn/docs/flatlist#onendreached) | funtion | none | false
`onVisibleItemsChange` | 同[FlatList](https://reactnative.cn/docs/flatlist#onviewableitemschanged) | funtion | none | false

# Methods

Method name            | Description
-----------------------|---------------
`scrollTo`             | 同[ScrollView](https://reactnative.cn/docs/scrollview#scrollto)
`scrollToEnd`          | 同[ScrollView](https://reactnative.cn/docs/scrollview#scrolltoend)
`flashScrollIndicators`| 同[ScrollView](https://reactnative.cn/docs/scrollview#flashscrollindicators)

## Run the example app

Make sure to have an emulator running or an Android device connected, and then:

```
$ glit clone https://github.com/ks-stack/react-native-recyclerview.git
$ yarn
$ cd ios && pod install && cd ..
$ react-native run-ios
$ react-native run-android
```
