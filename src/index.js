const { getLink, submitLink, deleteLink, getAllLinks } = require('./businessLogic/link');
const { getLinkStatistics } = require('./businessLogic/link-statistic');
const { submitLinkEvent } = require('./businessLogic/link-event');
const cfg = require('./cfg/cfg');

async function handler (event, context) {
    // TODO implement
    let response = { };
    try{
        const eventMethod = `${event.path}/${event.httpMethod}`.toLowerCase();

        let payload = {};
        switch(eventMethod){
            case '/link/get':
                payload = {                
                    ...event.queryStringParameters
                }

                response = await getLink(payload);
                break;
            case '/link/post':
                payload = {                
                    ...JSON.parse(event.body)
                }

                response = await submitLink(payload);
                break;
            case '/link/delete':
                payload = {                
                    ...event.queryStringParameters
                }

                response = await deleteLink(payload);
                break;   
            case '/link-event/post':
                payload = {                
                    ...JSON.parse(event.body)
                }

                response = await submitLinkEvent(payload);
                break;                               
            case '/statistics/get':
                payload = {                
                    ...event.queryStringParameters
                }

                response = await getLinkStatistics(payload);
                break;
            case '/link/get-all/get':
                response = await getAllLinks();                
                break;
            default:
                response = {
                    statusCode: 400,
                    body: JSON.stringify({ errorMessage: 'Method not found.' })
                };
                break;
        }
    }    
    catch(err){
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({ errorMessage: `Error executing service. ${err.message}` })            
        };
    }    
    const resp = {
        ...response,
        headers: cfg.headers,
    };

    console.log(resp);

    return resp;        
};

module.exports = handler;