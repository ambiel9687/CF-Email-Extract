# 📧 邮件数据提取工具

一个轻量级的纯前端邮件数据提取工具，支持从原始数据中提取邮箱和授权码，带历史记录功能。

## 功能特性

- **数据提取**：从 `邮箱----密码----授权码----日期` 格式中提取邮箱和授权码
- **一键复制**：快速复制提取结果到剪贴板
- **历史记录**：自动保存最近 20 条操作记录，支持回看和加载
- **响应式设计**：完美适配桌面端和移动端
- **纯前端实现**：无需后端，数据存储在本地，安全隐私

## 使用方法

1. 打开 `index.html` 文件
2. 在输入框中粘贴原始数据（每行一个记录）
3. 点击「提取」按钮
4. 查看输出结果，可点击「复制结果」一键复制

### 数据格式示例

**输入：**
```
test@example.com----password123----authcode456----2024-01-01
user@domain.com----mypass----secretcode----2024-01-02
```

**输出：**
```
test@example.com----authcode456
user@domain.com----secretcode
```

## 部署方式

### 本地使用
直接双击打开 `index.html` 文件即可使用。

### 服务器部署
将 `index.html` 上传到任意 Web 服务器或静态托管平台（如 GitHub Pages、Vercel、Netlify 等）。

## 技术栈

- 纯 HTML + CSS + JavaScript
- 无外部依赖
- LocalStorage 本地存储

## 浏览器兼容性

支持所有现代浏览器（Chrome、Firefox、Safari、Edge 等）。

## License

MIT
