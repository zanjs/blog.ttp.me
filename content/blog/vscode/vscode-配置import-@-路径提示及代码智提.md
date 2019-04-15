---
title: vscode 配置import @ 路径提示及代码智提
date: 2019-04-15 20:04:83
category: vscode
---

## 创建 jsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES6",
        "module": "commonjs",
        "allowSyntheticDefaultImports": true,
        "baseUrl": "./",
        "paths": {
          "@/*": ["src/*"]
        }
    },
    "exclude": [
        "node_modules"
    ]
}
```

## 插件安装

1. 安装插件：`Path Intellisense`
2. 配置插件
   
```json
"path-intellisense.mappings": {
  "@": "${workspaceRoot}/src"
}
```