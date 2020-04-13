import {S3Handler} from "aws-lambda";
import {Client} from 'pg';

const copyS3toRedshift:S3Handler = async (event)=> {
  console.log("Starting copyS3toRedshift");
  console.log("Event: ", event);
  await wait(10000);

  //Establish connection to postgres database

  const client = new Client({
    user:'',
    database:'',
    password:'',
    port:5439,
    host:''
  });

  await client.connect();

  //Execute copy command with new S3


  console.log("Ending copyS3toRedshift");
};

const wait = async(millis:number):Promise<void>=>{
  console.log(`Wait for ${millis} milliseconds`);
  return new Promise((resolve)=>{
    setTimeout(()=>{resolve()},millis);
  })
};

export const handler = copyS3toRedshift;