const express = require('express');
const router = express.Router(); 
const adminLayout = '../views/layouts/admin.ejs'
const Post  = require('../models/Post')

/*
    GET /
    *Admin - Login

 */

    router.get("/admin", async  (req, res )=>{

        try {
            
            -
            res.render('admin/index', {layout: adminLayout})
        } 
        catch (error) {
                console.log(error)
        }
        
        
               
            })

module.exports = router;