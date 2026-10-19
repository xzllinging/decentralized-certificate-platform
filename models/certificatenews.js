
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Certificatenews extends BaseModel {
	static init() {
		return super.init(
			{
				
				news_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				title: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				content: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				published_by: { type:Sequelize.INTEGER , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				published_at: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "certificatenews",
				modelName: "certificatenews",
			}
		);
	}
	
	static listFields() {
		return [
			'news_id', 
			'title', 
			'content', 
			'published_by', 
			'published_at'
		];
	}

	static viewFields() {
		return [
			'news_id', 
			'title', 
			'content', 
			'published_by', 
			'published_at'
		];
	}

	static editFields() {
		return [
			'title', 
			'content', 
			'published_by', 
			'news_id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("news_id LIKE :search"), 
			Sequelize.literal("title LIKE :search"), 
			Sequelize.literal("content LIKE :search"),
		];
	}

	
	
}
Certificatenews.init();
export default Certificatenews;
