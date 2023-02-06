const mongoose = require('mongoose')
const {database} = require('./keys')

mongoose.set('strictQuery', false);
mongoose.connect(database.URI,{
    useNewUrlParser: true,
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err));