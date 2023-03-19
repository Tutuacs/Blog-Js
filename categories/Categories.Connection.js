const sequelize = require("sequelize");
const connect = require("../data/database/database");

const Category = connect.define('categories',{
    title:{
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    }
})

Category.sync({force: false});


module.exports = Category;