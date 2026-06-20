import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

const SYSTEM_PROMPT = `You are a senior Amazon software engineer conducting a system design interview. You are professional, encouraging but challenging. Start by asking about functional and non-functional requirements. Then probe into: scalability, database choices, API design, caching strategy, handling failures, and trade-offs. Ask one focused question at a time. After 8-12 exchanges, end the interview by saying INTERVIEW_COMPLETE followed by a JSON scoring object with fields: overallScore (0-100), requirementsScore (0-100), scalabilityScore (0-100), databaseScore (0-100), apiScore (0-100), tradeoffScore (0-100), strengths (array of strings), improvements (array of strings), modelAnswer (string). Also throughout the conversation, whenever the user mentions a technical component, output a line starting with COMPONENT: followed by the component name so the frontend can update the diagram.`

/**
 * Stream a chat turn with Claude and call onChunk for each text delta.
 * Returns the full accumulated response text.
 */
export async function streamInterviewResponse(messages, onChunk) {
  let fullText = ''

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  })

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      fullText += event.delta.text
      onChunk(event.delta.text)
    }
  }

  return fullText
}

/**
 * Parse component hints out of an AI response line, e.g. "COMPONENT: Cache (Redis)"
 */
export function extractComponents(text) {
  const components = []
  const lines = text.split('\n')
  for (const line of lines) {
    const match = line.match(/^COMPONENT:\s*(.+)$/i)
    if (match) components.push(match[1].trim())
  }
  return components
}

/**
 * Parse the JSON scoring block that follows INTERVIEW_COMPLETE
 */
export function parseScores(text) {
  const marker = 'INTERVIEW_COMPLETE'
  const idx = text.indexOf(marker)
  if (idx === -1) return null
  const jsonStart = text.indexOf('{', idx)
  const jsonEnd = text.lastIndexOf('}')
  if (jsonStart === -1 || jsonEnd === -1) return null
  try {
    return JSON.parse(text.slice(jsonStart, jsonEnd + 1))
  } catch {
    return null
  }
}

/** Strip COMPONENT: and INTERVIEW_COMPLETE lines from text shown in chat */
export function cleanResponseText(text) {
  return text
    .replace(/^COMPONENT:.*$/gm, '')
    .replace(/INTERVIEW_COMPLETE[\s\S]*/m, '')
    .trim()
}
