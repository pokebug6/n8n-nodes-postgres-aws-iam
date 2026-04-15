# n8n-nodes-postgres-aws-iam

[English](README.md)

这是一个 [n8n](https://n8n.io/) 社区节点，让你可以在 n8n 工作流中通过 **AWS IAM 认证**连接 Amazon RDS PostgreSQL
数据库，无需管理数据库密码。

[n8n](https://n8n.io/) 是一个[公平代码许可](https://docs.n8n.io/sustainable-use-license/)的工作流自动化平台。

[安装](#安装) |
[操作](#操作) |
[认证](#认证) |
[兼容性](#兼容性) |
[使用说明](#使用说明) |
[资源](#资源)

## 安装

按照 n8n 社区节点文档中的[安装指南](https://docs.n8n.io/integrations/community-nodes/installation/)进行安装。

## 操作

- **Execute Query** — 执行自定义 SQL 查询
- **Insert** — 向表中插入行
- **Insert or Update (Upsert)** — 插入或更新表中的行
- **Select** — 从表中查询行
- **Update** — 更新表中的行
- **Delete** — 删除整个表或表中的行

## 认证

该节点使用 **AWS IAM 角色认证**连接 RDS PostgreSQL，不需要配置传统的数据库用户名/密码凭据。

### 前提条件

1. 一个启用了 IAM 数据库认证的 Amazon RDS PostgreSQL 实例
2. 运行 n8n 的环境（EC2、ECS、Lambda 等）需要绑定具有 `rds-db:connect` 权限的 IAM 角色
3. 数据库中已创建并授权了用于 IAM 认证的用户

### 节点参数

| 参数         | 说明                  |
|------------|---------------------|
| AWS Region | RDS 实例所在的 AWS 区域    |
| Endpoint   | RDS 实例的端点主机名        |
| Port       | RDS 实例的端口号（默认 5432） |
| User       | 配置了 IAM 认证的数据库用户    |
| Database   | 要连接的数据库名称           |

连接时会自动通过 `@aws-sdk/rds-signer` 生成临时认证令牌，并强制使用 SSL 连接。

## 兼容性

- 需要 n8n v1.0 或更高版本

## 使用说明

1. 确保运行 n8n 的计算环境已绑定具有 `rds-db:connect` 权限的 IAM 角色
2. 在 n8n 中添加 **Postgres (AWS IAM)** 节点
3. 填写 AWS 区域、RDS 端点、端口、数据库用户和数据库名称
4. 选择要执行的操作并配置相关参数

该节点还支持作为 AI Agent 的工具使用（`usableAsTool: true`）。

## 资源

- [n8n 社区节点文档](https://docs.n8n.io/integrations/#community-nodes)
- [Amazon RDS IAM 数据库认证文档](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html)
- [GitHub 仓库](https://github.com/pokebug6/n8n-nodes-aws-iam)
