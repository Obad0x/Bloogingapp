const express = require('express');
const router = express.Router(); 
const adminLayout = '../views/layouts/admin.ejs'
const Post  = require('../models/Post')
const User  = require('../models/User')
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

/*
   
    *Auth middlewrare

 */

    const authMiddleware = (req, res, next) => {

        const token = req.cookies.token;

        if(!token) {
          return res.status(401).json( { message: 'Unauthorized'} );
        }
      
        try {
          const decoded = jwt.verify(token, jwtSecret);
          req.userId = decoded.userId;
          next();
        } catch(error) {
          res.status(401).json( { message: 'Unauthorized'} );
        }
    }






/*
    GET /
    *Admin - Login

 */

    router.get("/admin", async(req, res )=>{

        try {
            
            
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

    
    router.post("/admin",  async(req, res )=>{

        try {
            const { username, password } = req.body;
            
            const user = await User.findOne( { username } );
        
            if(!user) {
              return res.status(401).json( { message: 'Invalid credentials' } );
            }
        
            const isPasswordValid = await bcrypt.compare(password, user.password);
        
            if(!isPasswordValid) {
              return res.status(401).json( { message: 'Invalid credentials' } );
            }
        
            const token = jwt.sign({ userId: user._id}, jwtSecret );
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/dashboard');
        
          } catch (error) {
            console.log(error);
          }
               
            })

     
     
     
            /* GET/
      *Admin -Dashboard     */
router.get('/dashboard',authMiddleware,  async(req,res)=>{

            try {
                    const data = await Post.find();
                    res.render('admin/dashboard', {
                      data , layout: adminLayout
                    })
            } catch (error) {
                  console.log(error)
            }




                   
            });


    /* GET/
      *Admin - Create new Post    */
    router.get('/add-post',authMiddleware,  async(req,res)=>{

      try {
              const data = await Post.find();
              res.render('admin/add-post', {layout: adminLayout} )
      } catch (error) {
            console.log(error)
      }
   
      });
    /* POSY/
      *Admin - Create new Post    */
    router.post('/add-post',authMiddleware,  async(req,res)=>{

      try {
              console.log(req.body);


              try {

                  const newpost = new Post({
                    title : req.body.title, 
                    body : req.body.body
                  })

                  await Post.create(newpost);
                  res.redirect('/dashboard')

              } catch (error) {
                  console.log(error)
              }
     
      } catch (error) {
            console.log(error)
      }
   
      });





      


    /* get/
      *Admin - Edit POST  */
    router.get('/edit-post/:id',authMiddleware,  async(req,res)=>{

      try {
           const data = await Post.findOne({_id : req.params.id})


              res.render('admin/edit-post', {layout  :adminLayout, data})
     
      } catch (error) {
            console.log(error)
      }
   
      });



    /* PUT/
      *Admin - Edit POST  */
    router.put('/edit-post/:id',authMiddleware,  async(req,res)=>{

      try {
             await Post.findByIdAndUpdate(req.params.id, {
              title : req.body.title, 
              body : req.body.body,
              updatedAt : Date.now()
             });


              res.redirect(`/edit-post/${req.params.id}`)
     
      } catch (error) {
            console.log(error)
      }
   
      });



    /* DELETE/
      *Admin - DELETE POST  */
    router.delete('/delete-post/:id',authMiddleware,  async(req,res)=>{

      try {
                await Post.deleteOne({_id : req.params.id});
                res.redirect('/dashboard');
     
      } catch (error) {
            console.log(error)
      }
   
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