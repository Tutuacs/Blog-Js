const sequelize = require("sequelize");
const connect = require("../data/database/database");

const User = connect.define('users',{
    email:{
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
})

User.sync({force: false});


module.exports = User;