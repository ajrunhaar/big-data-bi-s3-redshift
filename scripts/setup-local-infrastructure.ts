import { createAndSeedBucket } from "../lambda/utils/s3-helper";

const run = async () => {
  const bucket = "MyTestBucket";
  const path =
    "/Users/antonrunhaar/ShellStack/Repositories/big-data-bi-s3-redshift/mock-s3";
  const params = { bucket, path };
  console.log("Creating and seeding bucket,", params);
  await createAndSeedBucket(params);
};

console.log("Running..");
run();
