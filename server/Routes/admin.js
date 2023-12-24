const express = require('express');
const router = express.Router(); 
const adminLayout = '../views/layouts/admin.ejs'
const Post  = require('../models/Post')
const User  = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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


            /*
    POST/
    *Admin - Check Login

 */

    
    router.post("/admin", async  (req, res )=>{

        try {
            
            -
            res.render('admin/index', {layout: adminLayout})
        } 
        catch (error) {
                console.log(error)
        }
        
        
               
            })




    /* POST/
    *Admin - Register

 */

    
    router.post("/register", async  (req, res )=>{

        try {
            const {username , password} = req.body;
            const hashedpassword =await bcrypt.hash(password, 10) ;
            
         try {
                const user = await User.create({username, password : hashedpassword })
                res.status(201).json({message : 'user Created'. user})

         } catch (error) {
            if(error === 11000){
                res.status(409).json({message: ' user already in use', })
            }
            res.status(500).json({message : 'internal server error'})
         }




        } 
        catch (error) {
                console.log(error)
        }
        
        
               
            })


module.exports = router;