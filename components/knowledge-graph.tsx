"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type VisualizationNode = {
  id: string;
  label: string;
  group?: number;
};

type SimulationNode = VisualizationNode & d3.SimulationNodeDatum;

type VisualizationEdge = {
  source: string;
  target: string;
};

type GraphOptions = {
  linkDistance?: number;
  chargeStrength?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  linkWidth?: number;
  fontSize?: number;
  animationDuration?: number;
  enableDrag?: boolean;
  enableZoom?: boolean;
  minZoom?: number;
  maxZoom?: number;
};

interface KnowledgeGraphProps {
  data: {
    nodes: VisualizationNode[];
    edges: VisualizationEdge[];
  };
  options?: GraphOptions;
}

// Refined color palette for a modern look
const PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"];

export function KnowledgeGraph({ data, options = {} }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const config = {
    linkDistance: 150,
    chargeStrength: -400,
    nodeWidth: 300,
    nodeHeight: 60,
    linkWidth: 2,
    fontSize: 16,
    animationDuration: 1000,
    enableDrag: true,
    enableZoom: true,
    minZoom: 0.5,
    maxZoom: 4,
    ...options,
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number) => {
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = "";
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length * 6 < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 2); // Max 2 lines
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svgEl = svgRef.current;
    const width = svgEl.clientWidth || 800;
    const height = svgEl.clientHeight || 600;

    const svg = d3.select(svgEl).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Zoom behavior with filter to avoid interfering with drag
    if (config.enableZoom) {
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([config.minZoom, config.maxZoom])
        .filter(event => {
          // Allow zoom only if not clicking on a node
          return !event.target.closest('g.node');
        })
        .on("zoom", (event) => g.attr("transform", event.transform));
      svg.call(zoom as any);
    }

    // Map nodes and links
    const nodes: SimulationNode[] = data.nodes.map(n => ({ ...n }));
    const links = data.edges.map<d3.SimulationLinkDatum<SimulationNode>>(e => ({
      source: e.source,
      target: e.target,
    }));

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink<SimulationNode, d3.SimulationLinkDatum<SimulationNode>>(links)
        .id(d => d.id)
        .distance(config.linkDistance)
      )
      .force("charge", d3.forceManyBody().strength(config.chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(config.nodeWidth / 2).strength(0.5))
      .alphaDecay(0.05);

    // Draw links
    const link = g.append("g")
      .attr("stroke", "#6b7280")
      .attr("stroke-opacity", 0.7)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", config.linkWidth)
      .attr("class", "transition duration-300 ease-in-out");

    // Draw nodes
    const node = g.append("g")
      .selectAll<SVGGElement, SimulationNode>("g")
      .data(nodes)
      .join("g")
      .attr("class", "node") // Add class for zoom filter
      .attr("cursor", "grab");

    // Create oval/rectangle background with shadow
    node.append("rect")
      .attr("width", 0)
      .attr("height", 0)
      .attr("rx", config.nodeHeight / 2)
      .attr("ry", config.nodeHeight / 2)
      .attr("x", -config.nodeWidth / 2)
      .attr("y", -config.nodeHeight / 2)
      .attr("fill", d => PALETTE[d.group ? (d.group - 1) % PALETTE.length : 0])
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .attr("class", "shadow-sm hover:shadow-md transition-shadow duration-200 p-5")
      .transition()
      .duration(config.animationDuration)
      .attr("width", config.nodeWidth)
      .attr("height", config.nodeHeight);

    // Add text with wrapping
    nodes.forEach((d, i) => {
      const textGroup = d3.select(node.nodes()[i]).append("g").attr("class", "text-group");
      const lines = wrapText(d.label, config.nodeWidth - 10);
      
      lines.forEach((line, lineIndex) => {
        textGroup.append("text")
          .text(line)
          .attr("text-anchor", "middle")
          .attr("dy", (lineIndex - (lines.length - 1) / 2) * 14)
          .attr("fill", "#ffffff")
          .attr("font-size", config.fontSize)
          .attr("font-weight", 500)
          .attr("pointer-events", "none");
      });
    });

    // Drag behavior
    if (config.enableDrag) {
      node.call(
        d3.drag<SVGGElement, SimulationNode>()
          .on("start", (event, d) => {
            console.log("Drag started for node:", d.id); // Debug
            // Pin all other nodes
            nodes.forEach(node => {
              if (node.id !== d.id) {
                node.fx = node.x;
                node.fy = node.y;
              } else {
                // Unfix the dragged node to allow movement
                d.fx = null;
                d.fy = null;
              }
            });
            // Change cursor to grabbing
            d3.select(event.sourceEvent.target.closest('g.node')).attr("cursor", "grabbing");
          })
          .on("drag", (event, d) => {
            console.log("Dragging node:", d.id, "to", event.x, event.y); // Debug
            // Update the dragged node's position
            d.x = event.x;
            d.y = event.y;
            // Update node position
            d3.select(event.sourceEvent.target.closest('g.node')).attr("transform", `translate(${d.x},${d.y})`);
            // Update connected links
            link
              .attr("x1", l => (l.source as SimulationNode).id === d.id ? d.x! : (l.source as SimulationNode).x!)
              .attr("y1", l => (l.source as SimulationNode).id === d.id ? d.y! : (l.source as SimulationNode).y!)
              .attr("x2", l => (l.target as SimulationNode).id === d.id ? d.x! : (l.target as SimulationNode).x!)
              .attr("y2", l => (l.target as SimulationNode).id === d.id ? d.y! : (l.target as SimulationNode).y!);
          })
          .on("end", (event, d) => {
            console.log("Drag ended for node:", d.id); // Debug
            // Fix the dragged node's position
            d.fx = d.x;
            d.fy = d.y;
            // Reset cursor
            d3.select(event.sourceEvent.target.closest('g.node')).attr("cursor", "grab");
          })
      );
    }

    // Update positions during initial simulation
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as SimulationNode).x!)
        .attr("y1", d => (d.source as SimulationNode).y!)
        .attr("x2", d => (d.target as SimulationNode).x!)
        .attr("y2", d => (d.target as SimulationNode).y!);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Stop simulation after initial animation
    setTimeout(() => {
      console.log("Stopping simulation and fixing nodes"); // Debug
      simulation.stop();
      nodes.forEach(d => {
        d.fx = d.x;
        d.fy = d.y;
      });
    }, config.animationDuration);

    return () => {
      console.log("Cleaning up simulation"); // Debug
      simulation.stop();
    };
  }, [
    data,
    config.linkDistance,
    config.chargeStrength,
    config.nodeWidth,
    config.nodeHeight,
    config.linkWidth,
    config.fontSize,
    config.animationDuration,
    config.enableDrag,
    config.enableZoom,
    config.minZoom,
    config.maxZoom,
  ]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-[75vh] rounded-lg"
      style={{ background: "linear-gradient(145deg, #f9fafb 0%, #e5e7eb 100%)" }}
    />
  );
}

export default KnowledgeGraph;