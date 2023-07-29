

const mongoose = require('mongoose')

const URI = process.env.DB_STRING; // Setted in your .env file

//if localhost : const URI = 'mongodb://user:pass@hostname:27017/'

const connectDB = async() =>{
    await mongoose.connect(URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log('db connected successfully')
}

module.exports = connectDB