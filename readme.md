# babel-plugin-import-replacer

一个用于替换特定import语句的Babel插件，特别适用于Taro多端开发项目。

## 功能特性

- 🎯 **按平台替换**: 根据`TARO_ENV`环境变量，在指定平台上替换import语句
- 🚫 **排除机制**: 支持字符串匹配和正则表达式排除特定文件
- 🔧 **灵活配置**: 支持多个组件/模块的替换规则
- 🎮 **自定义执行**: 通过`execute`函数实现复杂的替换逻辑

## 安装

```bash
npm install babel-plugin-import-replacer --save-dev
# 或
yarn add babel-plugin-import-replacer --dev
```

## 使用方法

在你的Babel配置文件中添加插件：

### babel.config.js
```javascript
module.exports = {
  plugins: [
    [
      'babel-plugin-import-replacer',
      {
        targets: ['h5', 'rn', 'weapp', 'alipay'], // 生效平台
        exclude: [
          '/nobiz/i18next', // 字符串匹配
          /node_modules/,   // 正则表达式匹配
        ],
        replace: {
          Text: '@/nobiz/i18next',
          Button: '@/components/CustomButton',
        },
        execute: (name, filename, env) => {
          // 仅在 h5 平台替换 Text
          if (name === 'Text' && env === 'h5') return true
          // 仅替换 src/pages 下的文件
          if (filename.includes('/src/pages/')) return true
          return false
        }
      }
    ],
  ]
}
```

### .babelrc
```json
{
  "plugins": [
    [
      "babel-plugin-import-replacer",
      {
        "targets": ["h5", "rn", "weapp", "alipay"],
        "exclude": ["/nobiz/i18next"],
        "replace": {
          "Text": "@/nobiz/i18next"
        }
      }
    ]
  ]
}
```

## 配置选项

### targets
- **类型**: `string[]`
- **默认值**: `[]` 全平台生效
- **说明**: 指定插件生效的平台列表。基于`process.env.TARO_ENV`判断当前平台。如果为空数组，则在所有平台生效。 

### exclude
- **类型**: `(string | RegExp)[]`
- **默认值**: `[]`
- **说明**: 排除不需要处理的文件路径。支持字符串包含匹配和正则表达式匹配。

### replace
- **类型**: `Record<string, string>`
- **默认值**: `{}`
- **说明**: 替换规则映射表。键为原始导入的组件名，值为新的导入路径。

### execute
- **类型**: `(name: string, filename: string, env: string) => boolean`
- **默认值**: `undefined`
- **说明**: 自定义执行函数，用于实现复杂的替换逻辑。
  - `name`: 当前处理的组件名
  - `filename`: 当前文件路径
  - `env`: 当前平台环境（TARO_ENV）
  - 返回`true`表示执行替换，`false`表示跳过

## 快速开始

查看 [examples](./examples/) 目录获取完整的使用示例和配置文件。

## 使用示例

### 基础用法

**原始代码**:
```javascript
import { Text, View, Button } from '@tarojs/components'
```

**配置**:
```javascript
{
  replace: {
    Text: '@/components/CustomText'
  }
}
```

**转换后**:
```javascript
import { View, Button } from '@tarojs/components'
import { Text } from '@/components/CustomText'
```

### 平台特定替换

**配置**:
```javascript
{
  targets: ['h5'], // 仅在H5平台生效
  replace: {
    Text: '@/components/H5Text'
  }
}
```

### 条件替换

**配置**:
```javascript
{
  replace: {
    Text: '@/components/CustomText',
    Button: '@/components/CustomButton'
  },
  execute: (name, filename, env) => {
    // 仅在页面文件中替换Text组件
    if (name === 'Text') {
      return filename.includes('/src/pages/')
    }
    // 在所有环境替换Button组件
    if (name === 'Button') {
      return true
    }
    return false
  }
}
```

### 排除特定文件

**配置**:
```javascript
{
  exclude: [
    '/src/utils/',        // 排除utils目录
    /test/,              // 排除包含test的路径
    'legacy-components'   // 排除包含此字符串的文件
  ],
  replace: {
    Text: '@/components/NewText'
  }
}
```

## 工作原理

1. **平台检查**: 检查当前`TARO_ENV`是否在`targets`列表中
2. **文件过滤**: 根据`exclude`规则跳过不需要处理的文件
3. **导入分析**: 解析import语句中的具名导入
4. **替换判断**: 根据`replace`配置和`execute`函数判断是否需要替换
5. **代码转换**: 移除原导入中的目标组件，添加新的import语句

## 注意事项

- 插件会自动跳过`node_modules`目录下的文件
- 仅处理具名导入（named imports），不处理默认导入
- 如果原import语句中的所有导入都被替换，原语句会被完全替换；否则会在后面插入新的import语句
- `execute`函数的返回值会与`replace`配置共同决定是否执行替换

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request来改进这个插件。

## 更新日志

### 1.0.0
- 初始版本发布
- 支持基本的import替换功能
- 支持平台特定和条件替换
- 支持文件排除机制
