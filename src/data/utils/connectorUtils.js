
const dbConn = require('./connection');

const endConnection = async () => {
    console.info('Ending MySQL connection...');
    await dbConn.end();
};

const closeConnection = () => {
    console.info('Fully closing MySQL connection...');
    dbConn.quit();
};

module.exports = {
    endConnection,
    closeConnection,
};