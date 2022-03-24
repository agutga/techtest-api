const handler = require('../src/index');

// handler({
//     path: '/link',
//     httpMethod: 'get',
//     queryStringParameters: {
//         linkId: 4
//     }
// });

    
// handler({
//     path: '/statistics',
//     httpMethod: 'get',
//     queryStringParameters: {
//         linkId: 7
//     }
// });


handler({
    path: '/link-event',
    httpMethod: 'post',
    body: JSON.stringify({
        shortenedLinkUrl: 'n1jnrasdadad'
    })    
});