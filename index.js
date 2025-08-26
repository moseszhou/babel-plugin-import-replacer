// babel-plugin-replace-taro-imports.js
module.exports = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const opts = state.opts || {}
        const { targets = [], exclude = [], replace = {}, execute } = opts

        const currentEnv = process.env.TARO_ENV
        if (targets.length > 0 && !targets.includes(currentEnv)) return

        const filename = state.file.opts.filename || ''

        // ---- exclude 检查 ----
        if (
          filename.includes('node_modules') ||
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
          const hasReplace = replace[name]
          const shouldExec =
            typeof execute === 'function'
              ? execute(name, filename, currentEnv)
              : true
          return hasReplace && shouldExec
        })

        if (toReplace.length === 0) return

        // 删除原 import 的目标 specifier
        path.node.specifiers = specifiers.filter((s) => !toReplace.includes(s))

        // 插入新 import
        toReplace.forEach((spec) => {
          const importedName = spec.imported.name
          const localName = spec.local.name
          const newSource = replace[importedName]

          const newImport = t.importDeclaration(
            [t.importSpecifier(t.identifier(localName), t.identifier(importedName))],
            t.stringLiteral(newSource)
          )

          if (path.node.specifiers.length === 0) {
            path.replaceWith(newImport)
          } else {
            path.insertAfter(newImport)
          }
        })
      }
    }
  }
}
