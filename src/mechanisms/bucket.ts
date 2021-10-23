import { getEnv } from '../constants';
import IntegrationError from '../utilities/errors/integration';
import aws from 'aws-sdk';

const amazonInstanceS3 = new aws.S3({
  signatureVersion: 'v4',
  accessKeyId: getEnv().aws.publicKey,
  secretAccessKey: getEnv().aws.secretKey,
  region: getEnv().aws.region,
});

export default class Bucket {
  public static async uploadBuffer(file, bucketPath: string, options) {
    let response = null;

    try {
      const key = file.name;

      const paramsPut = {
        Key: key,
        Body: file.buffer,
        Bucket: bucketPath,
        ACL: options.isPrivate ? 'private' : 'public-read',
        ContentType: options.contentType,
        Expires: options.expires,
      };

      await amazonInstanceS3.upload(paramsPut).promise();

      const paramsGet = {
        Key: key,
        Bucket: bucketPath,
        Expires: options.getExpires,
      };

      response = await amazonInstanceS3.getSignedUrlPromise('getObject', paramsGet);
    } catch (err) {
      throw new IntegrationError('aws-s3', err);
    }

    return response;
  }

  public static async getSignedUrl(fileName: string, bucketPath: string, expires: number):
    Promise<string> {
    return amazonInstanceS3.getSignedUrlPromise('getObject', {
      Key: fileName,
      Bucket: bucketPath,
      Expires: expires,
    }).catch((err: any): any => {
      throw new IntegrationError('aws-s3', err);
    });
  }

  public static async getUploadUrl(fileName: string, bucketPath: string, expires: number):
    Promise<string> {
    return amazonInstanceS3.getSignedUrlPromise('putObject', {
      Key: fileName,
      Bucket: bucketPath,
      Expires: expires,
    }).catch((err: any): any => {
      throw new IntegrationError('aws-s3', err);
    });
  }
}
