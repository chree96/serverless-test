# Base Serverless Framework Template

The auction-service is a serverless backend that implements an online auction platform using AWS services. Here’s what it does:

- Auction Management: Users can create auctions, view existing auctions, place bids, and upload images for auction items.
- Bid Handling: Only higher bids are accepted, and users cannot bid on their own auctions or bid twice in a row.
- Auction Closing: Auctions are automatically closed after a set time, and notifications are sent to sellers and winning bidders using AWS SQS.
- AWS Integration: Uses DynamoDB for storing auction data, SQS for messaging/notifications, and S3 for storing auction item images.
- API Endpoints: Handlers are implemented for creating auctions, placing bids, retrieving auctions, and uploading item images. Input validation is enforced on all endpoints.

In summary, this service lets users run online auctions with automated closure and notification, fully managed in a serverless AWS environment.
