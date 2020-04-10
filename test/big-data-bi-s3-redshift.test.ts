import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import BigDataBiS3Redshift = require('../lib/big-data-bi-s3-redshift-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new BigDataBiS3Redshift.BigDataBiS3RedshiftStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
