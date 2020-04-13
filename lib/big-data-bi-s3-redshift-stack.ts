import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as redshift from "@aws-cdk/aws-redshift";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as lambda from "@aws-cdk/aws-lambda";

export class BigDataBiS3RedshiftStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);



    //VPC for hosting the redshift cluster
    const vpc = new ec2.Vpc(this, "BI-Data-Warehouse-VPC", {
      cidr: "10.0.0.0/16",
      natGateways: 1,
      subnetConfiguration: [
        {
          name: "publicSubnet1",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const publicSubnets = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PUBLIC,
    });

    new ec2.SecurityGroup(this, "ID-BI-Data-Warehouse-VPC-Security-Group", {
      vpc: vpc,
      allowAllOutbound: true,
      securityGroupName: "BI-Data-Warehouse-VPC-Security-Group",
    });

    const clusterParameterGroup = new redshift.CfnClusterParameterGroup(
      this,
      "ID-BI-Data-Warehouse-Redshift-Cluster-Parameter-Group",
      {
        description: "Cluster parameter group",
        parameterGroupFamily: "redshift-1.0",
      }
    );

    const clusterSubnetGroup = new redshift.CfnClusterSubnetGroup(
      this,
      "ID-BI-Data-Warehouse-Redshift-Cluster-Subnet-Group",
      {
        description: "Redshift cluster subnet group",
        subnetIds: publicSubnets.subnetIds,
      }
    );

    //Redshift cluster
    const redshiftCluster = new redshift.CfnCluster(this, "ID-BI-Data-Warehouse-Redshift-Cluster", {
      clusterType: "single-node",
      dbName: "bi-redshift-data-warehouse",
      masterUserPassword: "%vehEhFxKayt6a[cjZM2my9k",
      masterUsername: "master",
      nodeType: "dc1.large",
      clusterParameterGroupName:clusterParameterGroup.ref,
      clusterSubnetGroupName:clusterSubnetGroup.ref
    });






    //S3 Bucket for storing uploading and storing CSV files.
    const s3DataLake = new s3.Bucket(this, "bi-s3-data-lake", {
      versioned: true,
    });

    //Lambdas
    const copyS3toRedshift = new lambda.Function(
      this,
      "CopyS3toRedshiftHandler",
      {
        runtime: lambda.Runtime.NODEJS_10_X,
        code: lambda.Code.fromAsset("lambda/copyS3toRedshift"),
        handler: "copyS3toRedshift.handler",
        environment: {
          S3_DATA_LAKE: s3DataLake.bucketName,
          REDSHIFT_ENDPOINT_ADDRESS: redshiftCluster.attrEndpointAddress
  },
    timeout: cdk.Duration.minutes(10)
  }
  );

  }
}
