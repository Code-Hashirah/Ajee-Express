const express=require('express');
const fs=require('fs');
const path=require('path')
const router=express.Router();
const productDatabaseDir=path.join(__dirname,'..', 'database', 'productTable.json')
const userDatabaseDir=path.join(__dirname,'..', 'database', 'userTable.json')
 
//home page route
router.get('/', (req,res)=>{
    fs.readFile(productDatabaseDir, (err, list)=>{
        if(!err){
            let productsPage=JSON.parse(list)
             res.render('./index',{Products:productsPage})
        }
    });
   
})

// login page route
router.get('/Login', (req,res)=>{
    fs.readFile(userDatabaseDir,(err, list)=>{
        if(!err){
            let Users=JSON.parse(list);
            res.render('Login',{user:Users})
        }
    })
  
})

router.post('/Login',(req,res)=>{
    let details=req.body;
    // console.log(details)
    fs.readFile(userDatabaseDir, (err,list)=>{
        if(!err){
        let Users=JSON.parse(list);
        // console.log(Users)
        for(let i=0; i<Users.length; i++){
           
            if(details.email==Users[i].email && details.password==Users[i].password && Users[i].Role=="Admin"){
                res.redirect('/admin-dashboard')
            }
            else if (details.email==Users[i].email && details.password==Users[i].password && Users[i].Role=="Buyer"){
                res.redirect('/users-dashboard')
            }
            else{
               
                console.log("Error")

            }
        }
    }

    })
   
})

// register page routes
router.get('/Register', (req,res)=>{
    res.render('register')
})

router.post('/Register', (req,res)=>{
    let regDetails=req.body;
    fs.readFile(userDatabaseDir,(err,list)=>{
        if(!err){
        let newUser=JSON.parse(list)
        newUser.push(regDetails)
        fs.writeFile(userDatabaseDir,JSON.stringify(newUser),(err)=>{
            if(err) throw "Error! Unable to register"
            res.redirect('Login')
        }) 
    }  
    })

})
// admin dashboard routes
router.get('/admin-dashboard', (req,res)=>{
    res.render('admin/dashboard')
})
// buyer dshboard routes
router.get('/users-dashboard', (req,res)=>{
    fs.readFile(productDatabaseDir, (err,list)=>{
        if(!err){
            let allProd=JSON.parse(list)
            res.render('users/dashboard',{Products:allProd})
        }
    })
    // fs.readFile(userDatabaseDir, (err, list)=>{
    //     if(!err){

    //     }
    // })
   
})

// Add product routes
router.get('/admin-add-product', (req,res)=>{
    res.render('admin/add-product')
})

// product routes
router.get('/admin-product', (req,res)=>{
    fs.readFile(productDatabaseDir, (err,list)=>{
        if(!err){
        let allProd=JSON.parse(list)
    res.render('admin/product',{Products:allProd})
    }
    })
})

router.post('/add-product', (req,res)=>{
    let productDetails=req.body;
    fs.readFile(productDatabaseDir, (err, list)=>{
        let newProduct=JSON.parse(list)
        productDetails.id=newProduct.length;
        newProduct.push(productDetails)
        fs.writeFile(productDatabaseDir,JSON.stringify(newProduct), (err)=>{
            if(err) throw "Error. Please checkdetails again"
            res.redirect('/admin-product')
        })
    })
})


router.post('/admin-delete', (req,res)=>{
    let id=req.params.productId;
    fs.readFile(productDatabaseDir, (err,list)=>{
        let ProductDel=JSON.parse(list);
        // const newProduct=ProductDel.filter((value, index)=>{
        //     return value.id !=id
        // })
        ProductDel.splice(id,1)
        fs.writeFile(productDatabaseDir,JSON.stringify(ProductDel), err=>{
            if (err) throw err
            res.redirect('/admin-product')
        })
    })
})



router.get('/admin-update-product/:id', (req,res)=>{
    let id=req.params.id;
    fs.readFile(productDatabaseDir, (err,list)=>{
        let Products=JSON.parse(list);
        let newData=Products.filter((value)=>{
            return value.id==id;
        })
        res.render('admin/update-product', {product:newData})
    })
})

router.post('/update-product', (req,res)=>{
    let updateData=req.body;
    fs.readFile(productDatabaseDir, (err, list)=>{
        let Products=JSON.parse(list)
        let newProduct=[]
        for(let i=0; i<Products.length; i++){
            if(Products[i].id==updateData.id){
                newProduct[i]=updateData;
            }
            else{
                newProduct[i]=Products[i];
            }
        }
        fs.writeFile(productDatabaseDir,JSON.stringify(newProduct), (err)=>{
            if(err) throw "Error, Update not completed"
        })
        res.redirect('/admin-product')
    })
})

router.get('/user-view-product/:id', (req,res)=>{
    let id=req.params.id
    fs.readFile(productDatabaseDir, (err, list)=>{
        let Products=JSON.parse(list);
        let viewProduct=Products.filter((value)=>{
            return value.id==id;
        })
        res.render('users/view-product', {items:viewProduct})
    })
})



module.exports=router;