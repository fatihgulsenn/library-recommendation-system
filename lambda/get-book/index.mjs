import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  };

  const bookId = event.pathParameters?.id;

  if (!bookId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Book ID is required' })
    };
  }

  try {
    const command = new GetCommand({
      TableName: 'Books',
      Key: { id: bookId }
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Book not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.Item)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch book' })
    };
  }
};
