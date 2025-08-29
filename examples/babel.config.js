// babel.config.js 示例配置
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ],
  plugins: [
    [
      './index.js', // 或 'babel-plugin-import-replacer'
      {
        // 生效平台：h5、rn、weapp、alipay
        targets: ['h5', 'rn', 'weapp', 'alipay'],
        
        // 排除文件
        exclude: [
          '/nobiz/i18next',  // 字符串匹配
          /node_modules/,    // 正则表达式匹配
          '/src/utils/'      // 排除工具目录
        ],
        
        // 替换规则 - 基于来源的替换
        replace: {
          Text: {
            'react-native': '@/components/CustomTextA',      // react-native 的 Text -> CustomTextA
            '@tarojs/components': '@/components/CustomTextB' // @tarojs/components 的 Text -> CustomTextB
          },
          
          Button: {
            'react-native': '@/components/CustomButton',
            '@tarojs/components': '@/components/TaroButton'  // 不同来源替换成不同组件
          },
          
          View: {
            'react-native': '@/components/RNView',
            '@tarojs/components': '@/components/TaroView'
          }
        },
        
        // 自定义执行逻辑（现在包含 source 参数）
        execute: (name, filename, env, source) => {
          // 仅在 h5 平台替换来自 react-native 的 Text 组件
          if (name === 'Text' && env === 'h5' && source === 'react-native') {
            return true
          }
          
          // 仅在页面文件中替换 Button 组件
          if (name === 'Button' && filename.includes('/src/pages/')) {
            return true
          }
          
          // 在所有平台和文件中替换 View 组件
          if (name === 'View') {
            return true
          }
          
          return false
        }
      }
    ]
  ]
}
