
CREATE TABLE `Link`(
	LinkId INT PRIMARY KEY AUTO_INCREMENT,
    LinkUrl VARCHAR(300) CHARSET UTF8MB4 NOT NULL,
    ShortenedLinkUrl VARCHAR(5) CHARSET UTF8MB4 NOT NULL,
    CreateDate DATETIME NOT NULL    
);

CREATE TABLE `LinkEvent`(
	LinkEventId INT PRIMARY KEY AUTO_INCREMENT,
	LinkId INT NOT NULL,    
    CreateDate DATETIME NOT NULL,    
    FOREIGN KEY (LinkId) REFERENCES Link(LinkId)
);

SELECT * FROM Link;

INSERT INTO Link(LinkUrl, ShortenedLinkUrl, CreateDate) VALUES ('https://google.es', 'aa123', now());
INSERT INTO LinkEvent(LinkId, CreateDate) VALUES (4, now());


SELECT L.LinkId, COUNT(*) AS NumClicks
FROM
(
	SELECT L.*, DAY(LE.CreateDate) AS LDay, MONTH(LE.CreateDate) AS LMonth, YEAR(LE.CreateDate) AS LYear
	FROM Link L
	INNER JOIN LinkEvent LE ON L.LinkId = LE.LinkId
) L
GROUP BY LinkId, LDay, LMonth, LYear;
 
 
DELIMITER //
 
CREATE PROCEDURE sp_GetLinkClick(IN LinkId INT)
BEGIN
		SELECT LDay, LMonth, LYear, COUNT(*) AS ClickCount
		FROM
		(
			SELECT L.*, DAY(LE.CreateDate) AS LDay, MONTH(LE.CreateDate) AS LMonth, YEAR(LE.CreateDate) AS LYear
			FROM Link L
			INNER JOIN LinkEvent LE ON L.LinkId = LE.LinkId
			WHERE L.LinkId = LinkId
		) L
		GROUP BY LinkId, LDay, LMonth, LYear;
    
END //

DELIMITER ;


