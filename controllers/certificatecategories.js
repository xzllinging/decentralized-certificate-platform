import { Router } from 'express';
import { body } from 'express-validator';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();




/**
 * Route to list certificatecategories records
 * @GET /certificatecategories/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Certificatecategories.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'category_id', 'desc');
		query.attributes = DB.Certificatecategories.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Certificatecategories.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Certificatecategories record
 * @GET /certificatecategories/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Certificatecategories.viewFields();
		let record = await DB.Certificatecategories.findOne(query);
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
 * Route to insert Certificatecategories record
 * @POST /certificatecategories/add
 */
router.post('/add/', 
	[
		body('category_name').not().isEmpty(),
		body('description').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Certificatecategories record
		let record = await DB.Certificatecategories.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['category_id'];
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues: null, newValues });
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Certificatecategories record for edit
 * @GET /certificatecategories/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Certificatecategories.editFields();
		let record = await DB.Certificatecategories.findOne(query);
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
 * Route to update  Certificatecategories record
 * @POST /certificatecategories/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('category_name').optional({nullable: true}).not().isEmpty(),
		body('description').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Certificatecategories.editFields();
		let record = await DB.Certificatecategories.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Certificatecategories.update(modeldata, {where: where});
		record = await DB.Certificatecategories.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Certificatecategories record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /certificatecategories/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Certificatecategories.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['category_id'], oldValues });
		});
		await DB.Certificatecategories.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
