'use strict';

const CloudFront = require('aws-sdk/clients/cloudfront');

const cloudFrontCache = (ctx, next) => {
    const canUpdateCloudfront = process.env.CAN_UPDATE_CLOUDFRONT,
        distributionId = process.env.DISTRIBUTION_ID;
    
    updateCloudFrontCache(canUpdateCloudfront, distributionId)
        .catch(err => console.log(err));

    return next();
};

const updateCloudFrontCache = (canUpdateCloudfront, distributionId) => new Promise((resolve, reject) => {
    if (canUpdateCloudfront && distributionId) {
        const cloudfront = new CloudFront({
            region: 'us-east-1',
            apiVersion: '2019-03-26',
        });

        const params = {
            DistributionId: distributionId,
            InvalidationBatch: {
                CallerReference: (new Date()).getTime().toString(),
                Paths: {
                    Quantity: '1',
                    Items: [
                        '/stats/',
                    ],
                },
            },
        };

        cloudfront.createInvalidation(params, function(err, data) {
            if (err) return reject(err);

            return resolve(data);
        });
    }

    return resolve();
});

module.exports = {
    cloudFrontCache,
};