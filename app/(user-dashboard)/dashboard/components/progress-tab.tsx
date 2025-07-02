import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TabsContent } from "@/components/ui/tabs"

function ProgressTab() {
  return (
  
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your progress across all learning paths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Physics Fundamentals</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        8/12 Topics
                      </Badge>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                  </div>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Advanced Mathematics</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
                      >
                        4/15 Topics
                      </Badge>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                  </div>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Computer Science Basics</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                      >
                        1/10 Topics
                      </Badge>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                  </div>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  )
}

export default ProgressTab