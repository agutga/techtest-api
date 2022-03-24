module.exports = {    
    region: 'eu-central-1',
    dbConfig: {},
    headers:{
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE",
        'Content-Type': 'application/json'
    }
};

//CORS with lambda integration
//https://docs.aws.amazon.com/es_es/apigateway/latest/developerguide/how-to-cors.html