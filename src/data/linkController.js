const { dbConfig } = require('../cfg/cfg');
const dbConn = require('./utils/connection');

class LinkCtrl {
    /**
     * Get link by id
     * @param {int} linkId Key to search a link
     * @returns {Object} Link object
     * Example of returned object
     * [
     *  {
     *      "LinkId": "07927eda-2158-a880-8ab9-eb23238eb5d4",
     *      "LinkUrl": "https://www.google.es",
     *      "ShortenedLinkUrl": "ab123"
     *      "CreatedDate": "2022-03-12T20:32:03.000Z"
     *  }
     * ]
     */
    static async getLinkById(linkId){
        try{
            const response = await dbConn.query(`SELECT LinkId, LinkUrl, ShortenedLinkUrl, CreateDate FROM Link WHERE LinkId = ?`, [ linkId ]);
            return Array.isArray(response) && response.length > 0 ? response : null;
        } catch(e){
            console.error('Error executing MySQL query for getLinkById method:' + e.message);
            return null;
        }
    }
    

    /**
     * Gets link filtered by shortenedUrl
     * @param {string} shortenedUrl 
     * @returns Array with the links found.
     */
    static async getLinkByShortenedUrl(shortenedUrl){
        try{
            const response = await dbConn.query(`SELECT LinkId FROM Link WHERE ShortenedLinkUrl = ?`, [ shortenedUrl ]);
            return Array.isArray(response) && response.length > 0 ? response : null;
        } catch(e){
            console.error('Error executing MySQL query for getLinkByShortenedUrl method:' + e.message);
            return null;
        }
    }

    /**
     * Submits a new link into the DB with linkUrl and shortenedLinkUrl received by parameter.
     * 
     * @param {string} linkUrl 
     * @param {string} shortenedLinkUrl 
     * @returns An object which contains all Link entity, including created LinkId.
     */
    static async submitLink(linkUrl, shortenedLinkUrl){        
        try{
            const gmtDate = Date.now()*0.001;
            const response = await dbConn.query(
                `INSERT INTO Link (LinkUrl, ShortenedLinkUrl, CreateDate) VALUES (?, ?, FROM_UNIXTIME(?));`,
                [ linkUrl, shortenedLinkUrl, gmtDate ]);              
                            
            if(response && response.affectedRows && response.affectedRows > 0){
                return {
                    LinkId: response.insertId,
                    LinkUrl: linkUrl,
                    ShortenedLinkUrl: shortenedLinkUrl,
                    CreateDate: new Date()
                }
            }
            else{
                return null;
            }
            
        } catch(e){
            console.error('Error executing MySQL query for submitLink method:' + e.message);
            return null;
        }        
    }

    /**
     * Deletes a Link by Id and their LinkEvents (if they exist).
     * @param {int} linkId 
     * @returns Array of arrays with record number affected.
     */
    static async deleteLinkById(linkId){
        try{

            const transaction = dbConn.transaction();
            transaction.query(`DELETE FROM LinkEvent WHERE LinkId = ?`, [ linkId ]);
            transaction.query(`DELETE FROM Link WHERE LinkId = ?`, [ linkId ]);            
            transaction.rollback((e) => {
                console.error(e);
                return null;
            });

            return await transaction.commit();
        } catch(e){
            console.error('Error executing MySQL query for deleteLinkById method:' + e.message);
            return null;
        }
    }
    
    /**
     * Get all links from DB
     * @returns an array with all links in the Database. Each link will contain link id, url, shortened url and creation date.
     */
    static async getAllLinks(){
        try{
            const response = await dbConn.query(`SELECT LinkId, LinkUrl, ShortenedLinkUrl, CreateDate FROM Link`, []);
            return Array.isArray(response) && response.length > 0 ? response : null;
        } catch(e){
            console.error('Error executing MySQL query for getLinkById method:' + e.message);
            return null;
        }
    }
}

module.exports = LinkCtrl;
