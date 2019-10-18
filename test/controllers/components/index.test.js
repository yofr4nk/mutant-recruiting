'use strict';

const { setNewDna, DnaSequence, getDnaStats } = require('../../../models/DnaSequence'),
    { mongoDBConnect } = require('../../../models/connection'),
    { buildDnaStats, getStats } = require('../../../controllers/mutantStats'),
    { mutantDetecting } = require('../../../controllers/mutantDetecting');

describe('DNA data tests @component', () => {
    beforeAll(() => {
        return mongoDBConnect('localhost')
            .then(connectionData => console.log(connectionData))
            .catch(error => console.log(error));
    });

    beforeEach(() => {
        return DnaSequence
            .deleteMany({}).exec()
            .catch(err => console.log(err));
    });

    test('setNewDna should save and return the DNA sequence passed', () => {
        const dnaList = [ 'ATGCGA', 'CAGTGA', 'TTGTAA', 'AGATGA', 'CCACTA', 'TCAACT' ];
        
        return setNewDna(dnaList, false)
            .then(statsData => {
                expect(statsData).toHaveProperty('sequence');
                expect(statsData).toHaveProperty('isMutant', false);
            })
            .catch(error => console.log(error));
    });

    test('getDnaStats should return the stats of the last dna saved', () => {
        const dnaList = [ 'ATGCGA', 'CAGTGA', 'TTGTAA', 'AGATGA', 'CCACTA', 'TCAACT' ];
        
        return setNewDna(dnaList, false)
            .then(statsData => {
                expect(statsData).toHaveProperty('sequence');
                expect(statsData).toHaveProperty('isMutant', false);

                return getDnaStats()
                    .then((dnaStats) => {
                        expect(dnaStats)
                            .toEqual(expect.arrayContaining([ { _id: false, count: 1 } ]));
                    });
            })
            .catch(error => console.log(error));
    });

    test('getDnaStats should return the stats of the last dna saved', () => {
        const humanDnaList = [ 'ATGCGA', 'CAGTGA', 'TTGTAA', 'AGATGA', 'CCACTA', 'TCAACT' ],
            mutantDnaList = [ 'ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAAA', 'CCCCTA', 'TCAACG' ];

        return Promise.all([
            setNewDna(humanDnaList, false),
            setNewDna(mutantDnaList, true),
        ])
            .then(() => {
                return getDnaStats()
                    .then((dnaStats) => {
                        expect(dnaStats)
                            .toEqual(expect.arrayContaining([ 
                                { _id: false, count: 1 },
                                { _id: true, count: 1 },
                            ]));
                    });
            })
            .catch(error => console.log(error));
    });

    test('buildDnaStats should build the stats report with mutant and humans verificated', () => {
        const humanDnaList = [ 'ATGCGA', 'CAGTGA', 'TTGTAA', 'AGATGA', 'CCACTA', 'TCAACT' ],
            mutantDnaList = [ 'ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAAA', 'CCCCTA', 'TCAACG' ];

        return Promise.all([
            setNewDna(humanDnaList, false),
            setNewDna(mutantDnaList, true),
        ])
            .then(() => getDnaStats())
            .then((dnaStats) => buildDnaStats(dnaStats))
            .then((dnaStatsValidation) => {
                expect(dnaStatsValidation)
                    .toEqual(expect.objectContaining({
                        'count_mutant_dna': 1,
                        'count_human_dna': 1,
                        'ratio': 1,
                    }));
            })
            .catch(error => console.log(error));
    });

    test('buildDnaStats should build the stats report with mutant and humans verificated', () => {
        const humanDnaList = [ 'ATGCGA', 'CAGTGA', 'TTGTAA', 'AGATGA', 'CCACTA', 'TCAACT' ],
            mutantDnaList = [ 'ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAAA', 'CCCCTA', 'TCAACG' ];

        return Promise.all([
            setNewDna(humanDnaList, false),
            setNewDna(mutantDnaList, true),
        ])
            .then(() => getDnaStats())
            .then((dnaStats) => buildDnaStats(dnaStats))
            .then((dnaStatsValidation) => {
                expect(dnaStatsValidation)
                    .toEqual(expect.objectContaining({
                        'count_mutant_dna': 1,
                        'count_human_dna': 1,
                        'ratio': 1,
                    }));
            })
            .catch(error => console.log(error));
    });

    test('getStats should build the stats report with mutant and humans verificated', () => {
        const humanDnaList = [ 'ATGCGA', 'CAGTGA', 'TTGTAA', 'AGATGA', 'CCACTA', 'TCAACT' ],
            mutantDnaList = [ 'ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAAA', 'CCCCTA', 'TCAACG' ];

        return Promise.all([
            setNewDna(humanDnaList, false),
            setNewDna(mutantDnaList, true),
        ])
            .then(() => getStats({ body: {} }))
            .then((dnaStatsValidation) => {
                expect(dnaStatsValidation)
                    .toEqual(expect.objectContaining({
                        'count_mutant_dna': 1,
                        'count_human_dna': 1,
                        'ratio': 1,
                    }));
            })
            .catch(error => console.log(error));
    });

    describe('Request of mutant detection should validate is the DNA contains a mutant sequence and save it', () => {
        test('mutantDetecting should return Ok when the DNA sequence has enough equal sequences to be a mutant', () => {
            const dnaRequest = {
                request: {
                    body: {
                        dna: [ 'ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAAA', 'CCCCTA', 'TCAACG' ],
                    },
                },
                body: '',
                throw: () => {
                    throw new Error();
                },
            };
            
            return mutantDetecting(dnaRequest)
                .then(statsData => {
                    return expect(statsData).toBe('Ok');
                });
        });

        test('mutantDetecting should return an error when the DNA sequence has not enough equal sequences to be a mutant', () => {
            const dnaRequest = {
                request: {
                    body: {
                        dna: [ 'ATGCGA', 'CAGTGA', 'TTGTAA', 'AGATGA', 'CCACTA', 'TCAACT' ],
                    },
                },
                body: '',
                throw: (status, message) => {
                    throw message;
                },
            };
            
            return mutantDetecting(dnaRequest)
                .catch(err => expect(err).toBe('Is not a Mutant'));
        });
    });
});