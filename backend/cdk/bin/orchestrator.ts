#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { BigDataBiS3RedshiftStack } from "../components/big-data-bi-s3-redshift-stack";
import {App, Construct} from "@aws-cdk/core";
import {FrontEndStack} from "../components/front-end/front-end-stack";

const app = new cdk.App();

interface BaseInfrastructureProps{
  components:{
    frontEnd:boolean;
    vpc:boolean;
    redshift:boolean;
    lambdas:boolean;

  }
}

class BaseInfrastructure extends Construct{
  constructor(scope:App,id:string, props:BaseInfrastructureProps) {
    super(scope,id);

    if(props.components.frontEnd){
      new FrontEndStack(this,'FrontEndStack',{});
    }

  }
}


new BaseInfrastructure(app, "BigDataBiS3RedshiftStack",{
  components:{
    frontEnd:true,
    vpc:false,
    redshift:false,
    lambdas:false
  }
});
