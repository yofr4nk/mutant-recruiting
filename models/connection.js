const mongoose = require('mongoose');

const mongoDBConnect = (envHost) => new Promise((resolve, reject) => {
    const host = envHost || 'dbmongo';

    return mongoose.connect(`mongodb://${host}/mutants`, {
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