const express = require("express");
const router = express();
const Category = require("./Categories.Connection");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/categories/new",adminAuth,(req,res)=>{
    res.render("admin/categories/new");
});

router.post("/categories/save",(req,res)=>{
    var title = req.body.title;

    if(title != undefined && title != ''){

        Category.create({

            title: title,
            slug: slugify(title)

        }).then(()=>{

            res.redirect("/admin/categories")
        
        })

    }else{
        res.redirect("/admin/categories/new")
    }
});

router.get("/admin/categories",adminAuth,(req,res)=>{

    Category.findAll().then(categories => {
        res.render("admin/categories/index",{categories: categories});
    });
});

router.post("/categories/delete",(req,res)=>{
    var id = req.body.id
    console.log(typeof(id))

    if(id != undefined && id >= 0){//verificando se eh undefined e um numero
        Category.destroy({//apagando um dado
            where: {
                id : id
            }
        }).then(()=>{
            res.redirect("/admin/categories");
        })
    }
});

router.get("/admin/categories/edit/:id",adminAuth, (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then(categoria => {

      if (categoria != undefined) {
        res.render("admin/categories/edit",{categoria: categoria});

      } else {

        res.redirect("/admin/categories");
      }

    }).catch(erro => {

      res.redirect("/admin/categories");
    });

});

router.post("/categories/update",(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;


    Category.update({title: title,slug: slugify(title)},{//atualizar o titulo e o slug

        where: {

            id: id//onde o ID eh o mesmo ID
        }
    }).then(()=>{

        res.redirect("/admin/categories");
    })


})



module.exports = router;