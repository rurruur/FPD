import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3 = new S3Client({
	credentials: {
		accessKeyId: process.env.AWS_ID,
		secretAccessKey: process.env.AWS_SECRET
	},
	region: 'ap-northeast-2'
});

const awsUploader = multer({
	limits: {
		fileSize: 3000000,
	},
	storage: multerS3({
		s3: s3,
		bucket: 'fpdiary',
		acl: 'public-read',
	})
});

const localUploader = multer({
	dest: 'uploads/',
	limits: {
		fileSize: 3000000,
	},
});

const uploader = process.env.MODE === 'production' ? awsUploader : localUploader;

export default uploader;