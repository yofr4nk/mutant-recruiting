'use strict';

const { 
    hasEqualSequence,
    isAllowedDna,
    getSequencesQuantity,
    getVerticalSequences,
    getObliques,
    setDnaItem,
} = require('./../../controllers/mutantDetecting');

describe('Mutants detection tests @unit', () => {
    test('isAllowedDna should validate if the DNA character supplied is allowed', () => {
        expect(isAllowedDna('A')).toBeTruthy();
        expect(isAllowedDna('T')).toBeTruthy();
        expect(isAllowedDna('C')).toBeTruthy();
        expect(isAllowedDna('G')).toBeTruthy();
    });

    test('isAllowedDna should validate if the DNA character supplied is not allowed', () => {
        expect(isAllowedDna('a')).toBeFalsy();
        expect(isAllowedDna('y')).toBeFalsy();
        expect(isAllowedDna('M')).toBeFalsy();
        expect(isAllowedDna('L')).toBeFalsy();
    });

    test('hasEqualSequence should validate if the dna has an equal sequence of four character', () => {
        expect(hasEqualSequence('CCCCTA')).toBeTruthy();
        expect(hasEqualSequence('TAAAAC')).toBeTruthy();
        expect(hasEqualSequence('ACTTTT')).toBeTruthy();
    });

    test('hasEqualSequence should validate if the dna has not an equal sequence of four character', () => {
        expect(hasEqualSequence('CCCGTA')).toBeUndefined();
        expect(hasEqualSequence('TAAAgC')).toBeUndefined();
        expect(hasEqualSequence('ACTTGT')).toBeUndefined();
    });

    test('getSequencesQuantity should returns how many equal sequences has a list of DNA', () => {
        expect(getSequencesQuantity([ 'ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCAACG' ])).toBe(1);
        expect(getSequencesQuantity([ 'ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAAA', 'CCCCTA', 'TCAACG' ])).toBe(2);
        expect(getSequencesQuantity([ 'ACTTTT', 'CAGTGC', 'TTATGT', 'AGAAAA', 'CCCCTA', 'TCAACG' ])).toBe(3);
        expect(getSequencesQuantity([ 'ACTTTC', 'CAGTGC', 'TTATGT', 'AGATAA', 'CCGCTA', 'TCAACG' ])).toBe(0);
    });

    test('getSequencesQuantity should returns an error when the dna is not an array', () => {
        expect(getSequencesQuantity.bind(this, {})).toThrow();
        expect(getSequencesQuantity.bind(this, '')).toThrow();
        expect(getSequencesQuantity.bind(this, 1)).toThrow();
        expect(getSequencesQuantity.bind(this, true)).toThrow('The parameter passed must be an array');
    });

    test('getSequencesQuantity should returns an error when the dna is undefined', () => {
        expect(getSequencesQuantity).toThrow();
    });

    test('getVerticalSequences should build a new array with vertical intersections between the items', () => {
        const verticalSequences = getVerticalSequences([ 'ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCAACG' ]);
        
        expect(verticalSequences).toMatchObject([ 'ACTACT', 'TATGCC', 'GGAACA', 'CTTACA', 'GGGGTC', 'ACTGAG' ]);
    });

    test('Should returns one equal sequence of DNA from the vertical intersections', () => {
        const verticalSequences = getVerticalSequences([ 'ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCAACG' ]);
        
        expect(verticalSequences).toMatchObject([ 'ACTACT', 'TATGCC', 'GGAACA', 'CTTACA', 'GGGGTC', 'ACTGAG' ]);
        expect(getSequencesQuantity(verticalSequences)).toBe(1);
    });

    test('Should returns one equal sequence of DNA from the vertical intersections', () => {
        const verticalSequences = getVerticalSequences([ 'ATGTGA', 'CAGTGC', 'TTATGT', 'AGATGG', 'CCCCTA', 'TCACTG' ]);

        expect(verticalSequences).toMatchObject([ 'ACTACT', 'TATGCC', 'GGAACA', 'TTTTCC', 'GGGGTT', 'ACTGAG' ]);
        expect(getSequencesQuantity(verticalSequences)).toBe(2);
    });

    test('Should avoid an equal sequence when a character is not allowed', () => {
        const verticalSequences = getVerticalSequences([ 'ATGTGA', 'CAGTGC', 'TTAtGT', 'AGATGG', 'CCCCTA', 'TCACTG' ]);

        expect(verticalSequences).toMatchObject([ 'ACTACT', 'TATGCC', 'GGAACA', 'TTtTCC', 'GGGGTT', 'ACTGAG' ]);
        expect(getSequencesQuantity(verticalSequences)).toBe(1);
    });

    test('getObliques should build a new array with all the diagonals found', () => {
        const obliqueSequences = getObliques([ 'ACTACT', 'TATGCC', 'GGAACA', 'TTTTCC', 'GGGGTT', 'ACTGAG' ]);
        
        expect(obliqueSequences).toHaveLength(22);
        expect(obliqueSequences).toEqual(expect.arrayContaining([ 
            'A', 'GC', 'TGT', 'GTGG', 'TGTGA', 'AAATTG', 'CTACT',
            'TGCC', 'ACA', 'CC', 'T', 'A', 'CT', 'TAG', 'ATGT',
            'CGATG', 'TCATGA', 'CCTGC', 'ACGT', 'CTG', 'TA', 'G',
        ]));
    });

    test('getObliques should build a new array with all the diagonals found', () => {
        const obliqueSequences = getObliques([ 'ACT', 'GCE', 'ATG' ]);
        
        expect(obliqueSequences).toHaveLength(10);
        expect(obliqueSequences).toEqual(expect.arrayContaining([
            'A', 'GT', 'ACG', 'CE', 'T',
            'G', 'ET', 'TCA', 'CG', 'A',
        ]));
    });

    test('setDnaItem should insert the DNA value at the specific position', () => {
        const dnaArray = [ [], [], [], [] ],
            newDnaArray = setDnaItem(dnaArray, 0, 'A', 0);
        
        expect(newDnaArray).toEqual(expect.arrayContaining([ [ 'A' ], [], [], [] ]));
    });

    test('setDnaItem should return an error if the param supplied is not an array', () => {
        expect(setDnaItem.bind(this, null, 0, 'A', 0)).toThrow('The obliqueBox supplied must be an array');
        expect(setDnaItem.bind(this, {}, 0, 'A', 0)).toThrow();
        expect(setDnaItem.bind(this, 0, 0, 'A', 0)).toThrow();
        expect(setDnaItem.bind(this, '', 0, 'A', 0)).toThrow();
    });
});