
const { dbConfig } = require('../cfg/cfg');
const dbConn = require('./utils/connection');

class LinkStatisticsCtrl {
    /**
     * Gets number of clicks made to a link grouped by date (day)
     * @param {int} linkId Link id where to extract statistics
     * @returns {Object} List of days where a link has been clicked and the amount of times it has been clicked.
     * Example of returned object
     * [
     *  {
     *      "ClickDate": "2022-03-12T00:00:00.000Z",
     *      "ClickCount": 1     
     *  },
     *  {
     *      "ClickDate": "2022-03-13T00:00:00.000Z",
     *      "ClickCount": 2     
     *  } 
     * ]
     */
    static async getStatisticsByLinkId(linkId){
        try{
            const transaction = dbConn.transaction();
            transaction.query(`SELECT DATE(CONCAT_WS('-', LYEAR, LMONTH, LDAY)) AS ClickDate, COUNT(*) AS ClickCount
                                FROM
                                (
                                    SELECT L.LinkId, DAY(LE.CreateDate) AS LDay, MONTH(LE.CreateDate) AS LMonth, YEAR(LE.CreateDate) AS LYear
                                    FROM Link L
                                    INNER JOIN LinkEvent LE ON L.LinkId = LE.LinkId		
                                    WHERE L.LinkId = ?
                                ) L
                                GROUP BY LinkId, LDay, LMonth, LYear`, [ linkId ]);
            transaction.query(`SELECT * FROM Link WHERE LinkId = ?`, [ linkId ]);
            transaction.rollback((e) => {
                console.error(e);
                return null;
            });

            const response = await transaction.commit();

            return response ? response : null;
        } catch(e){
            console.error('Error executing MySQL query for getStatisticsByLinkId method:' + e.message);
            return null;
        }
    }    
}

module.exports = LinkStatisticsCtrl;
