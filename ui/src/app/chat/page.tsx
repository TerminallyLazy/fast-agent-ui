import { MainLayout } from "@/components/layout/main-layout"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        <h1 className="text-2xl font-bold mb-4">Chat with Agent</h1>
        <ChatInterface />
      </div>
    </MainLayout>
  )
}