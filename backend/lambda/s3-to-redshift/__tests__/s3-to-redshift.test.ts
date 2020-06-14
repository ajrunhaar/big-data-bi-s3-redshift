import * as AWS from "aws-sdk";
import {
  listObjectsFromBucket,
  uploadLocalFileToBucket,
} from "../../utils/s3-helper";
import * as glob from "glob";

describe("The redshift lambda", () => {
  const bucket = "MyTestBucket";
  const path = "mock-s3";

  beforeAll(async (done) => {
    console.log("Before all...");
    const s3 = new AWS.S3({ endpoint: "http://localhost:4572" });

    await s3.createBucket({ Bucket: bucket }).promise();

    const files = glob.sync(`${path}/**/*.*`, {});

    const s3Files: {
      Bucket: string;
      Key: string;
      Path: string;
    }[] = files.map((file) => ({
      Bucket: bucket,
      Key: file.split("/").slice(1).join("/"),
      Path: file,
    }));

    for (const s3File of s3Files) {
      console.log("Uploading file: ", s3File);
      await uploadLocalFileToBucket(s3File, s3);
    }

    done();
  });

  afterAll(async (done) => {
    console.log("After all...");
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
    done();
  });

  it("list files in s3", async () => {
    console.log("Test...");
    const objects = await listObjectsFromBucket({ Bucket: bucket });
    console.log("Uploaded objects: ", objects);
  });
});
