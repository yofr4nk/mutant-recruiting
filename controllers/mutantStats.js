'use strict';

const { getDnaStats } = require('./../models/DnaSequence');

const getStats = (ctx) => {
    return getDnaStats()
        .then(statsData => {
            return ctx.body = buildDnaStats(statsData);
        })
        .catch(err => {
            return ctx.throw(500, err);
        });
};

const buildDnaStats = (statsData) => {
    const dnaStatsValidation = {
            count_mutant_dna: 0,
            count_human_dna: 0,
            ratio: 0,
        },
        countMutantDna = statsData.find(stats => stats._id),
        countHumanDna = statsData.find(stats => !stats._id);

    if (countMutantDna)
        dnaStatsValidation['count_mutant_dna'] = countMutantDna.count;

    if (countHumanDna)
        dnaStatsValidation['count_human_dna'] = countHumanDna.count;
    
    dnaStatsValidation['ratio'] = getRatio(dnaStatsValidation['count_mutant_dna'], dnaStatsValidation['count_human_dna']);

    return dnaStatsValidation;
};

const getRatio = (countMutantDna, countHumanDna) => {
    const ratio = countMutantDna / countHumanDna;
    
    if (!isFinite(ratio))
        return 0;
    else
        return ratio;
};

module.exports = {
    getStats,
    buildDnaStats,
    getRatio,
};