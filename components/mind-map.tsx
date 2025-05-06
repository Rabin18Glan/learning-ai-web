"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

type VisualizationNode = {
  id: string
  label: string
  group?: number
}

type VisualizationEdge = {
  source: string
  target: string
  label?: string
}

type VisualizationData = {
  nodes: VisualizationNode[]
  edges: VisualizationEdge[]
}

interface MindMapProps {
  data: VisualizationData
}

export function MindMap({ data }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data) return

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Create a force simulation
    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))

    // Create the SVG container
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

    // Process the data
    const nodes = data.nodes.map((node) => ({ ...node }))
    const links = data.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    }))

    // Create the links
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2)

    // Create the nodes
    const node = svg
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 20)
      .attr("fill", (d: any) => {
        const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]
        return colors[d.group ? (d.group - 1) % colors.length : 0]
      })

    // Add labels to nodes
    node
      .append("text")
      .attr("dx", 25)
      .attr("dy", 5)
      .text((d: any) => d.label)
      .attr("fill", "currentColor")
      .attr("font-size", "12px")

    // Update positions on simulation tick
    simulation.nodes(nodes as any).on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    simulation.force(
      "link",
      d3.forceLink(links as any).id((d: any) => d.id),
    )

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [data])

  return <svg ref={svgRef} className="w-full h-full"></svg>
}
