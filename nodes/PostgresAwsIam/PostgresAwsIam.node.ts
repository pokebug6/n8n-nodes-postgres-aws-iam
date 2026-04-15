import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { PostgresV1 } from './v1/PostgresV1.node';

export class PostgresAwsIam extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Postgres (AWS IAM)',
			name: 'postgresAwsIam',
			icon: 'file:rdsPostgres.svg',
			group: ['input'],
			defaultVersion: 1,
			description: 'Get, add and update data in Postgres',
			parameterPane: 'wide',
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new PostgresV1(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
