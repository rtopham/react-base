'use strict';

const express = require('express');
const braintree = require('braintree');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const Models = require('./models');
const md5 = require('md5');
const async = require('async');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const upload = multer({dest:path.join(__dirname, 'client/public/upload/temp')});


const app = express();

app.use(bodyParser.json()); 


//Adding things for Auth

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

const jwtMW = exjwt({
    secret: 'keyboard cat 4 ever'
});

///

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "m538gqnp4fycpbsx",
    publicKey: "vsvk84tk3r4npxcb",
    privateKey: "43081bdbc7f465b92e266de5919caeae"
});

let db;

app.set('port', (process.env.API_PORT || 3001));

app.get("/client_token", function (req, res) {
    gateway.clientToken.generate({}, function (err, response) {
      res.json(response.clientToken);
    });
  });

  app.post("/checkout", (req, res) => {
 console.log(req.body)
  var nonceFromTheClient = req.body.nonce;
    // Use payment method nonce 
    
    gateway.transaction.sale({
        amount: "10.35",
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          res.json(result);
      });



  });

//for Auth

app.post('/login', (req, res) => {

    const user=req.body;
    let obj_id;

    db.collection('users').find({user_email:user.useremail}).limit(1).next()
    .then(loggedInUser=>{
      if(loggedInUser) obj_id= loggedInUser._id;
//    if(!loggedInUser) res.status(404).json({ err: `No such user: ${user.useremail}` });
      if(!loggedInUser) res.status(404).json({ success:false, token: null, err: `Username or password is incorrect.`});
      else{ 
        bcrypt.compare(user.password, loggedInUser.user_password).then(passwordMatched=>{
        
        if(passwordMatched) {
            let user_id=loggedInUser.user_id;
            let token = jwt.sign({ _id: obj_id, username: user.useremail }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
            res.json({
                success: true,
                err: null,
                token
            });
            
        }
        else {
 
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            });
        }        
        });
    
    }
    }).catch(error => {
     
       res.status(500).json({ message: `Internal Server Error: ${error}` }); 
    });
    
    
    });

app.post('/signup', (req, res) => {
    const user = req.body;
    db.collection('users').find({user_email:user.useremail}).limit(1).next()
    .then(userExists=>{

              if(userExists) res.status(401).json({ success:false, token: null, err: `Username already exists.`});
              else{

//Put new user in database
//db.collection('users').remove({});
let newID;
                        db.collection('users').count().then (result => {
                        newID=result+1;
                        //    console.log('New ID :'+ newID)
                            bcrypt.hash(user.password, saltRounds, function(err, hash) {
                        // Store hash in your password DB.
    
                                db.collection('users').insertOne({ user_id: newID, first_name:'', last_name: '', user_name: '', user_email: user.useremail, user_password: hash, date_created: new Date(), start_date: new Date(), expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), subscription_level: 0 }).then(result =>{



                                })// end result of insertOne   
                            });//end bcrypt

                        });//end result of count

                let token = jwt.sign({ id: newID, username: user.useremail}, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
                res.json({
                    success: true,
                    err: null,
                    token
                }); //end res.json
                   }//end of else
    }); //end userExists
}); //end app.post


app.get('/', jwtMW /* Using the express jwt MW here */, (req, res) => {
    res.send('You are authenticated'); //Sending some response when authenticated
});

// Error handling 
app.use(function (err, req, res, next) {
 
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});


///

  app.get('/api/images', (req, res) => {
    const param = req.query.q;
  //  console.log("hit this");
  const ViewModel = {
    images: []
    };  

    Models.Image.find({},{},{sort: {timestamp: -1}},(err,images)=>{
        if(err) { throw err;}
        ViewModel.images = images;
        res.json(ViewModel)
    })
    
  });

  app.get('/api/images/:id/gallery', (req, res) => {
    const param = req.params.id;
  
  const ViewModel = {
    images: []
    };  
  

    Models.Image.find({user_id: ObjectId(param) },{},{sort: {timestamp: -1}},(err,images)=>{
        if(err) { throw err;}
        ViewModel.images = images;
        res.json(ViewModel)
    })
    
  });


app.get('/api/images/:id', (req, res) => {
    const param = req.params.id;
    console.log(param);
  
  const ViewModel = {
  
          image: {},
          comments: []
  };

  Models.Image.findOne({
      _id: ObjectId(param)
  },
  (err,image)=>{
      if(err) {throw err;}
      if (image){ 
        image.views = image.views+1;
        ViewModel.image = image;
        image.save();  

  Models.Comment.find({image_id: ObjectId(param)}, {}, {
      sort: {
          'timestamp': 1
      }
  },
  (err, comments) => {
      if (err) {throw err;}
    
//     ViewModel.comments = comments.slice(0);
       ViewModel.comments = comments;
//     console.log(ViewModel);
     res.json(ViewModel)

  })

    }else res.json([]);

  });
  });






app.get('/api/images/:id/like', (req, res) => {
    const param = req.params.id;
//    console.log('got here');
//    console.log(param);
  
  const ViewModel = {
  
          image: {},
          comments: []
  };

  Models.Image.findOne({
      _id: ObjectId(param)
  },
  (err,image)=>{
      if(!err && image) {
        image.likes = image.likes+1;
        image.save((err)=>{
        if (err){
            res.json(err);
        } else {
            res.json({likes: image.likes});
        }
    });
}
  });
});


