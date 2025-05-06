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

interface KnowledgeGraphProps {
  data: VisualizationData
}

export function KnowledgeGraph({ data }: KnowledgeGraphProps) {
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
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))

    // Create the SVG container
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

    // Add zoom functionality
    const g = svg.append("g")

    svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.1, 8])
        .on("zoom", (event) => {
          g.attr("transform", event.transform)
        }) as any,
    )

    // Process the data
    const nodes = data.nodes.map((node) => ({ ...node }))
    const links = data.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      label: edge.label || "relates to",
    }))

    // Create the links
    const link = g.append("g").selectAll(".link").data(links).join("g").attr("class", "link")

    // Add lines for links
    link.append("line").attr("stroke", "#999").attr("stroke-opacity", 0.6).attr("stroke-width", 2)

    // Add labels to links
    link
      .append("text")
      .attr("dy", -5)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .attr("font-size", "10px")
      .text((d: any) => d.label)

    // Create the nodes
    const node = g
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 25)
      .attr("fill", (d: any) => {
        const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]
        return colors[d.group ? (d.group - 1) % colors.length : 0]
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)

    // Add labels to nodes
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .text((d: any) => d.label)
      .attr("fill", "#fff")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")

    // Update positions on simulation tick
    simulation.nodes(nodes as any).on("tick", () => {
      link
        .select("line")
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      link
        .select("text")
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2)

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
