import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';

import { configurePostgres } from '../../transport';
import type { AwsIamConnectionParams } from '../helpers/interfaces';
import { getConnectionParams } from '../helpers/utils';

export async function databaseSearch(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	// 连接到默认的 postgres 数据库来查询数据库列表
	const connectionParams: AwsIamConnectionParams = {
		region: this.getNodeParameter('awsRegion', 0) as string,
		host: this.getNodeParameter('endpoint', 0) as string,
		port: this.getNodeParameter('port', 0) as number,
		user: this.getNodeParameter('user', 0) as string,
		database: 'postgres',
	};
	const options = {
		nodeVersion: this.getNode().typeVersion,
		connectionTimeout: 30,
	};

	const { db } = await configurePostgres.call(this, connectionParams, options);

	const response = await db.any(
		"SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname",
	);

	return {
		results: response.map((row) => ({
			name: row.datname as string,
			value: row.datname as string,
		})),
	};
}

export async function schemaSearch(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const connectionParams = getConnectionParams.call(this, 0);
	const options = {
		nodeVersion: this.getNode().typeVersion,
		connectionTimeout: 30,
	};

	const { db } = await configurePostgres.call(this, connectionParams, options);

	const response = await db.any('SELECT schema_name FROM information_schema.schemata');

	return {
		results: response.map((schema) => ({
			name: schema.schema_name as string,
			value: schema.schema_name as string,
		})),
	};
}
export async function tableSearch(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const connectionParams = getConnectionParams.call(this, 0);
	const options = {
		nodeVersion: this.getNode().typeVersion,
		connectionTimeout: 30,
	};

	const { db } = await configurePostgres.call(this, connectionParams, options);

	const schema = this.getNodeParameter('schema', 0, {
		extractValue: true,
	}) as string;

	const response = await db.any(
		'SELECT table_name FROM information_schema.tables WHERE table_schema=$1',
		[schema],
	);

	return {
		results: response.map((table) => ({
			name: table.table_name as string,
			value: table.table_name as string,
		})),
	};
}
