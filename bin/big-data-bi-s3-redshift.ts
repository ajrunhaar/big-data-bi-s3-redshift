#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BigDataBiS3RedshiftStack } from '../lib/big-data-bi-s3-redshift-stack';

const app = new cdk.App();
new BigDataBiS3RedshiftStack(app, 'BigDataBiS3RedshiftStack');
