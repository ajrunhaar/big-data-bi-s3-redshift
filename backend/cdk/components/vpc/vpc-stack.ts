import {Construct, Stack, StackProps} from "@aws-cdk/core";

interface FrontEndStackProps extends StackProps{

}

class FrontEndStack extends Stack{
  constructor(scope:Construct, id:string, props:FrontEndStackProps) {
    super(scope,id,props);
  }
}