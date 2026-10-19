import { Router } from 'express';
import ejs from 'ejs';
import { body } from 'express-validator';
import config from '../config.js';
import utils from '../helpers/utils.js';
import uploader from '../helpers/uploader.js';
import mailer from '../helpers/mailer.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();




/**
 * Route to list users records
 * @GET /users/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.Users.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'user_id', 'desc');
		query.attributes = DB.Users.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Users.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Users record
 * @GET /users/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['user_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Users.viewFields();
		let record = await DB.Users.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to insert Users record
 * @POST /users/add
 */
router.post('/add/', 
	[
		body('password').not().isEmpty(),
		body('confirm_password', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
		body('user_name').not().isEmpty(),
		body('email').not().isEmpty().isEmail(),
		body('telephone').optional({nullable: true, checkFalsy: true}),
		body('photo').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		modeldata.password = utils.passwordHash(modeldata.password);
		
		// set default role for user
		const roleId =  await DB.Roles.findValue('role_id', {role_name: 'Admin'});
		modeldata['user_role_id'] = roleId;
		
		// check if user_name already exist.
		let user_nameCount = await DB.Users.count({ where:{ 'user_name': modeldata.user_name } });
		if(user_nameCount > 0){
			return res.badRequest(`${modeldata.user_name} already exist.`);
		}
		
		// check if email already exist.
		let emailCount = await DB.Users.count({ where:{ 'email': modeldata.email } });
		if(emailCount > 0){
			return res.badRequest(`${modeldata.email} already exist.`);
		}
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.photo, 'photo');
			modeldata.photo = fileInfo.filepath;
		}
		await beforeAdd(modeldata, req);
		
		//save Users record
		let record = await DB.Users.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['user_id'];
		const newValues = JSON.stringify(record); 
		await sendMailOnRecordAdd(record);
		req.writeToAuditLog({ recid, oldValues: null, newValues });
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});
try{
            let mailtitle = "Mail Subject";
            let mailbody = `Html content`;
            let recipient = "19277979392@163.com";
            let mailResult = await mailer.sendMail(recipient, mailtitle , mailbody);
            if(mailResult.messageId){
                console.log("Email Sent");
            }
            else{
                console.log(mailResult.error);
            }
        }
        catch(error){
            console.log(error)
        }
/**
* Before create new record
* @param {object} postdata // validated form data used to create new record
*/
async function beforeAdd(postdata, req){
    //enter statement here
}


/**
 * Route to get  Users record for edit
 * @GET /users/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['user_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Users.editFields();
		let record = await DB.Users.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to update  Users record
 * @POST /users/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('user_account').optional({nullable: true}).not().isEmpty(),
		body('user_name').optional({nullable: true}).not().isEmpty(),
		body('telephone').optional({nullable: true, checkFalsy: true}),
		body('photo').optional({nullable: true, checkFalsy: true}),
		body('user_role_id').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		
		// check if user_name already exist.
		let user_nameCount = await DB.Users.count({where:{'user_name': modeldata.user_name, 'user_id': {[DB.op.ne]: recid} }});
		if(user_nameCount > 0){
			return res.badRequest(`${modeldata.user_name} already exist.`);
		}
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.photo, 'photo');
			modeldata.photo = fileInfo.filepath;
		}
		const query = {};
		const where = {};
		where['user_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Users.editFields();
		let record = await DB.Users.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Users.update(modeldata, {where: where});
		record = await DB.Users.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Users record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /users/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['user_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Users.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['user_id'], oldValues });
		});
		await DB.Users.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
async function sendMailOnRecordAdd(record){
	
	const mailtitle = `New Users Record Added`;
	const message = `New Users record has been added`;
	const recid = record['user_id'];
	const baseUrl = config.app.frontendUrl;
	const recordLink = `${baseUrl}/#/users/view/${recid}`;
	const viewData = { message, recordLink };
	const mailbody = await ejs.renderFile("views/notifications/record_action_mail.ejs", viewData);
	const recipient = `19277979392@163.com`;
	const mailResult = await mailer.sendMail(recipient, mailtitle , mailbody);
	
	return mailResult;
	/*
	if(mailResult.messageId){
		console.log("Email Sent");
	}
	else{
		console.error(mailResult.error);
	}
	*/
}
export default router;
