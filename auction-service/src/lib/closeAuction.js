import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export async function closeAuction(auction) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  await dynamodb.update(params).promise();

  const { title, seller, highestBid } = auction;
  const { amount, bidder } = highestBid;
  const isSold = amount !== 0;

  const sellerBodySubject = isSold
    ? `Your item has been sold!`
    : `Your item has expired`;

  const sellerBodyMessage = isSold
    ? `Yyyyaaaahh! Your item "${title}" has been sold for $${amount}!`
    : `Oh no oh noo! Your item "${title}" non se lo è cagato nessuno,`;

  if (!isSold) {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: sellerBodySubject,
          recipient: seller,
          body: sellerBodyMessage,
        }),
      })
      .promise();
    return;
  }

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: sellerBodySubject,
        recipient: seller,
        body: sellerBodyMessage,
      }),
    })
    .promise();

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "You won this shit!",
        recipient: bidder,
        body: `What a great deal, man! You got your "${title}"!`,
      }),
    })
    .promise();

  return Promise.all([notifySeller, notifyBidder]);
}
