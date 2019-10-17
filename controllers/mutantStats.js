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
        count_mutant_dna: statsData[0].count,
        count_human_dna: statsData[1].count,
        ratio: statsData[0].count / statsData[1].count,
    };

    return dnaStatsValidation;
};

module.exports = {
    getStats,
    buildDnaStats,
};