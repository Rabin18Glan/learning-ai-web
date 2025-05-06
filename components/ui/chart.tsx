"use client"
import {
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
  PieChart as PieChartWrapper,
  LineChart as LineChartWrapper,
  BarChart as BarChartWrapper,
  AreaChart as AreaChartWrapper,
  type TooltipProps,
} from "recharts"
import { cn } from "@/lib/utils"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  startEndOnly?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showAnimation?: boolean
  showLegend?: boolean
  showGridLines?: boolean
  showTooltip?: boolean
  className?: string
  layout?: "horizontal" | "vertical"
}

const chartColors = {
  blue: "hsl(221.2 83.2% 53.3%)",
  green: "hsl(142.1 76.2% 36.3%)",
  yellow: "hsl(47.9 95.8% 53.1%)",
  violet: "hsl(262.1 83.3% 57.8%)",
  red: "hsl(346.8 77.2% 49.8%)",
  orange: "hsl(24.6 95% 53.1%)",
  pink: "hsl(322.1 73.6% 59.4%)",
  cyan: "hsl(189.5 94.5% 43.1%)",
  indigo: "hsl(226.6 94% 56.1%)",
  emerald: "hsl(160 84% 39%)",
  amber: "hsl(38 92% 50%)",
  slate: "hsl(215.4 16.3% 46.9%)",
}

const getColorByName = (name: string) => {
  return chartColors[name as keyof typeof chartColors] || name
}

const CustomTooltip = ({
  active,
  payload,
  label,
  formatter,
}: TooltipProps<any, any> & { formatter?: (value: number) => string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
            <span className="font-bold text-muted-foreground">
              {formatter ? formatter(payload[0].value) : payload[0].value}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["blue"],
  valueFormatter = (value: number) => `${value}`,
  startEndOnly = true,
  showXAxis = true,
  showYAxis = true,
  showAnimation = true,
  showLegend = true,
  showGridLines = false,
  showTooltip = true,
  className,
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChartWrapper
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          {showGridLines && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
          {showXAxis && (
            <XAxis
              dataKey={index}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => {
                if (typeof value === "string") {
                  return value.length > 10 ? value.slice(0, 10) + "..." : value
                }
                return value
              }}
              tick={{ transform: "translate(0, 6)" }}
              ticks={startEndOnly ? [data[0][index], data[data.length - 1][index]] : undefined}
            />
          )}
          {showYAxis && (
            <YAxis
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => valueFormatter(value)}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip formatter={valueFormatter} />} cursor={false} />}
          {showLegend && <Legend verticalAlign="top" height={40} className="text-xs text-muted-foreground" />}
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={getColorByName(colors[i % colors.length])}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, className: "fill-primary" }}
              isAnimationActive={showAnimation}
            />
          ))}
        </LineChartWrapper>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["blue"],
  valueFormatter = (value: number) => `${value}`,
  showAnimation = true,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGridLines = false,
  showTooltip = true,
  layout = "horizontal",
  className,
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChartWrapper
          data={data}
          layout={layout}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          {showGridLines && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
          {showXAxis && (
            <XAxis
              dataKey={layout === "vertical" ? undefined : index}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              type={layout === "vertical" ? "number" : "category"}
              tick={{ transform: "translate(0, 6)" }}
              tickFormatter={
                layout === "vertical"
                  ? (value) => valueFormatter(value)
                  : (value) => {
                      if (typeof value === "string") {
                        return value.length > 10 ? value.slice(0, 10) + "..." : value
                      }
                      return value
                    }
              }
            />
          )}
          {showYAxis && (
            <YAxis
              dataKey={layout === "vertical" ? index : undefined}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              type={layout === "vertical" ? "category" : "number"}
              tickFormatter={
                layout === "vertical"
                  ? (value) => {
                      if (typeof value === "string") {
                        return value.length > 10 ? value.slice(0, 10) + "..." : value
                      }
                      return value
                    }
                  : (value) => valueFormatter(value)
              }
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip formatter={valueFormatter} />} cursor={false} />}
          {showLegend && <Legend verticalAlign="top" height={40} className="text-xs text-muted-foreground" />}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={getColorByName(colors[i % colors.length])}
              isAnimationActive={showAnimation}
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          ))}
        </BarChartWrapper>
      </ResponsiveContainer>
    </div>
  )
}

export function PieChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "yellow", "violet", "red", "orange", "pink", "cyan"],
  valueFormatter = (value: number) => `${value}`,
  showAnimation = true,
  showTooltip = true,
  className,
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChartWrapper
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="90%"
            innerRadius="60%"
            dataKey={categories[0]}
            nameKey={index}
            isAnimationActive={showAnimation}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={getColorByName(colors[i % colors.length])}
                className="stroke-background hover:opacity-80"
                strokeWidth={2}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip formatter={valueFormatter} />} cursor={false} />}
        </PieChartWrapper>
      </ResponsiveContainer>
    </div>
  )
}

export function AreaChart({
  data,
  index,
  categories,
  colors = ["blue"],
  valueFormatter = (value: number) => `${value}`,
  showAnimation = true,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGridLines = false,
  showTooltip = true,
  startEndOnly = true,
  className,
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChartWrapper
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          {showGridLines && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
          {showXAxis && (
            <XAxis
              dataKey={index}
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => {
                if (typeof value === "string") {
                  return value.length > 10 ? value.slice(0, 10) + "..." : value
                }
                return value
              }}
              tick={{ transform: "translate(0, 6)" }}
              ticks={startEndOnly ? [data[0][index], data[data.length - 1][index]] : undefined}
            />
          )}
          {showYAxis && (
            <YAxis
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => valueFormatter(value)}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip formatter={valueFormatter} />} cursor={false} />}
          {showLegend && <Legend verticalAlign="top" height={40} className="text-xs text-muted-foreground" />}
          {categories.map((category, i) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={getColorByName(colors[i % colors.length])}
              fill={getColorByName(colors[i % colors.length])}
              fillOpacity={0.1}
              strokeWidth={2}
              isAnimationActive={showAnimation}
            />
          ))}
        </AreaChartWrapper>
      </ResponsiveContainer>
    </div>
  )
}
