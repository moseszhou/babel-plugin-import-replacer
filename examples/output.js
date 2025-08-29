// 转换后的输出文件示例（在 h5 平台，pages 目录下）
import React from 'react'
import { Image } from '@tarojs/components'  // Image 没有配置，保持不变
import { AtButton } from 'taro-ui'
import { Text as RNText } from '@/components/CustomTextA'  // react-native 的 Text -> CustomTextA
import { Button as RNButton } from '@/components/CustomButton'  // react-native 的 Button 被替换
import { View as RNView } from '@/components/RNView'  // react-native 的 View -> RNView
import { Text } from '@/components/CustomTextB'  // @tarojs/components 的 Text -> CustomTextB
import { View } from '@/components/TaroView'  // @tarojs/components 的 View -> TaroView
import { Button } from '@/components/TaroButton'  // @tarojs/components 的 Button -> TaroButton

export default function HomePage() {
  return (
    <View className="home">
      <Text>这是来自 @tarojs/components 的 Text，将变成 CustomTextB</Text>  {/* 替换成 CustomTextB */}
      <RNText>这是来自 react-native 的 Text，将变成 CustomTextA</RNText>  {/* 替换成 CustomTextA */}
      <Button onClick={() => console.log('点击了按钮')}>
        这是来自 @tarojs/components 的 Button  {/* 被替换成 TaroButton */}
      </Button>
      <RNButton title="这是来自 react-native 的 Button" />  {/* 被替换成自定义组件 */}
      <RNView>这是来自 react-native 的 View</RNView>  {/* 被替换成 RNView */}
      <Image src="https://example.com/image.jpg" />  {/* 保持不变 */}
      <AtButton type="primary">AtButton</AtButton>
    </View>
  )
}
