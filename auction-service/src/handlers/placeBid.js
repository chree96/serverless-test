import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import { getAuctionById } from "./getAuction";
import placeBidSchema from "../lib/schemas/placeBidSchema";
import validator from "@middy/validator";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;

  const auction = await getAuctionById(id);

  // AUCTION STATUS VALIDATION
  if (auction.status !== "OPEN") {
    throw new createError.Forbidden("You cannot bid on closed auctions!");
  }

  // BID AMOUNT VALIDATION
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      "Your bid must be higher than " + auction.highestBid.amount + "!"
    );
  }

  // AVOID DOUBLE BIDDING
  if (email === auction.highestBid.bidder) {
    throw new createError.Forbidden("You are already the highest bidder!");
  }

  // BID IDENTITY VALIDATION
  if (email === auction.seller) {
    throw new createError.Forbidden("You cannot bid on your own auctions!");
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set highestBid.amount = :amount, highestBid.bidder = :bidder",
    ExpressionAttributeValues: {
      ":amount": amount,
      ":bidder": email,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid).use(
  validator({
    inputSchema: placeBidSchema,
  })
);
