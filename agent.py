import asyncio
from mcp_agent import agent
from mcp_agent.core.fastagent import FastAgent
from mcp_agent.core.prompt import Prompt
from mcp_agent.mcp.prompt_message_multipart import PromptMessageMultipart


# Create the application
fast = FastAgent("fast-agent example")

# Define the agent
@fast.agent(
    instruction="You are a helpful AI Agent",
    model="openai.gpt-4.1",
    servers=["filesystem", "brave", "memory", "context7"],
    use_history=True,
    human_input=True,
)
async def main():
    async with fast.run() as agent:
        await agent.interactive()


if __name__ == "__main__":
    asyncio.run(main())
