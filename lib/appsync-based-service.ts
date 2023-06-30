import * as core from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Tracing, Runtime } from 'aws-cdk-lib/aws-lambda';

import { join } from 'path';

export interface AppSyncBasedServiceProps {
  readonly serviceName: string;
}

export class AppSyncBasedService extends Construct {
  readonly graphQLApiEndpoint: string;
  readonly apiKey: string;

  constructor(scope: Construct, id: string, props: AppSyncBasedServiceProps) {
    super(scope, id);

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: props.serviceName,
      schema: appsync.SchemaFile.fromAsset(join(__dirname, `${props.serviceName}.graphql`)),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: core.Expiration.after(core.Duration.days(364)),
          },
        },
      },
      xrayEnabled: true,
    });

    const lambdaResolver = new lambda.NodejsFunction(this, 'lambdaResolver', {
      entry: join(__dirname, `${props.serviceName}-resolver.ts`),
      environment: {
        SCHEMA: api.schema.bind(api).definition.replace('__typename: String!', ''),
      },
      tracing: Tracing.ACTIVE,
      runtime: Runtime.NODEJS_16_X,
    });

    const lambdaDS = api.addLambdaDataSource('LambdaDS', lambdaResolver);

    lambdaDS.createResolver('QueryService', {
      typeName: 'Query',
      fieldName: '_service',
    });

    lambdaDS.createResolver('QueryEntities', {
      typeName: 'Query',
      fieldName: '_entities',
    });

    // TODO infer from schema
    lambdaDS.createResolver('QueryProduct', {
      typeName: 'Query',
      fieldName: 'product',
    });

    lambdaDS.createResolver('QueryProductCreatedBy', {
      typeName: 'Product',
      fieldName: 'createdBy',
    });

    this.graphQLApiEndpoint = api.graphqlUrl;
    this.apiKey = api.apiKey!;

    new core.CfnOutput(this, 'ApiEndpoint', {
      value: api.graphqlUrl,
    });
  }
}
