const Sequelize = require("sequelize");

const connection = new Sequelize('projeto-2','root','Tutuacs34!',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection