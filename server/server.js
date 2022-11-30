require('./Puerto/config');
const express =  require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


app.use(bodyParser.json());
app.use(cors());
app.get('/', function (req, res) {
  res.send('<h1>Bienvenido a mi (localhost)</h1>');
});

app.use('/api',require('./Routes/index'));
// mongodb+srv://cluster0.titcwjb.mongodb.net/myFirstDatabase" --apiVersion 1 --username Nayeli
// mongodb+srv://Leonardo:Leoespro217@spotyficopy.ptmc72m.mongodb.net/?retryWrites=true&w=majority
// mongodb+srv://cluster0.titcwjb.mongodb.net/myFirstDatabase 
mongoose.connect('mongodb+srv://Nayeli:Capgemini21@cluster0.titcwjb.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true
  }, (err, res) => {
    if (err) throw err;
    console.log('BD Nutritec');
  });
  
  app.listen(process.env.PORT, () => {//se selecciona el puerto en el que va a trabajar el servidor, preferible el puerto 3000
    console.log('El servidor esta en linea por el puerto', process.env.PORT);
  });