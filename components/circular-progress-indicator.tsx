"use client"

import { useEffect, useState } from "react"

interface CircularProgressIndicatorProps {
  value: number
  size?: number
  strokeWidth?: number
  backgroundColor?: string
  progressColor?: string
  textColor?: string
}

export function CircularProgressIndicator({
  value,
  size = 80,
  strokeWidth = 8,
  backgroundColor = "rgba(200, 200, 200, 0.2)",
  progressColor = "hsl(var(--primary))",
  textColor = "currentColor",
}: CircularProgressIndicatorProps) {
  const [progress, setProgress] = useState(0)

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value)
    }, 100)

    return () => clearTimeout(timer)
  }, [value])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={backgroundColor} strokeWidth={strokeWidth} />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>

      {/* Text in the middle */}
      <div
        className="absolute font-semibold text-center"
        style={{
          color: textColor,
          fontSize: `${size / 4}px`,
        }}
      >
        {progress}%
      </div>
    </div>
  )
}
