// CDK Nag check against AWS Solutions ruleset

import { App, Aspects } from 'aws-cdk-lib';
import { Annotations, Match } from 'aws-cdk-lib/assertions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import * as FederatedAppsyncApiDemo from '../lib/federated-appsync-api-demo-stack';

const mockApp = new App();

const stack = new FederatedAppsyncApiDemo.FederatedAppsyncApiDemoStack(mockApp, 'MyTestStack');
addNagExceptions(stack)
Aspects.of(stack).add(new AwsSolutionsChecks());


test('No unsuppressed Warnings', () => {
  const warnings = Annotations.fromStack(stack).findWarning('*', Match.stringLikeRegexp('AwsSolutions-.*'));
  console.log(warnings);
  expect(warnings).toHaveLength(0);
});

test('No unsuppressed Errors', () => {
  const errors = Annotations.fromStack(stack).findError('*', Match.stringLikeRegexp('AwsSolutions-.*'));
  console.log(errors);
  expect(errors).toHaveLength(0);
});

function addNagExceptions(stack: FederatedAppsyncApiDemo.FederatedAppsyncApiDemoStack) {
  throw new Error('Function not implemented.');
}
