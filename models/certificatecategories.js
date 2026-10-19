
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Certificatecategories extends BaseModel {
	static init() {
		return super.init(
			{
				
				category_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				category_name: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				description: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				created_at: { type:Sequelize.DATE , allowNull: false  }
			}, 
			{ 
				sequelize,
				
				tableName: "certificatecategories",
				modelName: "certificatecategories",
			}
		);
	}
	
	static listFields() {
		return [
			'category_id', 
			'category_name', 
			'description', 
			'created_at'
		];
	}

	static viewFields() {
		return [
			'category_id', 
			'category_name', 
			'description', 
			'created_at'
		];
	}

	static editFields() {
		return [
			'category_id', 
			'category_name', 
			'description'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("category_id LIKE :search"), 
			Sequelize.literal("category_name LIKE :search"), 
			Sequelize.literal("description LIKE :search"),
		];
	}

	
	
}
Certificatecategories.init();
export default Certificatecategories;
