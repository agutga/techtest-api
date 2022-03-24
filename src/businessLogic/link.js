const LinkCtrl = require('../data/linkController');
const connectorUtils = require('../data/utils/connectorUtils');
const { validateGetOrDeleteLinkPayload, validateSubmitLinkPayload } = require('./validations/linkValidations');

const getShortenedUrl = require('./utils/shortened-url');

async function getLink(payload){
    if(validateGetOrDeleteLinkPayload(payload)){        
        const linkData = await LinkCtrl.getLinkById(payload.linkId);

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

async function submitLink(payload){
    if(validateSubmitLinkPayload(payload)){        
        const shortenedUrl = await getRandomShortenedUrl();        

        const linkData = await LinkCtrl.submitLink(payload.linkUrl, shortenedUrl);    
        console.log(linkData);

        await connectorUtils.endConnection();        

        if(!linkData){
            return {
                statusCode: 500,
                body: JSON.stringify({ errorMessage: 'Error trying to submit a new link.'})
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

async function deleteLink(payload){
    if(validateGetOrDeleteLinkPayload(payload)){        
        const linkData = await LinkCtrl.deleteLinkById(payload.linkId);

        await connectorUtils.endConnection();

        if(!linkData){
            return {
                statusCode: 404,
                body: JSON.stringify({ errorMessage: 'Link not found.'})          
            }
        }
        
        return {
            statusCode: 200            
        }        
    } else{
        //TODO Specify which validation rule has been broken
        return {
            statusCode: 500,         
            body: JSON.stringify({ errorMessage: 'Validation error.'})
        }        
    }
}

// Generates a random shortened url and prevent it to be already used by checking in DB.
async function getRandomShortenedUrl(){
    let shortenedUrl = getShortenedUrl();        
    
    let alreadyExistUrl = await LinkCtrl.getLinkByShortenedUrl(shortenedUrl);

    await connectorUtils.endConnection();

    while(alreadyExistUrl && alreadyExistUrl.length > 0){        
        shortenedUrl = getShortenedUrl();        
    
        alreadyExistUrl = await LinkCtrl.getLinkByShortenedUrl(shortenedUrl);

        await connectorUtils.endConnection();
    }

    return shortenedUrl;
}

async function getAllLinks(payload){
    const linkData = await LinkCtrl.getAllLinks();

    await connectorUtils.endConnection();    
    
    return {
        statusCode: 200,            
        body: JSON.stringify(linkData)
    }  
}

module.exports = {
    getLink,
    submitLink,
    deleteLink,
    getAllLinks
}