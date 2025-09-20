import { TrendingUp } from "lucide-react";


interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
}
export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-card p-4 sm:p-6 rounded-lg border border-border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-lg sm:text-2xl font-bold text-card-foreground">{value}</p>
        {change && (
          <p className={`text-xs sm:text-sm flex items-center mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
            <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {change}
          </p>
        )}
      </div>
      <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      </div>
    </div>
  </div>
);