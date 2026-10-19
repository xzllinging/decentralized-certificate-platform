import { Router } from 'express';
import { body } from 'express-validator';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();




/**
 * Route to list certificateapprovals records
 * @GET /certificateapprovals/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Certificateapprovals.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'approval_id', 'desc');
		query.attributes = DB.Certificateapprovals.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Certificateapprovals.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Certificateapprovals record
 * @GET /certificateapprovals/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['approval_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Certificateapprovals.viewFields();
		let record = await DB.Certificateapprovals.findOne(query);
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
 * Route to insert Certificateapprovals record
 * @POST /certificateapprovals/add
 */
router.post('/add/', 
	[
		body('certificate_id').not().isEmpty(),
		body('user_id').not().isEmpty(),
		body('decision').not().isEmpty(),
		body('comments').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Certificateapprovals record
		let record = await DB.Certificateapprovals.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['approval_id'];
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues: null, newValues });
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Certificateapprovals record for edit
 * @GET /certificateapprovals/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['approval_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Certificateapprovals.editFields();
		let record = await DB.Certificateapprovals.findOne(query);
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
 * Route to update  Certificateapprovals record
 * @POST /certificateapprovals/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('certificate_id').optional({nullable: true}).not().isEmpty(),
		body('user_id').optional({nullable: true}).not().isEmpty(),
		body('decision').optional({nullable: true}).not().isEmpty(),
		body('comments').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['approval_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Certificateapprovals.editFields();
		let record = await DB.Certificateapprovals.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Certificateapprovals.update(modeldata, {where: where});
		record = await DB.Certificateapprovals.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Certificateapprovals record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /certificateapprovals/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['approval_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Certificateapprovals.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['approval_id'], oldValues });
		});
		await DB.Certificateapprovals.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
