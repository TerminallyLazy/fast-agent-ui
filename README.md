# Fast Agent UI

A modern, feature-rich user interface for the brilliant fast-agent framework. https://github.com/evalstate/fast-agent

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

![image](https://github.com/user-attachments/assets/0570fdbd-980f-4904-a094-e81740b49d0e)

![image](https://github.com/user-attachments/assets/34ade903-446d-4cf0-8fb0-24e5473f2a26)

![image](https://github.com/user-attachments/assets/3fa41c5a-d753-4fab-b284-9cb0ba9f0750)

![image](https://github.com/user-attachments/assets/334b9a57-1f7a-4eac-91fe-d74bc10d1bac)

![image](https://github.com/user-attachments/assets/40a13f46-a14f-4854-ad67-eecacc3bdc82)

![image](https://github.com/user-attachments/assets/8d261fa9-c794-4725-918a-83a095f60c97)

![image](https://github.com/user-attachments/assets/05543151-2615-4330-9ce0-21ca85b368f5)

![image](https://github.com/user-attachments/assets/b6dc7e45-3a62-4fc0-ae77-781f10061874)

![image](https://github.com/user-attachments/assets/a675b39c-9655-48fb-b3ac-9a76e3e595f6)



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
