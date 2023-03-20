const sequelize = require("sequelize");
const connect = require("../data/database/database");
const Category = require("../categories/Categories.Connection")

const Article = connect.define('articles',{
    title:{
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    },
    body: {
        type: sequelize.TEXT,
        allowNull:false
    },
    categoryID: {
        type: sequelize.INTEGER,
        allowNull:false
    }
})

//Category.hasMany(Article);//Relacionamento 1Categoria para VariosArtigos
//Article.belongsTo(Category);//um artigo pertence a uma categoria

//relacionamento 1Artigo  para  1Categoria

Article.sync({force: false});// se for false ele cria a tabela no banco de dados


module.exports = Article;
