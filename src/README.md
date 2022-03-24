AWS Lambda consumed by API Gateway lambda integration.

Methods available:

- link - GET (example "/link?linkId=8")
- link - POST (example "/link" || body: { linkUrl: 'https://google.es' })
- link - DELETE (example "link?linkId=8)
- link-event - POST (example "/link-event" || body: { shortenedLinkUrl: 'aa1234' })
- statistics - GET (example "/statistics?linkId=8")
- link/get-all - GET (example "/link/get-all)
