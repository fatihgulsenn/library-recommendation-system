import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

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
    const query = body.query || 'Recommend me some good books';

    // Get all books from DynamoDB
    const booksResponse = await docClient.send(new ScanCommand({ TableName: 'Books' }));
    const books = booksResponse.Items || [];

    // Create prompt for Claude
    const bookList = books.map(b => `- "${b.title}" by ${b.author} (${b.genre}) - ${b.description}`).join('\n');

    const prompt = `You are a helpful librarian. Based on the user's request, recommend 3 books from this catalog and explain why each would be a good choice.

Available books:
${bookList}

User request: "${query}"

Respond with a JSON array of exactly 3 recommendations. Each recommendation should have:
- bookId: the book's id from the catalog
- reason: a personalized explanation (2-3 sentences) of why this book matches their request
- confidence: a number between 0.7 and 0.99 indicating how well it matches

Response format (JSON only, no markdown):
[{"bookId": "1", "reason": "...", "confidence": 0.95}, ...]`;

    // Call Claude via Bedrock
    const bedrockResponse = await bedrockClient.send(new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
    const assistantMessage = responseBody.content[0].text;

    // Parse the recommendations from Claude's response
    let recommendations;
    try {
      // Try to extract JSON from the response
      const jsonMatch = assistantMessage.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        recommendations = JSON.parse(assistantMessage);
      }
    } catch (parseError) {
      console.error('Failed to parse recommendations:', parseError);
      // Fallback recommendations
      recommendations = books.slice(0, 3).map((book, index) => ({
        bookId: book.id,
        reason: `This ${book.genre.toLowerCase()} book by ${book.author} is highly rated and matches your interests.`,
        confidence: 0.85 - (index * 0.05)
      }));
    }

    // Add unique IDs to recommendations
    const finalRecommendations = recommendations.map((rec, index) => ({
      id: `rec-${Date.now()}-${index}`,
      ...rec
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        query,
        recommendations: finalRecommendations
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to get recommendations', details: error.message })
    };
  }
};
