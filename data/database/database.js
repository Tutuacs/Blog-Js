const Sequelize = require("sequelize");

const connection = new Sequelize('Blog_Js','user','password',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection