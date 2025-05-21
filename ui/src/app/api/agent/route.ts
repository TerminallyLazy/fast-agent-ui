import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, model, settings } = body;

    // Prepare command line arguments for agent.py
    const agentPath = join(process.cwd(), '..', 'agent.py');

    // Build the command arguments
    const args = ['run', agentPath, '--quiet'];

    // Add message parameter
    args.push('--message', message);

    // Add model if specified
    if (model) {
      args.push('--model', model);
    }

    // Add settings if provided
    if (settings) {
      if (settings.temperature !== undefined) {
        args.push('--temperature', settings.temperature.toString());
      }
      if (settings.maxTokens !== undefined) {
        args.push('--max-tokens', settings.maxTokens.toString());
      }
    }

    console.log('Executing agent with command:', '/home/lazy/.local/bin/uv', args.join(' '));

    // Spawn the agent.py process using uv run
    return new Promise((resolve) => {
      const agentProcess = spawn('/home/lazy/.local/bin/uv', args);

      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        console.error('Agent process timed out after 30 seconds');
        agentProcess.kill();
        resolve(NextResponse.json(
          { error: 'Agent process timed out', details: 'The operation took too long to complete' },
          { status: 504 }
        ));
      }, 30000); // 30 second timeout

      let responseData = '';
      let errorData = '';

      // Collect data from stdout
      agentProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        console.log('Agent stdout chunk:', chunk.substring(0, 200) + (chunk.length > 200 ? '...' : ''));
        responseData += chunk;
      });

      // Collect errors from stderr
      agentProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        errorData += chunk;
        console.error(`Agent stderr:`, chunk);
      });

      // Handle process completion
      agentProcess.on('close', (code) => {
        // Clear the timeout since the process has completed
        clearTimeout(timeout);
        console.log(`Agent process exited with code ${code}`);

        if (code !== 0) {
          console.error('Agent process failed:', errorData);
          resolve(NextResponse.json(
            { error: 'Agent process failed', details: errorData },
            { status: 500 }
          ));
          return;
        }

        try {
          // Try to parse the response as JSON
          const jsonResponse = JSON.parse(responseData);

          // Check if the response has the expected format
          if (jsonResponse.role && jsonResponse.content) {
            resolve(NextResponse.json({
              id: Date.now().toString(),
              role: jsonResponse.role,
              content: jsonResponse.content,
              toolName: jsonResponse.toolName, // Include toolName if present
              timestamp: new Date()
            }));
          } else if (Array.isArray(jsonResponse)) {
            // Handle array response (might be a list of messages)
            const lastMessage = jsonResponse[jsonResponse.length - 1];
            resolve(NextResponse.json({
              id: Date.now().toString(),
              role: lastMessage.role || "assistant",
              content: lastMessage.content || lastMessage,
              toolName: lastMessage.toolName,
              timestamp: new Date()
            }));
          } else {
            // Handle other JSON formats
            resolve(NextResponse.json({
              id: Date.now().toString(),
              role: "assistant",
              content: JSON.stringify(jsonResponse),
              timestamp: new Date()
            }));
          }
        } catch (e) {
          // If not JSON, return as plain text response
          console.log('Agent response is not JSON, returning as plain text');
          resolve(NextResponse.json({
            id: Date.now().toString(),
            role: "assistant",
            content: responseData.trim(),
            timestamp: new Date()
          }));
        }
      });

      // Handle process errors
      agentProcess.on('error', (err) => {
        // Clear the timeout since the process has errored
        clearTimeout(timeout);
        console.error('Failed to start agent process:', err);
        resolve(NextResponse.json(
          { error: 'Failed to start agent process', details: err.message },
          { status: 500 }
        ));
      });
    });

  } catch (error) {
    console.error('Error processing agent request:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Additional routes can be implemented as needed:
// 1. GET route to check the status of the agent
// 2. DELETE route to stop the agent
// 3. PUT route to update the agent's settings