app.get('/api/images/:id/delete', (req, res) => {
    const param = req.params.id;
//    console.log('got here');
//    console.log(param);
  
Models.Image.findOne({
      _id: ObjectId(param)
  },
  (err,image)=>{
      if(!err && image) {
        fs.unlink(path.resolve(`./client/public/upload/${image.filename}`),
        (err) =>{
            if (err) {throw err};
            Models.Comment.remove({image_id: image._id},
                (err) =>{
                    image.remove((err) =>{
                        if(!err) {
                            res.json(true);
                        }else {
                            res.json(false);
                        }
                    });
                });
        });
    }
});
});


app.get('/api/stats', (req, res) => {
      const stats = {
      
              images: 0,
              comments: 0,
              views: 0,
              likes: 0,
              popular: [],
              latestComments: [],
              latestComments2: []
      };
    
async.parallel([
(next)=>{
    Models.Image.count({}, next);
},
(next) =>{
    Models.Comment.count({}, next);
},
(next) => {
    Models.Image.aggregate([{
        $group: {
            _id: "1",
            viewsTotal: {$sum: "$views"}
        }
        }], (err, result) => {
            let viewsTotal = 0;
            if (result.length >0) {
                viewsTotal += result[0].viewsTotal;
                
            }
            
            next(null,viewsTotal)
            })
},

(next) => {
    Models.Image.aggregate([{
        $group: {
            _id: "1",
            likesTotal: {$sum: "$likes"}
        }
        }], (err, result) => {
            let likesTotal = 0;
            if (result.length >0) {
                likesTotal += result[0].likesTotal;
                
            }
            
            next(null,likesTotal)
            })
},

(next) => {
    Models.Image.find({}, {}, {limit: 9, sort: {likes: -1}},
     (err, images) => {
            if (err) throw err;
            
            next(null,images)
            })
},

(next) => {
    Models.Comment.aggregate([{
        
        $sort: {timestamp: -1},
        
        },
        {$limit: 4},
    {$lookup: {
       localField: "image_id",
       from: "images",
       foreignField: "_id",
       as: "image" 
    }}], (err, comments) => {
           if (err) throw err;
            
           next(null,comments)
            })
}


], (err, results) =>{
  
        stats.images = results[0];
        stats.comments =results[1];
        stats.views = results[2];
        stats.likes = results[3];
        stats.popular = results[4];
        stats.latestComments = results[5];
        
   res.json(stats);
})
});


app.post('/api/images/:id/comment', upload.array(), (req, res) => {
    const param = req.params.id;
//    console.log('Inside Comment');
//    console.log(param);
//    console.log(req.body);
  
  Models.Image.findOne({
      _id: ObjectId(param)
  },
  (err,image)=>{
      if(!err && image) {
        let newComment = new Models.Comment(req.body); 
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        newComment.save((err, comment)=>{
        if (err){
            res.json(err);
        } else {
            res.json({comment: comment});
        }
    });
}
  });
});    

app.post("/api/images", upload.single('file'), (req, res, next) => {
//console.log('getting here');
//console.log(req.file);
let imgUrl = '';
const saveImage = () =>{
    let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
//    console.log('inside saveImage');
    for(let i=0; i<6; i+=1){
        imgUrl += possible.charAt(Math.floor(Math.random()*possible.length));
    }

    Models.Image.find({filename: imgUrl}, (err, images)=>{
        if(images.length>0){
            saveImage();
        }else{

                let tempPath = req.file.path;
                let ext = path.extname(req.file.originalname).toLowerCase();
                let targetPath = path.resolve(`./client/public/upload/${imgUrl}${ext}`);
                //console.log(ext);
                if(ext ==='.png' || ext ==='.jpg' || ext === '.jpeg' || ext === '.gif'){
                fs.rename(tempPath,targetPath, (err) => {

                    if (err) throw err;

                    var newImg = new Models.Image({
                        user_id: req.body.user_id,
                        title: req.body.title,
                        filename: imgUrl + ext,
                        description: req.body.description
                    });
                    newImg.save(function(err, image) {
                        if(err) console.log(err);
//                        console.log('Successfully inserted image: ' + image.filename);
                       // res.redirect('/images/' + image.uniqueId);
                    });



                //  res.redirect(`/images/${imgUrl}`);
                    res.status(200).json({success: "File Uploaded!"})

                    

                });
                } else{
                    fs.unlink(tempPath, (err) =>{
                        if (err) throw err;
                        res.status(500).json({error: "Only image files are allowed"});
                    });
                }

         }
    })
};
saveImage();
     });


app.get('*', (req, res) => {
//    console.log("hit that");
    res.sendFile(path.resolve('client/public/index.html'));
  });

  MongoClient.connect('mongodb://localhost/test').then(connection => {
	db=connection;  
  });

  mongoose.connect('mongodb://localhost/test');
    mongoose.connection.on('open', function() {
    console.log('Mongoose connected.');
});


app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
  });