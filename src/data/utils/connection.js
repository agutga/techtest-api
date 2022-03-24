const { dbConfig } = require('../../cfg/cfg');

// To use Serverless MySQL, require it OUTSIDE your main function handler. This will allow for connection reuse between executions.
// https://www.npmjs.com/package/serverless-mysql
const serverlessMySql = require('serverless-mysql')({
    library: require('mysql2'),
    maxRetries: 3,
    onConnect: conn => console.info(`MySql onConnect callback. Established MySQL connection to host: ${conn && conn.config? conn.config.host:'???'}`),
    onConnectError: err => console.error(`MySql onConnectError callback. MySQL connection error: ${err.toString()}`),
    onRetry: (err, retries) => console.warn(`MySql onRetry callback. MySQL connection Retry Number ${retries}. Caused by: ${err.toString()}`),
    onError: err => console.error(`MySql onError callback. MySQL error: ${err.toString()}`),
    onClose: () => console.info('MySql onClose callback. Closed MySQL connection.'),
});

class DBConnector {
    constructor() {
        this.mysql = serverlessMySql;
        this.configObj = null;
        this.iamAuthentication = false;
        this.rdsSigner = null;
        this.rdsToken = null;
        this.rdsTokenTime = null;
        this.rdsTokenExpirationMillis = 840 * 1000;
        if(!dbConfig.connectIam || process.env.RDS_FORCE_PWD_CONNECTION){
            this.configObj = {
                host: dbConfig.host,
                user: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.database,
            };
            console.info(`Successfully configured MySQL connection obj to ${this.configObj.host} with User/Pwd Authentication`);
        } else {
            this.iamAuthentication = true;            
            this.configObj = {
                host: dbConfig.host,                
                database: dbConfig.database,
                ssl: 'Amazon RDS',
                authPlugins: { mysql_clear_password: () => () => this.checkRdsToken() }
            };
            console.info(`Successfully configured MySQL connection obj to ${this.configObj.host} with IAM Authentication`);
        }
    }

    checkRdsToken(){
        let token;
        if(!this.rdsToken){
            console.info('RDS Token not found. Requesting new one...');
            token = this.requestAndSaveNewToken();
        } else if ( (Date.now() - this.rdsTokenTime) > this.rdsTokenExpirationMillis ){
            console.info('RDS Token expired. Requesting new one...');
            token = this.requestAndSaveNewToken();
        } else {
            token = this.rdsToken;
        }
        return token;
    }

    requestAndSaveNewToken(){
        let token = this.rdsSigner.getAuthToken();
        this.rdsTokenTime = Date.now();
        this.rdsToken = token;
        return token;
    }

    setup(){
        let iamTokenRenew = this.iamAuthentication &&
            (!this.rdsToken || !this.rdsTokenTime || (Date.now() - this.rdsTokenTime) > this.rdsTokenExpirationMillis);
        if(!this.checkConnected()){
            this.configMysql(this.configObj);
        } else if (iamTokenRenew){
            console.info('Resetting MySQL connection. Cause: Token Renew.');
            this.mysql.quit();
            this.configMysql(this.configObj);
        }
    }

    checkConnected(){
        return this.mysql.getConfig().host !== undefined;
    }

    configMysql(configJson){
        this.mysql.config(configJson);
        console.info(`Successfully configured MySQL with ${this.iamAuthentication? 'IAM Auth' : 'User/Pwd Auth'} to ${this.mysql.getConfig().host}`);
    }

    end(){
        return this.mysql.end();
    }

    quit(){
        this.mysql.quit();
    }

    query(...args){
        this.setup();
        return this.mysql.query(...args);
    }

    transaction(){
        this.setup();
        return this.mysql.transaction();
    }

}

module.exports = new DBConnector();
