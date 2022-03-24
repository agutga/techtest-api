const LinkStatisticsCtrl = require('../data/linkStatisticsController');
const connectorUtils = require('../data/utils/connectorUtils');
const { validateGetOrDeleteLinkPayload } = require('./validations/linkValidations');

function formatLinkStatistics(statistics){
    if(statistics && statistics.length === 2 && statistics[1].length === 1)
    {
        return {
            data: statistics[0],
            ...statistics[1][0]
        }
    }
    else {
        return {
            data: []            
        }
    }
}

async function getLinkStatistics(payload){
    if(validateGetOrDeleteLinkPayload(payload)){        
        const linkStatisticsData = await LinkStatisticsCtrl.getStatisticsByLinkId(payload.linkId);

        await connectorUtils.endConnection();

        if(!linkStatisticsData){
            return {
                statusCode: 404,
                body: JSON.stringify({ errorMessage: 'Link statistics not found'})
            }
        }
        
        return {
            statusCode: 200,            
            body: JSON.stringify(formatLinkStatistics(linkStatisticsData))
        }        
    } else{
        //TODO Specify which validation rule has been broken
        return {
            statusCode: 500,
            body: JSON.stringify({ errorMessage: 'Validation error.'})
        }        
    }
}

module.exports = {
    getLinkStatistics
}