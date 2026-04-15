import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import type pgPromise from 'pg-promise';
import { type IFormattingOptions } from 'pg-promise';
import type pg from 'pg-promise/typescript/pg-subset';

export type QueryMode = 'single' | 'transaction' | 'independently';

export type QueryValue = string | number | IDataObject | string[];
export type QueryValues = QueryValue[];
export type QueryWithValues = { query: string; values?: QueryValues; options?: IFormattingOptions };

export type WhereClause = { column: string; condition: string; value: string | number };
export type SortRule = { column: string; direction: string };
export type ColumnInfo = {
	column_name: string;
	data_type: string;
	is_nullable: string;
	udt_name?: string;
	column_default?: string | null;
	is_generated?: 'ALWAYS' | 'NEVER';
	identity_generation?: 'ALWAYS' | 'NEVER' | 'BY DEFAULT';
};
export type EnumInfo = {
	typname: string;
	enumlabel: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PgpClient = pgPromise.IMain<{}, pg.IClient>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PgpDatabase = pgPromise.IDatabase<{}, pg.IClient>;
export type PgpConnectionParameters = pg.IConnectionParameters<pg.IClient>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PgpConnection = pgPromise.IConnected<{}, pg.IClient>;
export type ConnectionsData = { db: PgpDatabase; pgp: PgpClient };

export type QueriesRunner = (
	queries: QueryWithValues[],
	options: IDataObject,
) => Promise<INodeExecutionData[]>;

export type PostgresNodeOptions = {
	nodeVersion?: number;
	operation?: string;
	cascade?: boolean;
	connectionTimeout?: number;
	delayClosingIdleConnection?: number;
	queryBatching?: QueryMode;
	queryReplacement?: string;
	outputColumns?: string[];
	largeNumbersOutput?: 'numbers' | 'text';
	skipOnConflict?: boolean;
	replaceEmptyStrings?: boolean;
	treatQueryParametersInSingleQuotesAsText?: boolean;
};

// AWS IAM 认证连接参数
export type AwsIamConnectionParams = {
	region: string;
	host: string;
	port: number;
	user: string;
	database: string;
};
