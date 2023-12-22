const express = require('express');
const router = express.Router(); 

const Post  = require('../models/Post')


router.get("", async (req, res )=>{
try{
            let perPage = 3;
            let page = req.query.page || 1 ;


            const data = await Post.aggregate({ $sort :{createdAt : -1} }) 
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();


            const count = await Post.countDocuments({});
            const nextPage = parseInt(page) + 1;
            const hasNextPage = nextPage <= Math.ceil(count / perPage)

            res.render('index',
             {
                data,
                current : page ,
                nextPage : hasNextPage ? nextPage :null
            })



}
catch (error){
    console.error(error);
    

}
})






router.get("/about",  (req, res )=>{


    res.render('about')
})


module.exports = router