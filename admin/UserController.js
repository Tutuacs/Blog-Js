const express = require("express");
const router = express();
const Category = require("../categories/Categories.Connection");
const User = require("./User");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth")



router.get("/admin/users", (req, res) => {
    if(req.session.user ==undefined){
        res.redirect("/");
    }
    User.findAll().then(users =>{
        res.render("admin/users/index",{users: users});
    })
});

//router.get("/admin/users/create",adminAuth, (req, res) => {
router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
})

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {


            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);


            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch((erro) => {
                res.redirect("/");
            })

        } else {
            res.redirect("/admin/users/create")
        }
    })

})

router.get("/loguin",(req,res)=>{
    res.render("admin/users/loguin");
})

router.post("/authenticate",(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email:email}}).then(user =>{
        if(user != undefined){
            //Validar senha
            var correct = bcrypt.compareSync(password, user.password);
        
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
            }
            res.redirect("/admin/articles");
        }else{
        res.redirect("/loguin");

        }
    }).catch(erro =>{
        res.redirect("/loguin");
    })

})

router.get("/logout",(req,res)=>{
    req.session.user = undefined;
    res.redirect("/");
})

module.exports = router;