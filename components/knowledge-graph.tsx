"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

type VisualizationNode = {
  id: string
  label: string
  group?: number
}

// Extend D3’s node datum to include physics props
type SimulationNode = VisualizationNode & d3.SimulationNodeDatum

type VisualizationEdge = {
  source: string
  target: string
}

// Extend D3’s link datum so source/target can be SimulationNode
type SimulationLink = d3.SimulationLinkDatum<SimulationNode> & {
  source: string
  target: string
}

interface KnowledgeGraphProps {
  data: {
    nodes: VisualizationNode[]
    edges: VisualizationEdge[]
  }
}

export function KnowledgeGraph({ data }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // — Prepare dimensions
    const svgEl = svgRef.current
    const width = svgEl.clientWidth
    const height = svgEl.clientHeight

    // — Clear previous content
    const svg = d3.select(svgEl).attr("width", width).attr("height", height)
    svg.selectAll("*").remove()

    // — Create a group for zoom/pan
    const g = svg.append("g")
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 4])
        .on("zoom", (evt) => g.attr("transform", evt.transform))
    ) as any

    // — Cast & map input data into simulation-compatible objects
    const nodes: SimulationNode[] = data.nodes.map((n) => ({ ...n }))
    const links: SimulationLink[] = data.edges.map((e) => ({
      source: e.source,
      target: e.target
    }))

    // — Initialize force simulation with strong typing
    const simulation = d3.forceSimulation<SimulationNode>(nodes)                                 // :contentReference[oaicite:2]{index=2}
      .force(
        "link",
        d3.forceLink<SimulationNode, SimulationLink>(links)
          .id((d) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))

    // — Draw links as lines
    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5)

    // — Draw nodes as groups (circle + label)
    const node = g.append("g")
      .selectAll<SVGGElement, SimulationNode>("g")
      .data(nodes)
      .join("g")
      .call(
        d3.drag<SVGGElement, SimulationNode>()                                              // :contentReference[oaicite:3]{index=3}
          .on("start", (evt, d) => {
            if (!evt.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y                                                        // :contentReference[oaicite:4]{index=4}
          })
          .on("drag", (evt, d) => {
            d.fx = evt.x; d.fy = evt.y
          })
          .on("end", (evt, d) => {
            if (!evt.active) simulation.alphaTarget(0) 
            // Note: we do NOT set d.fx/d.fy = null ⇒ node stays where dropped :contentReference[oaicite:5]{index=5}
          })
      )

    // — Circle with entry animation
    node.append("circle")
      .attr("r", 0)
      .attr("fill", (d) => {
        const pal = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
        return pal[d.group ? (d.group - 1) % pal.length : 0]
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .transition()
      .duration(500)
      .attr("r", 20)

    // — Label
    node.append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("fill", "#fff")
      .attr("font-size", 10)
      .attr("pointer-events", "none")

    // — Tick handler updates positions
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => (d.source as SimulationNode).x!)
        .attr("y1", (d: any) => (d.source as SimulationNode).y!)
        .attr("x2", (d: any) => (d.target as SimulationNode).x!)
        .attr("y2", (d: any) => (d.target as SimulationNode).y!)

      node.attr("transform", (d) => `translate(${d.x},${d.y})`)
    })

    // — Clean up on unmount
    return () => {
      simulation.stop()
    }
  }, [data])

  return <svg ref={svgRef} className="w-full h-full" />
}
