// babel-plugin-replace-taro-imports.js
module.exports = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        // 跳过已经被处理过的import声明
        if (path.node._replacerProcessed) {
          return
        }

        const opts = state.opts || {}
        const { targets = [], exclude = [], replace = {}, execute } = opts

        const currentEnv = process.env.TARO_ENV
        if (targets.length > 0 && !targets.includes(currentEnv)) return

        const filename = state.file.opts.filename || ''

        // ---- exclude 检查 ----
        if (
          exclude.some((pattern) =>
            typeof pattern === 'string'
              ? filename.includes(pattern)
              : pattern.test && pattern.test(filename)
          )
        ) {
          return
        }

        const source = path.node.source.value
        const specifiers = path.node.specifiers

        // 找到需要替换的 specifier
        const toReplace = specifiers.filter((s) => {
          if (!t.isImportSpecifier(s)) return false
          const name = s.imported.name
          
          // 检查是否有基于来源的替换规则
          const hasReplace = replace[name] && 
                            typeof replace[name] === 'object' && 
                            replace[name][source]
          
          const shouldExec =
            typeof execute === 'function'
              ? execute(name, filename, currentEnv, source)
              : true
          
          return hasReplace && shouldExec
        })

        if (toReplace.length === 0) return

        // 删除原 import 的目标 specifier
        path.node.specifiers = specifiers.filter((s) => !toReplace.includes(s))

        // 收集所有新的import声明
        const newImports = toReplace.map((spec) => {
          const importedName = spec.imported.name
          const localName = spec.local.name
          
          // 获取替换目标
          const newSource = replace[importedName][source]

          const newImport = t.importDeclaration(
            [t.importSpecifier(t.identifier(localName), t.identifier(importedName))],
            t.stringLiteral(newSource)
          )
          // 标记为已处理，避免无限循环
          newImport._replacerProcessed = true
          return newImport
        })

        // 如果原始import声明没有剩余的specifiers，替换整个声明
        if (path.node.specifiers.length === 0) {
          // 替换为第一个新import，然后插入其余的
          path.replaceWith(newImports[0])
          for (let i = 1; i < newImports.length; i++) {
            path.insertAfter(newImports[i])
          }
        } else {
          // 否则在当前import声明后插入所有新的import
          newImports.reverse().forEach(newImport => {
            path.insertAfter(newImport)
          })
        }
      }
    }
  }
}
