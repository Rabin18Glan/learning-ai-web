import { Card, CardContent } from '@/components/ui/card';
import { Metric } from '../data/metrices';

interface MetricCardProps {
  metricData: Metric,
  className?: string
}
function MetricCard({ className, metricData }: MetricCardProps) {
  const { icon, metric, title } = metricData;
  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-none shadow-md ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{metric}</p>
          </div>
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricCard