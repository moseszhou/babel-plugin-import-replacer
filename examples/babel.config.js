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
        
        // 替换规则
        replace: {
          Text: '@/components/CustomText',
          Button: '@/components/CustomButton',
          View: '@/components/CustomView'
        },
        
        // 自定义执行逻辑
        execute: (name, filename, env) => {
          // 仅在 h5 平台替换 Text 组件
          if (name === 'Text' && env === 'h5') {
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
