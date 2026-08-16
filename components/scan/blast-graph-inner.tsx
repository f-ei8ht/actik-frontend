"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  ZoomControl,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
} from "@react-sigma/core"
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2"
import Graph from "graphology"

import { themeColor } from "@/lib/oklch"
import type { DependencyGraph, DependencyGraphNode } from "@/lib/types"

const NODE_SIZES = { root: 10, package: 5, advisory: 4, repository: 3 }

function useThemeTick(): number {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const observer = new MutationObserver(() => setTick((t) => t + 1))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return tick
}

function LoadGraph({ data, themeTick }: { data: DependencyGraph; themeTick: number }) {
  const loadGraph = useLoadGraph()

  useEffect(() => {
    const graph = new Graph()
    const isRoot = (id: string) => id === data.root

    data.nodes.forEach((node) => {
      graph.addNode(node.id, {
        label: node.type === "package" ? `${node.label}@${node.version ?? ""}` : node.label,
        size: isRoot(node.id) ? NODE_SIZES.root : NODE_SIZES[node.type] ?? NODE_SIZES.package,
        color: isRoot(node.id)
          ? themeColor("--ring")
          : themeColor(node.type === "advisory" ? "--destructive" : "--primary"),
        x: Math.random(),
        y: Math.random(),
        nodeType: node.type,
      })
    })

    data.edges.forEach((edge) => {
      if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target)) return
      if (graph.hasEdge(edge.source, edge.target)) return
      graph.addEdge(edge.source, edge.target, {
        color: edge.type === "affected_by" ? themeColor("--destructive") : themeColor("--muted-foreground"),
        size: 1,
      })
    })

    loadGraph(graph, true)
  }, [data, loadGraph, themeTick])

  return null
}

function GraphEvents({
  onSelectNode,
  nodes,
}: {
  onSelectNode: (id: string | null) => void
  nodes: DependencyGraphNode[]
}) {
  const sigma = useSigma()
  const registerEvents = useRegisterEvents()
  const draggedNode = useRef<string | null>(null)
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  useEffect(() => {
    const clearHover = () => {
      const graph = sigma.getGraph()
      graph.forEachNode((node) => {
        graph.removeNodeAttribute(node, "highlighted")
        graph.removeNodeAttribute(node, "dimmed")
      })
      graph.forEachEdge((edge) => {
        graph.removeEdgeAttribute(edge, "dimmed")
      })
    }

    const highlight = (node: string) => {
      const graph = sigma.getGraph()
      const neighbors = graph.neighbors(node)

      graph.forEachNode((n) => {
        if (n === node || neighbors.includes(n)) {
          graph.setNodeAttribute(n, "highlighted", true)
          graph.removeNodeAttribute(n, "dimmed")
        } else {
          graph.setNodeAttribute(n, "dimmed", true)
        }
      })

      graph.forEachEdge((edge) => {
        const [s, t] = graph.extremities(edge)
        if (s === node || t === node) graph.removeEdgeAttribute(edge, "dimmed")
        else graph.setEdgeAttribute(edge, "dimmed", true)
      })
    }

    registerEvents({
      enterNode: (e) => highlight(e.node),
      leaveNode: clearHover,
      clickNode: (e) => onSelectNode(e.node),
      clickStage: () => onSelectNode(null),
      downNode: (e) => {
        draggedNode.current = e.node
        sigma.setCustomBBox(null)
      },
      mousemovebody: (e) => {
        if (!draggedNode.current) return
        const pos = sigma.viewportToGraph({ x: e.x, y: e.y })
        sigma.getGraph().setNodeAttribute(draggedNode.current, "x", pos.x)
        sigma.getGraph().setNodeAttribute(draggedNode.current, "y", pos.y)
      },
      mouseup: () => {
        draggedNode.current = null
      },
    })
  }, [sigma, registerEvents, onSelectNode])

  return null
}

export default function BlastGraphInner({ data }: { data: DependencyGraph }) {
  const [selected, setSelected] = useState<string | null>(null)
  const selectedNode = selected ? data.nodes.find((n) => n.id === selected) : null
  const themeTick = useThemeTick()

  const settings = useMemo(
    () => ({
      allowInvalidContainer: true,
      renderLabels: true,
      labelRenderedSizeThreshold: 8,
      labelDensity: 1.2,
      minCameraRatio: 0.05,
      maxCameraRatio: 6,
      nodeReducer: (node: string, nodeData: any) => {
        const res = { ...nodeData }
        if (nodeData.highlighted) {
          res.color = themeColor("--ring")
          res.size = res.size * 1.35
        } else if (nodeData.dimmed) {
          res.color = themeColor("--muted-foreground")
          res.label = ""
        }
        return res
      },
      edgeReducer: (edge: string, edgeData: any) => {
        const res = { ...edgeData }
        if (edgeData.dimmed) {
          res.color = themeColor("--muted-foreground")
          res.size = 0.3
        }
        return res
      },
    }),
    [themeTick],
  )

  return (
    <div className="relative h-full w-full">
      <SigmaContainer settings={settings} style={{ height: "100%", width: "100%" }}>
        <LoadGraph data={data} themeTick={themeTick} />
        <GraphEvents onSelectNode={setSelected} nodes={data.nodes} />
        <ControlsContainer position="bottom-right">
          <LayoutForceAtlas2Control autoRunFor={1500} />
          <ZoomControl />
          <FullScreenControl />
        </ControlsContainer>
      </SigmaContainer>

      {selectedNode && (
        <div className="absolute left-3 top-3 max-w-60 rounded-md border border-border bg-card p-3 shadow-md">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold text-card-foreground">
              {selectedNode.type === "package"
                ? `${selectedNode.label}@${selectedNode.version ?? ""}`
                : selectedNode.label}
            </p>
            <button
              type="button"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              &times;
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {selectedNode.type}
            {selectedNode.severity ? ` · ${selectedNode.severity}` : ""}
          </p>
        </div>
      )}
    </div>
  )
}
