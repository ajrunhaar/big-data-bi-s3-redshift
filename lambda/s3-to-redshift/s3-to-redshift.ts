import { S3Handler } from "aws-lambda";
import csvtojson from "csvtojson";
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

const copyS3toRedshift: S3Handler = async (event) => {
  console.log("Starting copyS3toRedshift");
  console.log("Event: ", event);

  //Get the Csv file object

  const object = await s3.getObject({
    Bucket:event.Records[0].s3.bucket.name,
    Key:event.Records[0].s3.object.key
  }).promise();

  const jsonObject = await csvtojson({
    noheader:false,
    delimiter:',',
    output:"json"
  }).fromString(object.Body!.toString());

  console.log("JSON object: ",jsonObject);

  //Read the header

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

  console.log("Ending copyS3toRedshift");
};

const wait = async (millis: number): Promise<void> => {
  console.log(`Wait for ${millis} milliseconds`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, millis);
  });
};

export const handler = copyS3toRedshift;
