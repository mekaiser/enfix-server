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

  app.get('/isAdminLoggedIn/:email', (req, res) => {
    adminsCollection.find({adminEmail: req.params.email})
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.post('/addService', (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService)
    .then(result => {
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
    adminsCollection.insertOne(newAdmin)
    .then(result => {
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

  app.get('/loadAllBookingsByEmail/:email', (req, res) => {
    ordersCollection.find({email: req.params.email})
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

  app.patch('/updateOrderedService/:id', (req, res) => {
    const updatedStatus = req.body.status;
    const paymentId = req.body.paymentId;
    ordersCollection
    .updateOne(
      { paymentId: paymentId },
      {
        $set: { serviceStatus: updatedStatus },
      }
    )
    .then((result) => {
      res.send(result.modifiedCount > 0);
    })
  })

  app.get('/loadSingleOrder/:id', (req, res) => {
    ordersCollection.find({serviceId: req.params.id})
    .toArray((err, service) => {
      res.send(service);
    })
  })


  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/loadReviews', (req, res) => {
    reviewCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.delete("/removeService/:id", (req, res) => {
    servicesCollection.deleteOne({ id: req.params.id }).then((documents) => {
      res.send(documents.deletedCount > 0);
    });
  });

});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
