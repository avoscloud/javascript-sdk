## 开发进度板

### 发布前 Todos

- 考虑是否将 LC.Role 的 allow / deny 方法替换成更明确的 allowUser / allowRole / denyUser / denyRole / allowPublic / denyPublic

### 计划支持的模块

> 模块名为 [存储指南](https://leancloud.cn/docs/leanstorage_guide-js.html) 中列举的功能, 括号内为 4.0 版本 [API 文档](https://leancloud.github.io/javascript-sdk/docs/index.html) 中列举的类名

| 模块                                          | 代码 | 测试 | 指南 | 说明                                            |
| --------------------------------------------- | ---- | ---- | ---- | ----------------------------------------------- |
| 对象 (Object / ACL)                           | ✅   | ✅   | ✅   | 把「操作」提取成 Operation 类                   |
| 查询 (Query)                                  | ✅   | ✅   | ✅   | -                                               |
| LiveQuery                                     | ✅   | 🔴   | ✅   | 手动测试                                        |
| 文件 (File)                                   | ✅   | 🔴   | ✅   | Provider 的部分手动测试, 后续再尝试抽象成单测   |
| GeoPoint                                      | ✅   | ✅   | ✅   | -                                               |
| 用户 (User)                                   | ✅   | ✅   | ✅   | -                                               |
| 角色 (Role)                                   | ✅   | ✅   | ✅   | -                                               |
| 应用内搜索 (SearchQuery / SearchQueryBuilder) | ✅   | ✅   | 🚧   | 指南中有指向 API 文档的链接, API 文档发布后补充 |
| 应用内社交 (Status / InboxQuery)              | ✅   | ✅   | ✅   | -                                               |
| Push 通知 (Push)                              | ✅   | ✅   | 🚧   | 指南中有指向 API 文档的链接, API 文档发布后补充 |
| 图形验证吗 (Captcha)                          | ✅   | ✅   | ✅   | -                                               |
| 云函数 (Cloud)                                | ✅   | ✅   | ✅   | -                                               |

### 新版不支持的模块

| 模块         | 说明                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| Conversation | 由即时通讯 SDK 提供                                                                        |
| JobQuery     | 由云引擎 SDK 提供                                                                          |
| Leaderboard  | 由游戏 SDK 提供                                                                            |
| Relation     | 已弃用, 推荐使用「[中间表](https://leancloud.cn/docs/relation-guide.html#hash-186882703)」 |
| Insight      | 由云引擎 SDK 提供                                                                          |
