import { MainLayout } from "@/components/layout/main-layout"

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold">Welcome to Fast Agent UI</h1>
          <p className="text-muted-foreground">
            A modern, feature-rich interface for the Fast Agent framework.
          </p>
        </section>
        
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Chat with Agent</h3>
            <p className="mt-2 text-muted-foreground">
              Interact with your Fast Agent through a modern chat interface.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold">View History</h3>
            <p className="mt-2 text-muted-foreground">
              Browse through past conversations and interactions.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Manage Servers</h3>
            <p className="mt-2 text-muted-foreground">
              Configure and manage your MCP servers.
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}