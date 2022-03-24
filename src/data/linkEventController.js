const { dbConfig } = require('../cfg/cfg');
const dbConn = require('./utils/connection');

class LinkEventCtrl {
    /**
     * Inserts a link click event in database and returns link data.
     * @param {string} shortenedLinkUrl Short url which refereces a link
     * @returns {object} LinkUrl with inserted link event object and a Link object
     */
    static async submitLinkEvent(shortenedLinkUrl){
        try{
            const gmtDate = Date.now()*0.001;
            const transaction = dbConn.transaction();
            console.log(gmtDate);
            transaction.query(
                `INSERT INTO LinkEvent (LinkId, CreateDate)
                SELECT L.LinkId, NOW() FROM Link L WHERE ShortenedLinkUrl = ?`,
                [ shortenedLinkUrl ]);
            transaction.query(`SELECT LinkUrl FROM Link WHERE ShortenedLinkUrl = ?`, [ shortenedLinkUrl ]);            
            transaction.rollback((e) => {
                console.error(e);
                return null;
            });

            const resp = await transaction.commit();

            //Transactions return array of responses. Each array may be another array itself with records resulted from a query.
            if(resp && Array.isArray(resp) && resp.length === 2 && resp[1] && Array.isArray(resp[1]) && resp[1].length === 1){
                return resp[1][0];
            }

            return null;
        } catch(e){
            console.error('Error executing MySQL query for submitLinkEvent method:' + e.message);
            return null;
        }
    }
}

module.exports = LinkEventCtrl;
