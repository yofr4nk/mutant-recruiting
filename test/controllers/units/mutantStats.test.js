'use strict';

const { getRatio } = require('../../../controllers/mutantStats');

describe('mutantStats tests validation @unit', () => {
    test('getRatio should return the ratio as zero when the average is not a valid number', () => {
        expect(getRatio(1, 0)).toBe(0);
        expect(getRatio(0, 0)).toBe(0);
        expect(getRatio(1, 0)).toBe(0);
        expect(getRatio(20, 0)).toBe(0);
        expect(getRatio('', '')).toBe(0);
    });
});