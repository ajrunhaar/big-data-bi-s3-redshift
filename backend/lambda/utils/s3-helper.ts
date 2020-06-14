import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as glob from "glob";
/**
 *
 * @param parameters
 * @param s3
 */
export const getObjectAsBuffer = async (
  parameters: { Key: string; Bucket: string },
  s3: AWS.S3 = new AWS.S3({ endpoint: "http://localhost:4572" })
): Promise<{ Body: Buffer; LastModified?: Date }> => {
  const s3Object = await s3.getObject(parameters).promise();

  if (!Buffer.isBuffer(s3Object.Body)) {
    throw new Error(`Body is not a buffer`);
  }

  return { Body: s3Object.Body, LastModified: s3Object.LastModified };
};

/**
 *
 * @param parameters
 * @param s3
 */
export const listObjectsFromBucket = async (
  parameters: { Bucket: string },
  s3: AWS.S3 = new AWS.S3({ endpoint: "http://localhost:4572" })
): Promise<{ objects?: AWS.S3.ObjectList }> => {
  const s3Objects = await s3
    .listObjects({ Bucket: parameters.Bucket })
    .promise();

  return { objects: s3Objects.Contents };
};

/**
 *
 * @param parameters
 * @param s3
 */
export const uploadLocalFileToBucket = async (
  parameters: { Path: string; Key: string; Bucket: string },
  s3: AWS.S3 = new AWS.S3({ endpoint: "http://localhost:4572" })
): Promise<void> => {
  const fileContents = fs.readFileSync(parameters.Path).toString();

  await s3
    .putObject({
      Bucket: parameters.Bucket,
      Key: parameters.Path,
      Body: fileContents,
    })
    .promise();
};

/**
 *
 * @param bucket
 * @param path
 */
export const createAndSeedBucket = async (parameters: {
  bucket: string;
  path: string;
}): Promise<void> => {
  const s3 = new AWS.S3({ endpoint: "http://localhost:4572" });

  await s3.createBucket({ Bucket: parameters.bucket }).promise();
  const files = glob.sync(`${parameters.path}/**/*.*`, {});

  console.log("files", files);

  const s3Files: {
    Bucket: string;
    Key: string;
    Path: string;
  }[] = files.map((file) => ({
    Bucket: parameters.bucket,
    Key: file.split("/").slice(1).join("/"),
    Path: file,
  }));

  for (const s3File of s3Files) {
    console.log("Uploading file: ", s3File);
    await uploadLocalFileToBucket(s3File, s3);
  }
};

/**
 *
 * @param bucket
 */
export const cleanAndDeleteBucket = async (bucket: string): Promise<void> => {
  const s3 = new AWS.S3({ endpoint: "http://localhost:4572" });

  const objects = await listObjectsFromBucket({ Bucket: bucket });

  const objectKeys = objects.objects!.map((object) => {
    return { Key: object.Key! };
  });

  await s3
    .deleteObjects({
      Bucket: bucket,
      Delete: {
        Objects: objectKeys,
      },
    })
    .promise();

  await s3.deleteBucket({ Bucket: bucket }).promise();
};
