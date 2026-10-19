export default {
	app: {
		name: "xzl-js-vue-exam2",
		url: "http://localhost:8060",
		frontendUrl: "http://localhost:8050",
		secret: "a32a462a705d2734aeb86cfd25249605",
		language: "english",
		publicDir: "assets",
	},
	auth: {
		userTokenSecret: "0f890c9A-1ax%W@fa8d6YY6Q!!0-74316e16393668505839",
		apiTokenSecret: "69287028$Xax%W!048099B#Q-!07a2cd7693233d3d7200f6",
		jwtDuration: 30, //in minutes
		otpDuration: 5, //in minutes
	},
	database: {
		name:"rad-xzl-exam2",
		type: "mysql",
		host: "localhost",
		username: "root",
		password: "123456",
		port: "3306",
		charset: "utf8",
		recordlimit: 10,
		ordertype: "DESC"
	},
	mail: {
		username:"2128283202@qq.com",
		password: "lyonxamwkzjeefdb",
		senderemail:"2128283202@qq.com",
		sendername:"xzl",
		host: "smtp.qq.com",
		secure: true,
		port: "465"
	},
	upload: {
		tempDir: "uploads/temp/",
		importdata: {
			filenameType: "timestamp",
			extensions: "csv",
			limit: "10",
			maxFileSize: "3",
			returnFullpath: "false",
			filenamePrefix: "",
			uploadDir: "uploads/files/"
		},
		
		file_path: {
			filenameType: "random",
			extensions: "jpg,png,gif,jpeg",
			limit: "1",
			maxFileSize: "3",
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			imageResize:  [ 
				{name: "small", width: 100, height: 100, mode: "cover"}, 
				{name: "medium", width: 480, height: 480, mode: "inside"}, 
				{name: "large", width: 1024, height: 760, mode: "inside"}
			],

		},

		photo: {
			filenameType: "random",
			extensions: "jpg,png,gif,jpeg",
			limit: "1",
			maxFileSize: "3",
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			imageResize:  [ 
				{name: "small", width: 100, height: 100, mode: "cover"}, 
				{name: "medium", width: 480, height: 480, mode: "inside"}, 
				{name: "large", width: 1024, height: 760, mode: "inside"}
			],

		},

	},
	s3: {
		secretAccessKey: "",
		accessKeyId: "",
		region: "us-west-2",
		bucket: "",
	},
	
	locales: {
		'english': 'English',
	}

}