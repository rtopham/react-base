'use strict';

const express = require('express');
const braintree = require('braintree');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const MongoClient = require('mongodb').MongoClient;

const bcrypt = require('bcrypt');
const saltRounds = 10;

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

let users = [
    {
        id: 1,
        username: 'test@myhouse.com',
        password: 'asdf123'
    },
    {
        id: 2,
        username: 'test2',
        password: 'asdf12345'
    }
];

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

    db.collection('users').find({user_email:user.useremail}).limit(1).next()
    .then(loggedInUser=>{
//    if(!loggedInUser) res.status(404).json({ err: `No such user: ${user.useremail}` });
      if(!loggedInUser) res.status(404).json({ success:false, token: null, err: `Username or password is incorrect.`});
      else{ 
        bcrypt.compare(user.password, loggedInUser.user_password).then(passwordMatched=>{
        
        if(passwordMatched) {
            let token = jwt.sign({ id: user.id, username: user.useremail }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
            res.json({
                success: true,
                err: null,
                token
            });
            
        }
        else {
 //           console.log('Do we ever get to Else?')
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            });
        }        
        });
    
    }
    }).catch(error => {
     //  console.log(error);
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
    
                                db.collection('users').insertOne({ user_id: newID, first_name:'', last_name: '', user_name: '', user_email: user.useremail, user_password: hash, start_date: new Date(), expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), subscription_level: 1 }).then(result =>{



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

app.post('/signupOld', (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    users.push({
        id: 3,
        username: username,
        password: password
    });
//Put new user in database
//db.collection('users').remove({});
let newID;
db.collection('users').count().then (result => {
    newID=result+1;
//    console.log('New ID :'+ newID)

    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
    
    db.collection('users').insertOne({ user_id: newID, first_name:'', last_name: '', user_name: '', user_email: username, user_password: hash, start_date: new Date(), expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), subscription_level: 1 }).then(result =>{

        console.log('time is short');

    })   
    });

});

let token = jwt.sign({ id: users[2].id, username: users[2].username }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
res.json({
    sucess: true,
    err: null,
    token
});
});

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


app.get('/api/try', (req, res) => {
  const param = req.query.q;

 
  if (1==1) {
    res.json(
    {trydata: "What the hell did you think I would Say?"}    
    );
  } else {
    res.json([]);
  }
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
  });

  MongoClient.connect('mongodb://localhost/test').then(connection => {
	db=connection;  
  });

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
  });