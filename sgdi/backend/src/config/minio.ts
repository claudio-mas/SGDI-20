import { Client } from 'minio';
import { env } from './env';

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

// Garantir que o bucket existe
export async function ensureBucket() {
  const bucketExists = await minioClient.bucketExists(env.MINIO_BUCKET);
  if (!bucketExists) {
    await minioClient.makeBucket(env.MINIO_BUCKET);
    console.log(`✅ Bucket '${env.MINIO_BUCKET}' criado`);
  }
}

// Gerar URL pré-assinada para upload
export async function getUploadUrl(objectName: string, expirySeconds = 3600) {
  return minioClient.presignedPutObject(env.MINIO_BUCKET, objectName, expirySeconds);
}

// Gerar URL pré-assinada para download
export async function getDownloadUrl(objectName: string, expirySeconds = 3600) {
  return minioClient.presignedGetObject(env.MINIO_BUCKET, objectName, expirySeconds);
}

// Upload de arquivo
export async function uploadFile(objectName: string, buffer: Buffer, contentType: string) {
  return minioClient.putObject(env.MINIO_BUCKET, objectName, buffer, buffer.length, {
    'Content-Type': contentType,
  });
}

// Download de arquivo
export async function downloadFile(objectName: string) {
  return minioClient.getObject(env.MINIO_BUCKET, objectName);
}

// Deletar arquivo
export async function deleteFile(objectName: string) {
  return minioClient.removeObject(env.MINIO_BUCKET, objectName);
}
