import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS'
  };

  try {
    const body = JSON.parse(event.body || '{}');
    const { userId, name, description, bookIds } = body;

    if (!userId || !name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userId and name are required' })
      };
    }

    const now = new Date().toISOString();
    const item = {
      id: randomUUID(),
      userId,
      name,
      description: description || '',
      bookIds: bookIds || [],
      createdAt: now,
      updatedAt: now
    };

    const command = new PutCommand({
      TableName: 'ReadingLists',
      Item: item
    });

    await docClient.send(command);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(item)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create reading list' })
    };
  }
};
