export function isValidHttpUrl(url) {
    let isUrl;

    try {
        isUrl = new URL(url);
    } catch (_) {
        return false;  
    }
    
    return isUrl.protocol === "http:" || isUrl.protocol === "https:";
}