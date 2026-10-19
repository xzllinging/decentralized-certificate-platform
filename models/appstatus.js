
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Appstatus extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				app_status: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "appstatus",
				modelName: "appstatus",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'app_status'
		];
	}

	static viewFields() {
		return [
			'id', 
			'app_status'
		];
	}

	static editFields() {
		return [
			'app_status', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("app_status LIKE :search"),
		];
	}

	
	
}
Appstatus.init();
export default Appstatus;
