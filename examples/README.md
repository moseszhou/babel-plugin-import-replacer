# 使用示例

这个目录包含了 babel-plugin-import-replacer 的使用示例。

## 文件说明

- `babel.config.js` - Babel配置文件示例，展示了插件的完整配置选项
- `input.js` - 转换前的原始代码
- `output.js` - 转换后的代码（基于配置的预期输出）

## 运行示例

1. 安装依赖：
```bash
npm install @babel/core @babel/cli @babel/preset-env
```

2. 设置环境变量（模拟Taro环境）：
```bash
export TARO_ENV=h5
```

3. 运行转换：
```bash
npx babel input.js --config-file ./babel.config.js
```

## 不同场景示例

### 场景1：基于来源的替换（核心新功能）
```javascript
// babel.config.js
{
  replace: {
    Text: {
      'react-native': '@/components/RNText',
      '@tarojs/components': '@/components/TaroText',
      'antd-mobile': '@/components/AntdText'
    },
    Button: {
      'react-native': '@/components/RNButton',
      '@tarojs/components': '@/components/TaroButton'
    }
  }
}
```

### 场景2：仅在特定平台生效
```javascript
// babel.config.js
{
  targets: ['h5'], // 仅在H5平台生效
  replace: {
    Text: {
      'react-native': '@/components/H5Text'
    }
  }
}
```

### 场景3：排除特定文件
```javascript
// babel.config.js
{
  exclude: [
    '/src/utils/',     // 排除工具目录
    /legacy/,          // 排除legacy相关文件
  ],
  replace: {
    Text: {
      'react-native': '@/components/NewRNText',
      '@tarojs/components': '@/components/NewTaroText'
    }
  }
}
```

### 场景4：复杂的条件替换
```javascript
// babel.config.js
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
    // 复杂的替换逻辑（现在包含source参数）
    const isPageFile = filename.includes('/src/pages/')
    const isComponentFile = filename.includes('/src/components/')
    
    if (name === 'Text' && source === 'react-native') {
      // RN Text组件仅在页面文件中替换
      return isPageFile
    }
    
    if (name === 'Button' && source === '@tarojs/components') {
      // Taro Button组件在页面和组件文件中都替换
      return isPageFile || isComponentFile
    }
    
    return false
  }
}
```

## 测试不同环境

你可以通过设置不同的 `TARO_ENV` 值来测试不同平台的行为：

```bash
# 测试H5平台
TARO_ENV=h5 npx babel input.js --config-file ./babel.config.js

# 测试小程序平台
TARO_ENV=weapp npx babel input.js --config-file ./babel.config.js

# 测试RN平台
TARO_ENV=rn npx babel input.js --config-file ./babel.config.js
```
