const mongoose = require('mongoose');

delete mongoose.connection.models['DnaSequence'];
const DnaSequenceSchema = new mongoose.Schema({
    'sequence': {
        type: Array,
    },
    'isMutant': {
        type: Boolean,
    },
});

const DnaSequence = mongoose.model('DnaSequence', DnaSequenceSchema);

const setNewDna = (dnaList, mutantValidation) => new Promise((resolve, reject) => {
    DnaSequence.create({ 
        sequence: dnaList, 
        isMutant: mutantValidation,
    }, function (err, dnaSequenceData) {
        if (err)
            return reject(err);

        return resolve(dnaSequenceData);
    });
});

const getDnaStats = () => new Promise((resolve, reject) => {
    DnaSequence.aggregate([
        { $group: { _id: '$isMutant', count: { $sum: 1 } } },
    ], function (err, dnaSequenceData) {
        if (err)
            return reject(err);

        return resolve(dnaSequenceData);
    });
});

module.exports = {
    DnaSequence,
    setNewDna,
    getDnaStats,
};