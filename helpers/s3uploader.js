
import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import config from '../config.js';
class S3Uploader {
	uploadSettings = {};
	getFileName(file) {
		var newFilename = "";
		var filenameType = this.uploadSettings.filenameType || 'random';
		if (filenameType == 'date') {
			//save file in date format e.g 2018-09-24-02-30-40.jpg
			newFilename = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/\:/g, '-')
		}
		else if (filenameType == 'timestamp') {
			//save file in unix timestamp e.g 20180924023040.jpg
			const ticks = Number(new Date());
			newFilename = Math.floor(ticks / 1000).toString();
		}
		else if (filenameType == 'original') {
			//save file with original filename form the user computer e.g mycv.docx
			newFilename = path.parse(file.originalname).name
		}
		else {
			newFilename = crypto.randomBytes(16).toString("hex");
		}
		//adding prefix to file name example profile_pic_20.jpg
		const filenamePrefix = this.uploadSettings.filenamePrefix || ''
		const fileExt = path.extname(file.originalname).substring(1).toLowerCase();
		newFilename = `${filenamePrefix}${newFilename}.${fileExt}`;
		return newFilename;
	}
	isAllowedExt(file) {
		if (this.uploadSettings.extensions) {
			const fileExt = path.extname(file.originalname).substring(1).toLowerCase();
			const allowed = this.uploadSettings.extensions.replace(/\s/g, '').split(',');
			return allowed.includes(fileExt)
		}
		return true;
	}
	upload(fieldName) {
		this.uploadSettings = config.upload[fieldName];
		const s3 = new S3Client({
			credentials: {
				accessKeyId: config.s3.accessKeyId,
				secretAccessKey: config.s3.secretAccessKey,
			},
			region: config.s3.region,
		});
		const limits = {
			fileSize: Number(this.uploadSettings.maxFileSize) * 1024 * 1024,
			files: Number(this.uploadSettings.maxFiles)
		}
		const upload = multer({
			limits,
			fileFilter: (req, file, callback) => {
				if (!this.isAllowedExt(file)) {
					return callback(new Error('file extension not allowed'));
				}
				callback(null, true);
			},
			storage: multerS3({
				s3: s3,
				bucket: config.s3.bucket,
				metadata: (req, file, callback) => {
					callback(null, { fieldName: file.fieldname });
				},
				key: (req, file, callback) => {
					let fileName = this.getFileName(file);
					callback(null, fileName);
				}
			})
		});
		return upload;
	}
}
const uploader = new S3Uploader();
export default uploader;