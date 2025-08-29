# babel-plugin-import-replacer

一个用于替换特定import语句的Babel插件，特别适用于Taro多端开发项目。

## 功能特性

- 🎯 **按平台替换**: 根据`TARO_ENV`环境变量，在指定平台上替换import语句
- 📦 **基于来源替换**: 支持根据不同的import来源（如react-native、@tarojs/components）进行不同的替换
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
          // 基于来源的替换规则
          Text: {
            'react-native': '@/components/CustomTextA',      // react-native 的 Text
            '@tarojs/components': '@/components/CustomTextB' // @tarojs/components 的 Text
          },
          Button: {
            'react-native': '@/components/RNButton',
            '@tarojs/components': '@/components/TaroButton'
          },
          // 也支持简单的字符串替换（向后兼容）
          View: '@/components/CustomView'
        },
        execute: (name, filename, env, source) => {
          // 仅在 h5 平台替换来自 react-native 的 Text
          if (name === 'Text' && env === 'h5' && source === 'react-native') return true
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
          "Text": {
            "react-native": "@/components/RNText",
            "@tarojs/components": "@/components/TaroText"
          }
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
- **类型**: `Record<string, string | Record<string, string>>`
- **默认值**: `{}`
- **说明**: 替换规则映射表。键为原始导入的组件名，值可以是：
  - **字符串**: 直接替换为指定路径（向后兼容）
  - **对象**: 基于不同import来源进行不同替换，键为来源路径，值为目标路径

### execute
- **类型**: `(name: string, filename: string, env: string, source: string) => boolean`
- **默认值**: `undefined`
- **说明**: 自定义执行函数，用于实现复杂的替换逻辑。
  - `name`: 当前处理的组件名
  - `filename`: 当前文件路径
  - `env`: 当前平台环境（TARO_ENV）
  - `source`: 当前组件的import来源路径
  - 返回`true`表示执行替换，`false`表示跳过

## 快速开始

查看 [examples](./examples/) 目录获取完整的使用示例和配置文件。

## 使用示例

### 基础用法

**原始代码**:
```javascript
import { Text, View, Button } from '@tarojs/components'
import { Text as RNText, View as RNView } from 'react-native'
```

**配置**:
```javascript
{
  replace: {
    Text: {
      'react-native': '@/components/RNText',
      '@tarojs/components': '@/components/TaroText'
    },
    View: '@/components/CustomView' // 简单字符串替换
  }
}
```

**转换后**:
```javascript
import { Button } from '@tarojs/components'
import { Text } from '@/components/TaroText'
import { View } from '@/components/CustomView'
import { Text as RNText } from '@/components/RNText'
import { View as RNView } from '@/components/CustomView'
```

### 基于来源的替换

这是插件的核心新功能，允许根据不同的import来源进行不同的替换。

**原始代码**:
```javascript
import { Text, Button } from '@tarojs/components'
import { Text as RNText, Button as RNButton } from 'react-native'
import { Text as AntdText } from 'antd-mobile'
```

**配置**:
```javascript
{
  replace: {
    Text: {
      'react-native': '@/components/RNText',        // RN Text组件
      '@tarojs/components': '@/components/TaroText', // Taro Text组件
      'antd-mobile': '@/components/AntdText'        // Antd Mobile Text组件
    },
    Button: {
      'react-native': '@/components/RNButton',
      '@tarojs/components': '@/components/TaroButton'
    }
  }
}
```

**转换后**:
```javascript
import { Text } from '@/components/TaroText'
import { Button } from '@/components/TaroButton'
import { Text as RNText } from '@/components/RNText'
import { Button as RNButton } from '@/components/RNButton'
import { Text as AntdText } from '@/components/AntdText'
```

### 平台特定替换

**配置**:
```javascript
{
  targets: ['h5'], // 仅在H5平台生效
  replace: {
    Text: {
      'react-native': '@/components/H5Text'
    }
  }
}
```

### 条件替换

**配置**:
```javascript
{
  replace: {
    Text: {
      'react-native': '@/components/RNText',
      '@tarojs/components': '@/components/TaroText'
    },
    Button: {
      'react-native': '@/components/RNButton',
      '@tarojs/components': '@/components/TaroButton'
    }
  },
  execute: (name, filename, env, source) => {
    // 仅在页面文件中替换来自react-native的Text组件
    if (name === 'Text' && source === 'react-native') {
      return filename.includes('/src/pages/')
    }
    // 在所有环境替换来自@tarojs/components的Button组件
    if (name === 'Button' && source === '@tarojs/components') {
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
    Text: {
      'react-native': '@/components/NewRNText',
      '@tarojs/components': '@/components/NewTaroText'
    }
  }
}
```

## 工作原理

1. **平台检查**: 检查当前`TARO_ENV`是否在`targets`列表中
2. **文件过滤**: 根据`exclude`规则跳过不需要处理的文件
3. **导入分析**: 解析import语句中的具名导入和来源路径
4. **来源匹配**: 根据import来源路径匹配相应的替换规则
5. **替换判断**: 根据`replace`配置和`execute`函数判断是否需要替换
6. **代码转换**: 移除原导入中的目标组件，添加新的import语句

## 注意事项

- 插件会自动跳过已处理过的import声明，避免无限循环
- 仅处理具名导入（named imports），不处理默认导入
- 支持基于来源的替换和简单字符串替换两种模式
- 如果原import语句中的所有导入都被替换，原语句会被完全替换；否则会在后面插入新的import语句
- `execute`函数现在包含`source`参数，可以基于import来源进行更精确的控制

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request来改进这个插件。

## 更新日志

### 1.0.1
- ✨ 新增基于import来源的精确替换功能
- 🔧 支持针对不同来源（react-native、@tarojs/components等）的不同替换规则
- 🐛 修复无限循环问题，添加处理标记机制
- 📈 `execute`函数新增`source`参数，支持更精确的条件判断
- 🔄 保持向后兼容，仍支持简单字符串替换模式

### 1.0.0
- 初始版本发布
- 支持基本的import替换功能
- 支持平台特定和条件替换
- 支持文件排除机制
