const express = require('express');
const router = express.Router(); 

const Post  = require('../models/Post')

/*
    GET /
    *Home

 */
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


/*
    GET /
    *Posts :id

 */
    router.get("/post/:id", async  (req, res )=>{

try {


    let slug = req.params.id;



    const data = await Post.findById({_id : slug})
  

    res.render('post', {data})
} 
catch (error) {
        console.log(error)
}


       
    })
    
/*
    POST /
    *Posts -SearchTerm

 */
    router.post("/search", async  (req, res )=>{

        try {
        

            let searchTerm= req.body.searchTerm;
            const searchNoSpecialChar = searchTerm.replace(/[a-zA-Z0-9]/g, "") ;

            const data = await Post.find({
                $or :[
                    {title : {$regex : new RegExp(searchNoSpecialChar, "i")}},
                    {body: {$regex : new RegExp(searchNoSpecialChar, "i")}}
                ]
            })
          
        
            res.render('search', {data})
        } 
        catch (error) {
                console.log(error)
        }
        
        
               
            })



/*
    GET /
    *About

 */

router.get("/about",  (req, res )=>{


    res.render('about')
})


module.exports = router