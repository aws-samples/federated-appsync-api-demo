import { Stack } from "aws-cdk-lib";
import { NagSuppressions } from "cdk-nag";

export const addNagExceptions = (stack: Stack) => {
  NagSuppressions.addStackSuppressions(
    stack,
    [
      // DEFAULT LAMBDA ROLE EXCEPTIONS
      { id: 'AwsSolutions-IAM4', reason: 'Standard managed rule is fine' },
      { id: 'AwsSolutions-IAM5', reason: "Can\t tailored permission towards a log group we don't know the ARN yet" },

      //  LOGGING EXCEPTIONS
      { id: 'AwsSolutions-ASC3', reason: "Adding request leveling logging would increase cost with no real benefit for what we want to demonstrate" },
      { id: 'AwsSolutions-APIG1', reason: "Adding access logging would increase cost with no real benefit for what we want to demonstrate" },
      { id: 'AwsSolutions-APIG6', reason: "Adding Cloudwatch logging would increase cost with no real benefit for what we want to demonstrate" },
      { id: 'AwsSolutions-APIG2', reason: "Adding request validation would complexify the code for no real benefit for what we want to demonstrate" },

      // AUTH EXCEPTIONS
      { id: 'AwsSolutions-APIG4', reason: "Adding Cognito auth would complexify the code for no real benefit for what we want to demonstrate" },
      { id: 'AwsSolutions-COG4', reason: "Adding Cognito auth would complexify the code for no real benefit for what we want to demonstrate" },

      // WAF EXCEPTIONS
      { id: 'AwsSolutions-APIG3', reason: "Adding WAF would complexify the code for no real benefit for what we want to demonstrate" },
    ],
    true
  );
};