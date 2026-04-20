import type {
	IExecuteFunctions,
	ICredentialTestFunctions,
	ILoadOptionsFunctions,
	ITriggerFunctions,
} from 'n8n-workflow';
import { Signer } from '@aws-sdk/rds-signer';
import pgPromise from 'pg-promise';

import { ConnectionPoolManager } from '../utils/connection-pool-manager';

import type {
	AwsIamConnectionParams,
	ConnectionsData,
	PgpConnectionParameters,
	PostgresNodeOptions,
} from '../v1/helpers/interfaces';

/**
 * 使用 AWS IAM Role 生成 RDS 认证 token
 */
async function generateRdsAuthToken(params: AwsIamConnectionParams): Promise<string> {
	const signer = new Signer({
		region: params.region,
		hostname: params.host,
		port: params.port,
		username: params.user,
	});
	return await signer.getAuthToken();
}

const getPostgresConfig = (
	params: AwsIamConnectionParams,
	password: string,
	options: PostgresNodeOptions = {},
) => {
	const dbConfig: PgpConnectionParameters = {
		host: params.host,
		port: params.port,
		database: params.database,
		user: params.user,
		password,
		keepAlive: true,
	};

	if (options.connectionTimeout) {
		dbConfig.connectionTimeoutMillis = options.connectionTimeout * 1000;
	}

	if (options.delayClosingIdleConnection) {
		dbConfig.keepAliveInitialDelayMillis = options.delayClosingIdleConnection * 1000;
	}

	// AWS RDS IAM 认证要求使用 SSL
	dbConfig.ssl = {
		rejectUnauthorized: false,
	};

	return dbConfig;
};

export async function configurePostgres(
	this: IExecuteFunctions | ICredentialTestFunctions | ILoadOptionsFunctions | ITriggerFunctions,
	connectionParams: AwsIamConnectionParams,
	options: PostgresNodeOptions = {},
): Promise<ConnectionsData> {
	const poolManager = ConnectionPoolManager.getInstance(this.logger);

	const fallBackHandler = async (abortController: AbortController) => {
		const pgp = pgPromise({
			// 防止控制台输出重复连接警告
			noWarnings: true,
		});

		// 始终将日期作为 ISO 字符串返回
		[pgp.pg.types.builtins.TIMESTAMP, pgp.pg.types.builtins.TIMESTAMPTZ].forEach((type) => {
			pgp.pg.types.setTypeParser(type, (value: string) => {
				const parsedDate = new Date(value);

				if (isNaN(parsedDate.getTime())) {
					return value;
				}

				return parsedDate.toISOString();
			});
		});

		if (options.largeNumbersOutput === 'numbers') {
			pgp.pg.types.setTypeParser(20, (value: string) => {
				return parseInt(value, 10);
			});
			pgp.pg.types.setTypeParser(1700, (value: string) => {
				return parseFloat(value);
			});
		}

		// 使用 IAM Role 生成认证 token
		const authToken = await generateRdsAuthToken(connectionParams);
		const dbConfig = getPostgresConfig(connectionParams, authToken, options);

		const db = pgp(dbConfig);

		abortController.signal.addEventListener('abort', async () => {
			try {
				if (!db.$pool.ended) await db.$pool.end();
			} catch {
				// 忽略关闭连接池时的错误
			}
		});

		return { db, pgp };
	};

	return await poolManager.getConnection({
		credentials: connectionParams,
		nodeType: 'postgres',
		nodeVersion: options.nodeVersion as unknown as string,
		fallBackHandler,
		wasUsed: () => {},
	});
}
