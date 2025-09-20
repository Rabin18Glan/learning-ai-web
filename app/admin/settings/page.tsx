export const Settings: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h2>
      <p className="text-sm text-muted-foreground">Configure system settings and preferences</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">OpenAI API Key</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              placeholder="sk-..."
              defaultValue="sk-proj-..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Anthropic API Key</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              placeholder="sk-ant-..."
              defaultValue="sk-ant-..."
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-4">RAG Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Chunk Size</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              defaultValue="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Chunk Overlap</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              defaultValue="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Top K Results</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              defaultValue="5"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
