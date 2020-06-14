# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Data upload logic

* Then a new file is uploaded to S3, a schema management lamda is triggered: SchemaManager
* The schema manager reads the header of the csv file and the bucket location and decides whether the file is attributable to 
a new table, or an existing table.
* If a new table is to be created, it creates a schema definition in DynamoDB, creates the table and add the file name (with schema pointer) to a 
 dynamo table to be consumed by a worker lambda.
* If the table already exists, the file name (with schema pointer) to a Dynamo table to be consumed by a worker lambda.

