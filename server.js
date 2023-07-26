const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRouter');
const AppRoutes = require('./routes/appRouter');
const versionRoutes = require('./routes/versionRouter');
const testRoutes = require('./routes/testRoute');
const { mongoose } = require('mongoose');

dotenv.config();  
const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/user',userRoutes);
app.use('/app', AppRoutes);
app.use('/version', versionRoutes);
app.use('/test', testRoutes);

app.get('/',(req,res) => {
    res.send('Server is ready')
})

// MongoD
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URL;
mongoose.connect(uri)
  .then(()=> console.log('You successfully connected to MongoDB!!!!.........'))
  .catch(err => console.log(err));

app.listen(port,() => {console.log(`Server started on Port ${port}`)})