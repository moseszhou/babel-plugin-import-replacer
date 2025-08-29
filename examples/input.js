// 输入文件示例
import React from 'react'
import { Text, View, Button, Image } from '@tarojs/components'
import { Text as RNText, Button as RNButton, View as RNView } from 'react-native'
import { AtButton } from 'taro-ui'

export default function HomePage() {
  return (
    <View className="home">
      <Text>这是来自 @tarojs/components 的 Text，将变成 CustomTextB</Text>
      <RNText>这是来自 react-native 的 Text，将变成 CustomTextA</RNText>
      <Button onClick={() => console.log('点击了按钮')}>
        这是来自 @tarojs/components 的 Button
      </Button>
      <RNButton title="这是来自 react-native 的 Button" />
      <RNView>这是来自 react-native 的 View</RNView>
      <Image src="https://example.com/image.jpg" />
      <AtButton type="primary">AtButton</AtButton>
    </View>
  )
}
