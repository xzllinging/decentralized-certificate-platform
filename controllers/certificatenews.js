import { Router } from 'express';
import { body } from 'express-validator';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();




/**
 * Route to list certificatenews records
 * @GET /certificatenews/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Certificatenews.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'news_id', 'desc');
		query.attributes = DB.Certificatenews.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Certificatenews.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Certificatenews record
 * @GET /certificatenews/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['news_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Certificatenews.viewFields();
		let record = await DB.Certificatenews.findOne(query);
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
 * Route to insert Certificatenews record
 * @POST /certificatenews/add
 */
router.post('/add/', 
	[
		body('title').not().isEmpty(),
		body('content').not().isEmpty(),
		body('published_by').not().isEmpty(),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Certificatenews record
		let record = await DB.Certificatenews.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['news_id'];
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues: null, newValues });
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Certificatenews record for edit
 * @GET /certificatenews/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['news_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Certificatenews.editFields();
		let record = await DB.Certificatenews.findOne(query);
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
 * Route to update  Certificatenews record
 * @POST /certificatenews/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('title').optional({nullable: true}).not().isEmpty(),
		body('content').optional({nullable: true}).not().isEmpty(),
		body('published_by').optional({nullable: true}).not().isEmpty(),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['news_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Certificatenews.editFields();
		let record = await DB.Certificatenews.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Certificatenews.update(modeldata, {where: where});
		record = await DB.Certificatenews.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Certificatenews record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /certificatenews/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['news_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Certificatenews.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['news_id'], oldValues });
		});
		await DB.Certificatenews.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
