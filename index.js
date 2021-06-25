const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s07ju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const servicesCollection = client.db("enfix").collection("services");
  const adminsCollection = client.db("enfix").collection("admin");
  const ordersCollection = client.db("enfix").collection("order");
  const reviewCollection = client.db("enfix").collection("review");

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new event: ', newService);
    servicesCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/loadServices', (req, res) => {
    servicesCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    console.log('adding new admin: ', newAdmin);
    adminsCollection.insertOne(newAdmin)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/loadSingleService/:id', (req, res) => {
    servicesCollection.find({id: req.params.id})
    .toArray((err, service) => {
      res.send(service);
    })
  })
  
  app.get('/loadAllBookings', (req, res) => {
    ordersCollection.find()
    .toArray((err, service) => {
      res.send(service);
    })
  })

  app.post("/addOrderedService", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then((result) => {
      res.send(result.insertedCount > 0);
    });
  });




  app.patch("/updateOrderedService", (req, res) => {
      
    const orderId = req.body.id;
    console.log(orderId);
    const orderStatus = req.body.status;
    console.log(orderStatus);

    ordersCollection
    .updateOne(
      {id: orderId},
      {
        $set: {serviceStatus: orderStatus},
      })
    .then((result) => {
      res.send(result.modifiedCount > 0);
    });
  });




  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('adding new event: ', newReview);
    reviewCollection.insertOne(newReview)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/loadReviews', (req, res) => {
    reviewCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
