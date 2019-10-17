'use strict';

const { setNewDna } = require('./../../models/DnaSequence'),
    { mongoDBConnect, mongoDBdisconnect } = require('./../../models/connection');

describe('DNA data tests @component', () => {
    beforeAll(() => {
        return mongoDBConnect('localhost')
            .then(connectionData => console.log(connectionData))
            .catch(error => console.log(error));
    });

    afterAll(() => {
        return mongoDBdisconnect()
            .then(connectionData => console.log(connectionData))
            .catch(error => console.log(error));
    });

    test('getDnaStats should return the stats of the dna mock', () => {
        const dnaList = [ 'ATGCGA', 'CAGTGA', 'TTGTAA', 'AGATGA', 'CCACTA', 'TCAACT' ];
        
        return setNewDna(dnaList, false)
            .then(statsData => {
                expect(statsData).toHaveProperty('sequence');
                expect(statsData).toHaveProperty('isMutant', false);
            })
            .catch(error => console.log(error));
    });
});