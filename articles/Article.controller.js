const express = require("express");
const router = express();
const Category = require("../categories/Categories.Connection");
const Article = require("./Article.Connection");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth")

router.get('/admin/articles',adminAuth,(req,res)=>{
    Article.findAll({
        include: [{model: Category}]//falando para o sequelize incluir os dados do banco categories para achar nome/id/... na pagina
    }).then(articles =>{
        res.render("admin/articles/index",{articles: articles})
    })
});

router.get("/admin/articles/new",adminAuth,(req,res)=>{
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories: categories});
    });
});

router.post("/articles/save",(req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    console.log(category)

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryID: category
    }).then(()=>{
        res.redirect("/admin/articles");
    });
});

router.post("/articles/delete",(req,res)=>{
    var id = req.body.id

    if(id != undefined && id >= 0){//verificando se eh undefined e um numero
        Article.destroy({//apagando um dado
            where: {
                id : id
            }
        }).then(()=>{
            res.redirect("/admin/articles");
        })
    }else{
        res.redirect("/admin/articles")
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id;
    
    Article.findByPk(id).then(article => {
     if(article != undefined){
   
        Category.findAll().then(categories => {
          res.render("admin/articles/edit", {categories: categories, article: article})
        })
        
     }else{
         res.redirect("/admin/articles")
     }
    }).catch(erro => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/update",(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({title: title, body: body,categoryID: category, slug: slugify(title)},{
        where: {
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles");
    }).catch(erro => {
        res.redirect("/")
    })
})

router.get("/articles/page/:num",(req,res)=>{
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page)|| page ==1 ){
        offset = 0;
    }else{
        offset = (parseInt(page)-1) * 4;
    }

    Article.findAndCountAll({
        order: [
            ['id','DESC']
        ],
        limit: 4,
        offset: offset// denomina por qual artigo inicia na pagina
    }).then(articles =>{

        var next;

        if(offset +4 >= articles.count){
            next = false;
        }else{
            next=true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles : articles,
        }

        Category.findAll().then(categories =>{
            res.render("admin/articles/page",{result:result,categories: categories})
        })

    })

})

module.exports = router;