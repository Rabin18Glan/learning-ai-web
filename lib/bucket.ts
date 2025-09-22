import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

export async function getBucket(bucketName:string) {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB not connected");
  }
  return new GridFSBucket(mongoose.connection.db, { bucketName });
}
