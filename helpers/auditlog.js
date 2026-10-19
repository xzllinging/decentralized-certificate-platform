
import DB from '../models/db.js';
async function writeToDBLog (req, payload) {
	try{
		const timeStamp = new Date();

		const arrPath = req.originalUrl.split("/").filter(Boolean);
		const page = arrPath[1];
		const action = arrPath[2] || "list";

		const reqId = req.params.recid || ""; // get rec id from url if available
		const recId = (payload.recid || reqId).toString(); //if array, convert to string
		const  userId = req.user.user_id || null;
		
		const oldValues = payload.oldValues || null;
		const newValues = payload.newValues || null;

		const userIp = req.ip;
		const userAgent = req.get('User-Agent');;
		const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		const  fields = {
			'action': action,
			'page': page,
			'record_id': recId,
			'old_values': oldValues,
			'new_values': newValues,
			'user_id': userId,
			'user_ip': userIp,
			'user_agent': userAgent,
			'request_url': requestUrl,
			'timestamp': timeStamp
		}
		return await DB.Audits.create(fields);
	}
	catch(err){
		console.log(err)
	}
}
export default writeToDBLog;
