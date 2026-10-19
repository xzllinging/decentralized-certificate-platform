import { Router } from 'express';
import DB from '../models/db.js';


const router = Router();


 /**
 * Route to get certificate_id_option_list records
 * @GET /components_data/certificate_id_option_list
 */
router.get('/certificate_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT certificate_id as value, certificate_name as label FROM certificates` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get user_id_option_list records
 * @GET /components_data/user_id_option_list
 */
router.get('/user_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT user_id as value, user_name as label FROM users` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get category_id_option_list records
 * @GET /components_data/category_id_option_list
 */
router.get('/category_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT category_id as value, category_name as label FROM certificatecategories` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get approvals_status_option_list records
 * @GET /components_data/approvals_status_option_list
 */
router.get('/approvals_status_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT app_status AS value,app_status AS label FROM appstatus` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get role_id_option_list records
 * @GET /components_data/role_id_option_list
 */
router.get('/role_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT role_id as value, role_name as label FROM roles` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Users table
 * @GET /components_data/users_user_name_exist/{fieldvalue}
 */
router.get('/users_user_name_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await DB.Users.count({ where:{ 'user_name': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Users table
 * @GET /components_data/users_email_exist/{fieldvalue}
 */
router.get('/users_email_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await DB.Users.count({ where:{ 'email': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get user_account_option_list records
 * @GET /components_data/user_account_option_list
 */
router.get('/user_account_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT role_name AS value,role_name AS label FROM roles` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to getcount_certificates value
 * @GET /components_data/getcount_certificates
 */
router.get('/getcount_certificates', async (req, res) => {
	try{
		let sqltext = `SELECT COUNT(*) AS passed_count FROM certificates WHERE approvals_status = '已通过'` ;
		
		let value = await DB.rawQueryValue(sqltext);
		return res.ok(value.toString());
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get barchart_ records
 * @GET /components_data/barchart_
 */
router.get('/barchart_',  async (req, res) => {
	let chartData = { labels:[], datasets:[] };
	try{
		let sqltext = `SELECT 
    u.user_name, 
    COUNT(c.certificate_id) AS count 
FROM users u 
LEFT JOIN certificates c ON u.user_id = c.ceruser_id 
WHERE u.user_role_id = 3 -- 关键：只统计学生（假设角色ID 3=Student）
GROUP BY u.user_id, u.user_name
ORDER BY count DESC` ;
		
		let records = await DB.rawQueryList(sqltext);
		chartData['labels'] = records.map(function(v){ return v.user_name });
		let dataset1 = {
			data: records.map(function(v){ return parseFloat(v.count) }),
			label: "上传证书统计",
			backgroundColor: "rgba(255 , 128 , 64, 0.5)", 
			borderColor: "rgba(255 , 128 , 64, 0.5)", 
			borderWidth: "2",
		};
		chartData.datasets.push(dataset1);
		return res.ok(chartData) ;
	}
	catch(err) {
		return res.serverError(err);
	}
});
export default router;
