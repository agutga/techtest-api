const LinkEventCtrl = require('../data/linkEventController');
const connectorUtils = require('../data/utils/connectorUtils');
const { validateSubmitLinkEventPayload } = require('./validations/linkValidations');

async function submitLinkEvent(payload){
    console.log(payload);
    if(validateSubmitLinkEventPayload(payload)){        
        const linkData = await LinkEventCtrl.submitLinkEvent(payload.shortenedLinkUrl);

        await connectorUtils.endConnection();   
        
        if(!linkData){
            return {
                statusCode: 404,
                body: JSON.stringify({ errorMessage: 'Link not found.'})
            }
        }
        
        return {
            statusCode: 200,            
            body: JSON.stringify(linkData)
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
    submitLinkEvent
}