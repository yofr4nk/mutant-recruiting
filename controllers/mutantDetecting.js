'use strict';

const flatten = require('lodash/flatten'),
    { setNewDna } = require('./../models/DnaSequence');

const mutantDetecting = (ctx) => {
    const dnaList = ctx.request.body.dna;

    return isMutant(dnaList)
        .then(mutantValidation => {
            return setNewDna(dnaList, mutantValidation)
                .then(() => {
                    if (mutantValidation)
                        return ctx.body = 'Ok';
                    else
                        return ctx.throw(403, 'Is not a Mutant');
                })
                .catch(err => ctx.throw(500, err));
        });
};

const isMutant = (dnaList) => {
    const verticalSequence = getVerticalSequences(dnaList);
    const obliqueSequences = getObliques(dnaList);

    return Promise.all([
        getSequencesQuantity(dnaList),
        getSequencesQuantity(verticalSequence),
        getSequencesQuantity(obliqueSequences),
    ]).then(sequences => {
        const detectionSummary = getDetectionSummary(sequences);

        return (detectionSummary > 1);
    });
};

const getDetectionSummary = (sequences) => {
    return sequences.reduce((current, next) => current + next, 0);
};

const isAllowedDna = (dnaItem) => {
    const allowedDna = 'ATCG';

    return (allowedDna.indexOf(dnaItem) !== -1);
};

const getVerticalSequences = (dnaList) => {
    const verticalBox = [];

    for (let index=0;index < dnaList.length; index++) {
        const dnaSequence = dnaList[index];

        for (let itemIndex = 0;itemIndex < dnaSequence.split('').length; itemIndex++) {
            const dnaItem = dnaSequence[itemIndex];

            if (verticalBox[itemIndex])
                verticalBox[itemIndex] += dnaItem;
            else
                verticalBox[itemIndex] = dnaItem;
        }
    }

    return verticalBox;
};

const getObliques = (dnaList) => {
    const dnaLength = dnaList.length;
    let obliqueBox = [ [], [], [], [] ];
    
    for (let dnaIndex = 0;dnaIndex < dnaLength; dnaIndex++) {
        const dnaItems = dnaList[dnaIndex].split('');

        for (let itemIndex = 0;itemIndex < dnaItems.length; itemIndex++) {
            let intersectionIndex = itemIndex + dnaIndex;
            
            //building diagonals moving from center to the right or left side
            const middleDownLeft = dnaList[intersectionIndex][itemIndex],
                middleDownRight = dnaList[intersectionIndex][(dnaItems.length - 1) - itemIndex];

            obliqueBox = [ ...setDnaItem(obliqueBox, dnaIndex, middleDownLeft, 0) ];
            obliqueBox = [ ...setDnaItem(obliqueBox, dnaIndex, middleDownRight, 1) ];
            
            if ((intersectionIndex + 1) > (dnaItems.length - 1))
                break;

            //building diagonals moving towards to high corners
            const toUpRight = dnaList[itemIndex][intersectionIndex + 1],
                toUpLeft = dnaList[itemIndex][dnaItems.length - itemIndex - dnaIndex - 2];

            obliqueBox = [ ...setDnaItem(obliqueBox, dnaIndex, toUpRight, 2) ];
            obliqueBox = [ ...setDnaItem(obliqueBox, dnaIndex, toUpLeft, 3) ];
        }
    }

    return flatten(obliqueBox);
};

const setDnaItem = (obliqueBox, dnaIndex, dnaValue, obliqueIndex) => {
    if (!Array.isArray(obliqueBox))
        throw new Error('The obliqueBox supplied must be an array');

    if (obliqueBox[obliqueIndex][dnaIndex])
        obliqueBox[obliqueIndex][dnaIndex] += dnaValue;
    else
        obliqueBox[obliqueIndex][dnaIndex] = dnaValue;

    return obliqueBox;
};

const getSequencesQuantity = (params) => {
    if (!Array.isArray(params))
        throw new Error('The parameter passed must be an array');

    let sequenceAccount = 0;
    
    for (let index = 0;index < params.length; index++) {
        const dnaSequence = params[index];

        if (hasEqualSequence(dnaSequence))
            sequenceAccount += 1;
    }

    return sequenceAccount;
};

const hasEqualSequence = (dnaSequence) => {
    const dnaSequenceList = dnaSequence.split(''),
        dnaAccount = {};
    let lastItem;
    
    for (let index = 0;index < dnaSequenceList.length; index++) {
        const dnaItem = dnaSequenceList[index];

        if (!isAllowedDna(dnaItem))
            return;

        if (lastItem === dnaItem)
            dnaAccount[dnaItem] += 1;
        else {
            dnaAccount[dnaItem] = 1;
            lastItem = dnaItem;
        }

        if (dnaAccount[dnaItem] > 3)
            return true;
    }
};

module.exports = {
    isMutant,
    isAllowedDna,
    getSequencesQuantity,
    hasEqualSequence,
    getVerticalSequences,
    getObliques,
    setDnaItem,
    getDetectionSummary,
    mutantDetecting,
};