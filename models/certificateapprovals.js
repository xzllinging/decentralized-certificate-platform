
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Certificateapprovals extends BaseModel {
	static init() {
		return super.init(
			{
				
				approval_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				certificate_id: { type:Sequelize.INTEGER , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				user_id: { type:Sequelize.INTEGER , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				decision: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				comments: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				decided_at: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "certificateapprovals",
				modelName: "certificateapprovals",
			}
		);
	}
	
	static listFields() {
		return [
			'approval_id', 
			'certificate_id', 
			'user_id', 
			'decision', 
			'comments', 
			'decided_at'
		];
	}

	static viewFields() {
		return [
			'approval_id', 
			'certificate_id', 
			'user_id', 
			'decision', 
			'comments', 
			'decided_at'
		];
	}

	static editFields() {
		return [
			'approval_id', 
			'certificate_id', 
			'user_id', 
			'decision', 
			'comments'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("approval_id LIKE :search"), 
			Sequelize.literal("decision LIKE :search"), 
			Sequelize.literal("comments LIKE :search"),
		];
	}

	
	
}
Certificateapprovals.init();
export default Certificateapprovals;
