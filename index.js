const express = require('express')        //  library to create apps
const logger = require('morgan')          // logs every endpoint
const ejs = require('ejs')                // embedded javascript
const bodyParser = require('body-parser') // to parse the body in the request
const admin = require('firebase-admin') // service firebase
const analizer = require('./src/analizer')  //// analizer






const app = express()

// server firebase
// firebase > settings >> Service accounts
const serviceAccount = require('./auth-99adf-firebase-adminsdk-navvq-246070dc0d.json')

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://auth-99adf.firebaseio.com"
});
// config
let port = process.env.PORT || 8080


// engine template
app.set('view engine','ejs') // instead of use normal html, use ejs
app.set('views',__dirname + '/views') // static files (public folder)







//middlewares
app.use(bodyParser.json()) //parse the input to json
app.use(bodyParser.urlencoded({extended:false}))
app.use(logger('dev')) //logs
app.use(express.static('views')) // static files (public folder)


      // id token
      // check if the user is logged in
      // if it is, attach to the request
      // else ...
const checkAuth = (request,response,next) =>{
    if (!(request.headers && request.headers.authorization)) {
     return res.status(400).json({
       status: 'not logged in'
     });
   }

   let idToken = request.headers.authorization

   admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
      let id = decodedToken.uid;
      request.id = id
      next()

  }).catch(function(error) {
      console.log(error)
      return response.status(500).json({
          status: 'invalid token'
      });
  });

}





app.get('/',(request,response)=>{
  response.render('home.ejs')
})





// to save an user
app.post('/user/signin',(request,response)=>{
    let parameters = request.body;

    if(analizer.findUser(parameters.userId)){
        return response.json({'status':'ok'});
    }else{
        analizer.addUser(parameters.userId,parameters.name);
        return response.json({message:'user added'})
    }
})





app.get('/user/videogames/buy/:id', (request,response)=>{
    let id = request.params.id
    let user = analizer.findUser(id)
    if(user == undefined)
        return response.json([])

    let videogames = analizer.queryvideoGamesToBuy(id)
    return response.json(videogames);
});





app.get('/user/videogames/sell/:id', (request,response)=>{
    let id = request.params.id
    let user = analizer.findUser(id)
    if(user == undefined)
        return response.json([])
    let videogames = analizer.queryvideoGamesToSell(id)
    return response.json(videogames);
});



app.post('/user/videogames/sell',checkAuth,(request,response)=>{
    // params (name  video game, and price )

    let parameters = request.body;
    let name = parameters.name;
    let price = parameters.price;
    let userId = request.id;

    analizer.addVideoGameToSell(name,price,userId)
    return response.json({message:'videogame added'})
})


app.post('/user/videogames/buy',checkAuth,(request,response)=>{
    // params (name  video game, and price )
    let parameters = request.body;
    let name = parameters.name;
    let price = parameters.price;
    let userId = request.id;
    analizer.addVideoGameToBuy(name,price,userId)
    return response.json({message:'videogame added'})
})

// callback
app.listen(port,()=>{
  console.log(`Running in the port ${port}`)
})
