import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const TABLE_NAME = 'interview-sessions'

function getClient() {
  const raw = new DynamoDBClient({
    region: import.meta.env.VITE_AWS_REGION || 'eu-west-2',
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  })
  return DynamoDBDocumentClient.from(raw)
}

/** Persist a completed interview session to DynamoDB */
export async function saveSession({ systemDesigned, overallScore, duration, summary }) {
  const client = getClient()
  const item = {
    sessionId: uuidv4(),
    timestamp: new Date().toISOString(),
    systemDesigned,
    overallScore,
    duration,
    summary: summary || '',
  }
  await client.send(new PutCommand({ TableName: TABLE_NAME, Item: item }))
  return item
}

/** Fetch up to 10 most-recent sessions for the landing page */
export async function fetchRecentSessions(limit = 10) {
  const client = getClient()
  const result = await client.send(
    new ScanCommand({ TableName: TABLE_NAME, Limit: 50 }),
  )
  const items = result.Items || []
  return items
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit)
}
