import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
function RecentTab() {
  return (
     <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your learning activity over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center border-t p-6">
              <p className="text-muted-foreground">Activity chart will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
  )
}

export default RecentTab