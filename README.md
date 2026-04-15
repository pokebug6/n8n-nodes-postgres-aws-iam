# n8n-nodes-postgres-aws-iam

[中文版](README.zh-CN.md)

An [n8n](https://n8n.io/) community node that connects to Amazon RDS PostgreSQL using **AWS IAM authentication**, eliminating the need to manage database passwords.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation) |
[Operations](#operations) |
[Authentication](#authentication) |
[Compatibility](#compatibility) |
[Usage](#usage) |
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Execute Query** — Run a custom SQL query
- **Insert** — Insert rows into a table
- **Insert or Update (Upsert)** — Insert or update rows in a table
- **Select** — Select rows from a table
- **Update** — Update rows in a table
- **Delete** — Delete an entire table or rows in a table

## Authentication

This node uses **AWS IAM role authentication** to connect to RDS PostgreSQL. No traditional database username/password credentials are required.

### Prerequisites

1. An Amazon RDS PostgreSQL instance with IAM database authentication enabled
2. The environment running n8n (EC2, ECS, Lambda, etc.) must have an IAM role with `rds-db:connect` permission attached
3. A database user configured and authorized for IAM authentication

### Node Parameters

| Parameter  | Description                                         |
|------------|-----------------------------------------------------|
| AWS Region | The AWS region where the RDS instance is located    |
| Endpoint   | The RDS instance endpoint hostname                  |
| Port       | The port number of the RDS instance (default 5432)  |
| User       | The database user configured for IAM authentication |
| Database   | The name of the database to connect to              |

A temporary authentication token is automatically generated via `@aws-sdk/rds-signer`, and SSL is enforced for all connections.

## Compatibility

- Requires n8n v1.0 or later

## Usage

1. Ensure the compute environment running n8n has an IAM role with `rds-db:connect` permission attached
2. Add the **Postgres (AWS IAM)** node in n8n
3. Fill in the AWS region, RDS endpoint, port, database user, and database name
4. Select the operation to perform and configure the relevant parameters

This node can also be used as an AI Agent tool (`usableAsTool: true`).

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Amazon RDS IAM database authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html)
- [GitHub repository](https://github.com/pokebug6/n8n-nodes-aws-iam)
