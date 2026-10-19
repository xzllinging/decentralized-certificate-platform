
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Certificates extends BaseModel {
	static init() {
		return super.init(
			{
				
				certificate_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				ceruser_id: { type:Sequelize.INTEGER , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				category_id: { type:Sequelize.INTEGER , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				certificate_name: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				file_path: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				approvals_status: { type:Sequelize.STRING   },
				uploaded_at: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') },
				approvals_comment: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				blocknum: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				tx_hash: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				timestamp: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "certificates",
				modelName: "certificates",
			}
		);
	}
	
	static listFields() {
		return [
			'certificate_id', 
			'ceruser_id', 
			'category_id', 
			'certificate_name', 
			'file_path', 
			'approvals_status', 
			'uploaded_at', 
			'approvals_comment', 
			'blocknum', 
			'tx_hash', 
			'timestamp'
		];
	}

	static viewFields() {
		return [
			'certificate_id', 
			'ceruser_id', 
			'category_id', 
			'certificate_name', 
			'file_path', 
			'approvals_status', 
			'uploaded_at', 
			'approvals_comment', 
			'blocknum', 
			'tx_hash', 
			'timestamp'
		];
	}

	static editFields() {
		return [
			'category_id', 
			'certificate_name', 
			'file_path', 
			'approvals_status', 
			'approvals_comment', 
			'certificate_id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("certificate_id LIKE :search"), 
			Sequelize.literal("certificate_name LIKE :search"), 
			Sequelize.literal("file_path LIKE :search"), 
			Sequelize.literal("approvals_status LIKE :search"), 
			Sequelize.literal("approvals_comment LIKE :search"), 
			Sequelize.literal("tx_hash LIKE :search"),
		];
	}

	
	
}
Certificates.init();
export default Certificates;
