import { Topbar } from "@/components/topbar"

export default function SettingsPage() {
  return (
    <main className="flex flex-col overflow-auto">
      <Topbar title="Settings" description="Manage your settings" />
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">This section is ready to build out.</p>
        </div>
      </div>
    </main>
  )
}
