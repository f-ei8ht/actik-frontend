"use client"

import { useEffect, useMemo } from "react"

import {
  ControlsContainer,
  SigmaContainer,
  ZoomControl,
  useLoadGraph,
} from "@react-sigma/core"
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2"
import Graph from "graphology"

import { themeColor } from "@/lib/oklch"
import type { DependencyGraph } from "@/lib/types"

function LoadGraph({ data }: { data: DependencyGraph }) {
  const loadGraph = useLoadGraph()

  useEffect(() => {
    const graph = new Graph()
    const isRoot = (id: string) => id === data.root

    data.nodes.forEach((node) => {
      graph.addNode(node.id, {
        label:
          node.type === "package"
            ? `${node.label}@${node.version ?? ""}`
            : node.label,
        size: isRoot(node.id) ? 10 : 4,
        color: isRoot(node.id)
          ? themeColor("--ring")
          : themeColor(
              node.type === "advisory" ? "--destructive" : "--primary"
            ),
        x: Math.random(),
        y: Math.random(),
      })
    })

    data.edges.forEach((edge) => {
      if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target)) return
      if (graph.hasEdge(edge.source, edge.target)) return
      graph.addEdge(edge.source, edge.target, {
        color:
          edge.type === "affected_by"
            ? themeColor("--destructive")
            : themeColor("--muted-foreground"),
        size: 1,
      })
    })

    loadGraph(graph, true)
  }, [data, loadGraph])

  return null
}

export default function GraphCanvas({ data }: { data: DependencyGraph }) {
  const settings = useMemo(
    () => ({
      allowInvalidContainer: true,
      renderLabels: true,
      labelRenderedSizeThreshold: 8,
      labelDensity: 1.2,
      minCameraRatio: 0.05,
      maxCameraRatio: 6,
    }),
    []
  )

  return (
    <div className="relative h-full w-full">
      <SigmaContainer settings={settings} style={{ height: "100%", width: "100%" }}>
        <LoadGraph data={data} />
        <ControlsContainer position="bottom-right">
          <LayoutForceAtlas2Control autoRunFor={1200} />
          <ZoomControl />
        </ControlsContainer>
      </SigmaContainer>
    </div>
  )
}