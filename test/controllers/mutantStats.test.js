'use strict';

const { buildDnaStats } = require('./../../controllers/mutantStats');
const { getDnaStats, setNewDna } = require('./../../models/DnaSequence');

jest.mock('./../../models/DnaSequence');

describe('DNA stats @unit', () => {
    test('buildDnaStats should build the summary of the DNA validations', () => {
        const dnaStats = buildDnaStats([ { _id: true, count: 20 }, { _id: false, count: 50 } ]);

        expect(dnaStats).toHaveProperty('count_mutant_dna', 20);
        expect(dnaStats).toHaveProperty('count_human_dna', 50);
        expect(dnaStats).toHaveProperty('ratio', 0.4);
    });

    test('getDnaStats should return the stats of the dna mock', () => {
        getDnaStats.mockImplementation(() => 
            Promise.resolve([ { _id: true, count: 20 }, { _id: false, count: 50 } ]));

        getDnaStats()
            .then(statsData => {
                expect(statsData).toEqual(expect.arrayContaining([
                    { _id: true, count: 20 }, { _id: false, count: 50 } 
                ]));
            });
    });

    test('getDnaStats should return the stats of the dna mock', () => {
        const dnaList = [ 'ATGCGA', 'CAGTGA', 'TTGTAA', 'AGATGA', 'CCACTA', 'TCAACT' ];

        setNewDna.mockImplementation(() => 
            Promise.resolve({
                sequence: dnaList,
                _id: '5da7f77e6583b40026cae858',
                isMutant: false,
            }));

        setNewDna(dnaList, false)
            .then(statsData => {
                expect(statsData).toMatchObject({
                    sequence: dnaList,
                    _id: '5da7f77e6583b40026cae858',
                    isMutant: false,
                });
            });
    });
});