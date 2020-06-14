import {Construct, Stack, StackProps} from "@aws-cdk/core";
import * as redshift from "@aws-cdk/aws-redshift";

interface RedshiftStackProps extends StackProps{
  subnetIds:string[],
  vpcSecurityGroupIds:string[],
  credentials:{username:string,password:string}
}

class RedshiftStack extends Stack{
  constructor(scope:Construct, id:string, props:RedshiftStackProps) {
    super(scope,id,props);

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
        subnetIds: props.subnetIds,
      }
    );

    //Redshift cluster
    const redshiftCluster = new redshift.CfnCluster(
      this,
      "ID-BI-Data-Warehouse-Redshift-Cluster",
      {
        clusterType: "single-node",
        dbName: "bi-redshift-data-warehouse",
        masterUserPassword:props.credentials.password,
        masterUsername:props.credentials.username,
        // masterUserPassword: "%vehEhFxKayt6a[cjZM2my9k",
        // masterUsername: "master",
        nodeType: "dc1.large",
        clusterParameterGroupName: clusterParameterGroup.ref,
        clusterSubnetGroupName: clusterSubnetGroup.ref,
        vpcSecurityGroupIds: props.vpcSecurityGroupIds,
      }
    );
  }
}