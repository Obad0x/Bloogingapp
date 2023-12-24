const express = require('express');
const router = express.Router(); 
const adminLayout = '../views/layouts/admin.ejs'
const Post  = require('../models/Post')
const User  = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtsecret =process.env.JWT_SECRET

/*
   
    *Auth middlewrare

 */

    const authMiddleware = (req, res, next) => {

        const token = req.cookies.token;

     if(!token){
        console.log('no token')
     }

        try{
                const decoded = jwt.verify((token, jwtsecret));
                req.userId = decoded.userId;
                
                next();

        }catch(error){
            console.log(err)
            return res.status(401).json({message : 'Unauthorised'})
        }
    }






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

    
    router.post("/admin",  async  (req, res )=>{

        try {
            const {username , password}= req.body;

            const user = await User.findOne({ username })

            if(!user){
                return res.status(401).json({ message : 'invalid credentials'})
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid){
                return res.status(401).json({ message : 'invalid credentials'})  
            }
            const token = jwt.sign({userId : user._id}, jwtsecret);

            res.cookie('token',token, {httpOnly : true} );
            res.redirect('/dashboard');

        } 
        catch (error) {
                console.log(error)
        }
        
        
               
            })

      /* GET/
    *Admin -Dashboard

 */


            router.get('/dashboard', authMiddleware , async(req,res)=>{

                    res.render('admin/dashboard')
            });




    /* POST/
    *Admin - Register

 */
    router.post("/register", async  (req, res )=>{

        try {
            const {username , password} = req.body;
            const hashedpassword =await bcrypt.hash(password, 10) ;
            
         try {
                const user = await User.create({username, password : hashedpassword })
                res.status(201).json({message : 'user Created', user})

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