
//Improvable but there's no need to make it more complex in this case.
/**
 * Returns a random 5 character string
 */
function getShortenedUrl(){
    return Math.random().toString(36).substr(2, 5);
}

module.exports = getShortenedUrl;