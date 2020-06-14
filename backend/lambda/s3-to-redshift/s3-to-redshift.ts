import { S3Handler } from "aws-lambda";
import csvtojson from "csvtojson";
import {
  getObjectAsBuffer,
  listObjectsFromBucket,
  uploadLocalFileToBucket,
} from "../utils/s3-helper";
import * as AWS from "aws-sdk";
import * as CryptoJS from "crypto-js";
import {isValid, parse} from "date-fns";

const dynamoDb = new AWS.DynamoDB.DocumentClient({ endpoint: "http://localhost:4569" });

const s3ToRedshift: S3Handler = async (event) => {
  console.log("Starting s3ToRedshift");

  const objects = await listObjectsFromBucket({
    Bucket: event.Records[0].s3.bucket.name,
  });

  console.log("Objects", objects);

  const object = await getObjectAsBuffer({
    Key: event.Records[0].s3.object.key,
    Bucket: event.Records[0].s3.bucket.name,
  });

  try {
    const jsonObject = await csvtojson({
      noheader: false,
      delimiter: ";",
      output: "json",
    }).fromString(object.Body!.toString());

    const firstValue:{[key:string]:string|number} = jsonObject[0];

    const headerArray = Object.keys(firstValue);


    const dataFormat = Object.entries(firstValue).map((entry)=>{return{key:entry[0],format:formatFromValue(entry[1])}});

    console.log(dataFormat);

    const headerHash = CryptoJS.MD5(
      headerArray
        .sort()
        .map((header) => {
          header.toLowerCase();
        })
        .join("-")
    ).toString();

    console.log("Header Hash", headerHash);

    const putResult = await dynamoDb
      .put({
        TableName: "my-test-table",
        Item: { 'headerHash': headerHash, headerArray:headerArray},
      })
      .promise();

    console.log(putResult.$response.data);

    const readResult = await dynamoDb.scan({
      TableName:'my-test-table',

    }).promise();
    console.log(readResult.$response.data);



  } catch (error) {
    console.log("Failed to execute", error);
  }
  // Read the header

  //store the filename and header values in a dynamo table

  //Match the header to a table definition in a dynamo table (if does not exist, create a new definition, and a new table)

  //Copy the files from s3 to the table using the COPY command

  //   await wait(10000);
  //
  //   const client = new Client({
  //     user: "master",
  //     database: "bi-redshift-data-warehouse",
  //     password: "%vehEhFxKayt6a[cjZM2my9k",
  //     port: 5439,
  //     host:
  //       "bigdatabis3redshiftstack-idbidatawarehouseredshif-3f488ut0usa1.cnefk9gvuvea.eu-west-1.redshift.amazonaws.com",
  //   });
  //
  //   await client.connect();
  //
  //   const result = await client.query(`create table if not exists test(
  //     testId integer not null,
  //     testString varchar(100),
  //     primary key (testId)
  // )`);
  //
  //   console.log(result);

  console.log("Ending s3ToRedshift");
};

const formatFromValue=(value:string|number):string=>{
  if(Number(value)){
    return Number.isInteger(Number(value))?'INTEGER':'DECIMAL'
  }


  const dateFormatValue = value.toString().replace(/-/gu,'//');
  const dateFormats = ['dd/mm/yyyy','yyyy/mm/dd'];

  for (const dateFormat of dateFormats){
    if(isValid(parse(dateFormatValue.toString(),dateFormat,new Date()))){
      return 'DATE'
    }
  }

  return 'TEXT'


};

const wait = async (millis: number): Promise<void> => {
  console.log(`Wait for ${millis} milliseconds`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, millis);
  });
};

export const handler = s3ToRedshift;
