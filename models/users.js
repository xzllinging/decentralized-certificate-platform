
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Users extends BaseModel {
	static init() {
		return super.init(
			{
				
				user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				user_account: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				password: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				user_name: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				email: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				telephone: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				photo: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_role_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				create_time: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "users",
				modelName: "users",
			}
		);
	}
	
	static listFields() {
		return [
			'user_id', 
			'user_account', 
			'user_name', 
			'email', 
			'telephone', 
			'photo', 
			'user_role_id', 
			'create_time'
		];
	}

	static viewFields() {
		return [
			'user_id', 
			'user_account', 
			'user_name', 
			'email', 
			'telephone', 
			'user_role_id', 
			'create_time'
		];
	}

	static accounteditFields() {
		return [
			'user_account', 
			'user_name', 
			'telephone', 
			'photo', 
			'user_role_id', 
			'user_id'
		];
	}

	static accountviewFields() {
		return [
			'user_id', 
			'user_account', 
			'user_name', 
			'email', 
			'telephone', 
			'user_role_id', 
			'create_time'
		];
	}

	static editFields() {
		return [
			'user_account', 
			'user_name', 
			'telephone', 
			'photo', 
			'user_role_id', 
			'user_id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("user_id LIKE :search"), 
			Sequelize.literal("user_account LIKE :search"), 
			Sequelize.literal("user_name LIKE :search"), 
			Sequelize.literal("email LIKE :search"), 
			Sequelize.literal("telephone LIKE :search"),
		];
	}

	
	
}
Users.init();
export default Users;
