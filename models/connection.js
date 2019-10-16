const mongoose = require('mongoose');

const mongoDBConnect = () => {
    return mongoose.connect('mongodb://dbmongo/mutants', { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, function (err) {
        if (err) throw err;

        console.log('Mongodb Successfully connected');
    });
};

module.exports = {
    mongoDBConnect,
};