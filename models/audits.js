
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Audits extends BaseModel {
	static init() {
		return super.init(
			{
				
				log_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				action: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				page: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				record_id: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_id: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_ip: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_agent: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				request_url: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				old_values: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				new_values: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				timestamp: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "audits",
				modelName: "audits",
			}
		);
	}
	
	static listFields() {
		return [
			'log_id', 
			'action', 
			'page', 
			'record_id', 
			'user_id', 
			'user_ip', 
			'user_agent', 
			'request_url', 
			'old_values', 
			'new_values', 
			'timestamp'
		];
	}

	static viewFields() {
		return [
			'log_id', 
			'action', 
			'page', 
			'record_id', 
			'user_id', 
			'user_ip', 
			'user_agent', 
			'request_url', 
			'old_values', 
			'new_values', 
			'timestamp'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("log_id LIKE :search"), 
			Sequelize.literal("action LIKE :search"), 
			Sequelize.literal("page LIKE :search"), 
			Sequelize.literal("record_id LIKE :search"), 
			Sequelize.literal("user_id LIKE :search"), 
			Sequelize.literal("user_ip LIKE :search"), 
			Sequelize.literal("user_agent LIKE :search"), 
			Sequelize.literal("request_url LIKE :search"), 
			Sequelize.literal("old_values LIKE :search"), 
			Sequelize.literal("new_values LIKE :search"),
		];
	}

	
	
}
Audits.init();
export default Audits;
