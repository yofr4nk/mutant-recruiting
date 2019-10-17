const mongoose = require('mongoose');

const mongoDBConnect = (hostDatabase) => new Promise((resolve, reject) => {
    return mongoose.connect(`mongodb://${hostDatabase}/mutants`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, function (err) {
        if (err) return reject(err);

        return resolve('Mongodb Successfully connected');
    });
});

module.exports = {
    mongoDBConnect,
};