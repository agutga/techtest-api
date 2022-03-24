/**
 * Validates if an object passed by parameter contains a number type linkId property.
 * @param {object} payload 
 * @returns 
 */
function validateGetOrDeleteLinkPayload(payload){
    if(!payload || !payload.linkId || (payload.linkId && isNaN(payload.linkId)))
    {
        return false;
    }

    return true;
}

/**
 * Validates if an object passed by parameter contains a string type and valid http url (under nodejs criteria) linkUrl property.
 * @param {object} payload 
 * @returns 
 */
function validateSubmitLinkPayload(payload){
    if(!payload || !payload.linkUrl || (payload.linkUrl && typeof payload.linkUrl !== 'string') && isValidHttpUrl(payload.linkUrl))
    {
        return false;
    }

    return true;
}

/**
 * Validates if an object passed by parameter contains a string type shortenedLinkUrl property.
 * @param {object} payload 
 * @returns 
 */

function validateSubmitLinkEventPayload(payload){
    if(!payload || !payload.shortenedLinkUrl || (payload.shortenedLinkUrl && typeof payload.shortenedLinkUrl !== 'string'))
    {
        return false;
    }

    return true;
}

module.exports  = { validateGetOrDeleteLinkPayload, validateSubmitLinkPayload, validateSubmitLinkEventPayload }