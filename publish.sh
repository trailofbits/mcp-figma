#!/bin/bash
# 构建项目
npm run build

# 检查npm登录状态
if ! npm whoami &> /dev/null; then
  echo "您未登录到npm。请运行 'npm login' 先登录"
  exit 1
fi

# 询问是否要发布
echo "准备发布 mcp-figma 到npm。"
read -p "确定要继续吗? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "已取消发布"
  exit 0
fi

# 执行发布
npm publish

echo "发布完成！"
echo "用户现在可以通过以下命令安装："
echo "npm install -g mcp-figma"