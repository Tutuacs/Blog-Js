const express = require("express");
const exp = express();
const bodyParser = require("body-parser");
const connection = require('./data/database/database');
const session = require("express-session");

// View engine
exp.set('view engine','ejs');


//Redis


//configurando sessoes
exp.use(session({
    secret: "qualquer_coisa",//aumentar a seguranda das sessoes
    cookie: {maxAge: 3000000},//fala para o servidor que o usuario possui uma sessao
    resave: true,
    saveUninitialized: true
}))

//Static
exp.use(express.static(`public`));

// Body parser
exp.use(bodyParser.urlencoded({ extended: false }));
exp.use(bodyParser.json());

//Controller
const categoriesController =require("./categories/Categories.controller");
const articlesController = require("./articles/Article.controller");
const usersController = require("./admin/UserController")


const Article = require("./articles/Article.Connection");
const Category = require("./categories/Categories.Connection");
const User = require("./admin/User");


//Database
connection.authenticate().then(()=>{
    console.log("Conexao feita com sucesso!");
}).catch((error)=>{
    console.log(error);
});


exp.use("/",categoriesController);
exp.use("/",articlesController);
exp.use("/",usersController);



exp.get("/",(req,res)=>{
    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(articles =>{
        Category.findAll().then(categories =>{
            res.render("index",{articles: articles,categories: categories});            
        })
    });
});

exp.get("/:slug",(req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where : {
            slug:slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article",{article: article,categories: categories});            
            })
        }else{
            res.redirect("/");
        }
    }).catch(erro =>{
        res.redirect("/")
    })
})

exp.get("/category/:slug",(req,res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index",{articles: category.articles,categories: categories})
            })
        }else{
            res.redirect("/");
        }
    }).catch(erro=>{
        res.redirect("/");
    })
})

exp.listen(8080, () =>{
    console.log("O servidor esta ativo!");
});