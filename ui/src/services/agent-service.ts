// Agent Service - Handles communication with the Fast Agent backend

import { Message } from "@/components/chat/chat-interface";

// Define the interface for agent requests
interface AgentRequest {
  message: string;
  model: string;
  history?: Message[];
  settings?: {
    temperature?: number;
    maxTokens?: number;
    streamResponse?: boolean;
  };
}

// Define the interface for agent responses
interface AgentResponse {
  id: string;
  content: string;
  role: "assistant" | "tool";
  toolName?: string;
  timestamp: Date;
}

// Function to send a message to the agent via the API
export async function sendMessageToAgent(request: AgentRequest): Promise<AgentResponse> {
  try {
    // Make API call to our Next.js API route
    const response = await fetch('/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert the timestamp string back to a Date object
    return {
      ...data,
      timestamp: new Date(data.timestamp)
    };
  } catch (error) {
    console.error('Error sending message to agent:', error);
    throw error;
  }
}

// Function to start a new conversation
export function startNewConversation(): Message[] {
  return [
    {
      id: Date.now().toString(),
      role: "system",
      content: "Welcome to Fast Agent UI. How can I help you today?",
      timestamp: new Date()
    }
  ];
}

// In a real implementation, we would add functions to:
// 1. Initialize the agent process
// 2. Stream responses from the agent
// 3. Handle tool calls
// 4. Manage agent state
// 5. Handle file uploads
// 6. etc.