// 输入文件示例
import React from 'react'
import { Text, View, Button, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'

export default function HomePage() {
  return (
    <View className="home">
      <Text>欢迎使用 Taro</Text>
      <Button onClick={() => console.log('点击了按钮')}>
        点击我
      </Button>
      <Image src="https://example.com/image.jpg" />
      <AtButton type="primary">AtButton</AtButton>
    </View>
  )
}
