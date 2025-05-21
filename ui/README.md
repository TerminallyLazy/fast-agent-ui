# Fast Agent UI

A modern, feature-rich user interface for the Fast Agent framework.

## Features

- **Modern React Framework**: Built with Next.js for optimal performance and developer experience
- **Beautiful UI Components**: Utilizes shadcn/ui for a consistent and accessible design system
- **Unique Dark Mode**: Features a futuristic dark theme with vibrant accent colors
- **Custom Light Mode**: Includes an off-white light mode that's easier on the eyes
- **Agent Integration**: Connects to the Fast Agent backend (agent.py) for intelligent responses
- **Conversation History**: View and continue past conversations
- **File Management**: Upload, preview, and manage files for agent interactions
- **Server Management**: Configure and monitor MCP servers with detailed status information
- **Model Selection**: Choose from various LLM models with capability information
- **Settings Management**: Customize your Fast Agent experience with detailed preferences

## Integration with Fast Agent

The UI integrates with the Fast Agent framework (agent.py) through a Next.js API route. The integration works as follows:

1. The UI sends messages to the `/api/agent` API route
2. The API route communicates with the agent.py script
3. The agent processes the message and returns a response
4. The UI displays the response to the user

This architecture allows for a clean separation between the frontend and backend, while still providing a seamless user experience.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- Python 3.8 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd ui
   npm install
   ```
3. Start both the UI and agent:
   ```bash
   ./start-all.sh
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app`: Next.js app router pages
  - `/api`: API routes for backend communication
  - `/chat`: Chat interface page
  - `/history`: Conversation history page
  - `/files`: File management page
  - `/servers`: Server management page
  - `/models`: Model selection page
  - `/settings`: Settings page
- `/src/components`: Reusable UI components
  - `/ui`: shadcn UI components
  - `/layout`: Layout components (header, sidebar, etc.)
  - `/chat`: Chat interface components
  - `/theme`: Theme-related components
  - `/servers`: Server management components
- `/src/services`: Service layer for API communication
- `/src/lib`: Utility functions and helpers
- `/public`: Static assets

## Features in Detail

### Chat Interface
- Real-time messaging with the Fast Agent
- Support for different message types (user, assistant, system, tool)
- File attachment support
- Audio recording capability
- Message copying and downloading
- Integration with agent.py backend

### Server Management
- Add, configure, and monitor MCP servers
- Support for different server types (stdio, http, sse)
- Server status monitoring
- Restart and remove servers

### Model Management
- Browse available LLM models
- View model capabilities and details
- Set default model
- Configure API keys for different providers
- Favorite models for quick access

### File Management
- Upload and organize files
- Preview file contents
- Filter files by type or tag
- Download and delete files

### Settings
- Configure API keys
- Set model preferences
- Adjust display settings
- Customize UI preferences

## Technologies Used

- **Next.js**: React framework for production
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **shadcn/ui**: Component library
- **Lucide Icons**: For beautiful icons
- **next-themes**: For theme management

## License

This project is licensed under the MIT License - see the LICENSE file for details.