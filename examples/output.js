// 转换后的输出文件示例（在 h5 平台，pages 目录下）
import React from 'react'
import { Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { Text } from '@/components/CustomText'
import { View } from '@/components/CustomView'
import { Button } from '@/components/CustomButton'

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
