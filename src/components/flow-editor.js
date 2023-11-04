import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "./ui/button";
import { useNodesContext } from "@/providers/NodesProvider";

import { useToast } from "./ui/use-toast";

import NodeEditor from "./node-editor";
import EdgeDialogComponent from "./create-edge-dialog";
import { QuestionNode } from "./question-node";
import { useCreateFormInstanceQuery } from "@/hooks/useFormInstanceQuery";
import { createForm } from "@/api-functions/formInstance.api";

const flowKey = "example-flow";

const initialNodes = [
  {
    id: "1",
    type: "questionNode",
    data: {
      question: "A default question",
      options: [],
      type: "text",
      label: "cool",
    },
    label: "cool",
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

const nodeTypes = {
  questionNode: QuestionNode,
};

const SaveRestore = ({ formName }) => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewPort } = useReactFlow();

  // const { mutate: createForm } = useCreateFormInstanceQuery({});

  const onConnect = useCallback(
    (params) => {
      const sourceNodeId = params.source;
      const targetNodeID = params.target;

      const sourceNode = nodes.find((node) => node.id === sourceNodeId);

      if (sourceNode.data.type === "text") {
        const number = edges.reduce((prev, edge) => {
          return Number(edge.source === sourceNodeId) + prev;
        }, 0);

        if (number > 0) {
          toast({
            variant: "destructive",
            title: "Text node cannot be connected to more than 1 node",
          });
          return;
        }
      }

      if (sourceNode.data.type === "mcq") {
        const isConnected = sourceNode.data.options.find((option) => {
          return option.target === targetNodeID;
        });

        if (isConnected) {
          toast({
            variant: "destructive",
            title: "Option already connected",
          });
          return;
        }

        const isSlotAvailable = sourceNode.data.options.find((option) => {
          return !option.target;
        });

        if (!isSlotAvailable) {
          toast({
            variant: "destructive",
            title: "All options are already connected",
          });
          return;
        }

        setDialogOpen({
          source: sourceNodeId,
          target: targetNodeID,
          params: params,
        });

        return;
      }

      return setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: {
              stroke: "#000",
            },
          },
          eds
        )
      );
    },
    [setEdges, nodes, toast, setDialogOpen, edges]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      console.log(flow);
      createForm({
        nodes: flow.nodes,
        edges: flow.edges,
        formName,
      });
    }
  }, [rfInstance, formName]);

  const { dispatch } = useNodesContext();
  const onAdd = useCallback(() => {
    dispatch({
      type: "new-node",
    });
  }, [dispatch]);

  return (
    <>
      <NodeEditor nodes={nodes} setNodes={setNodes} />
      {!!dialogOpen && (
        <EdgeDialogComponent
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          nodes={nodes}
          setEdges={setEdges}
          edges={edges}
          setNodes={setNodes}
        />
      )}
      <ReactFlow
        className="border"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        connectionLineStyle={{
          stroke: "#000000",
          strokeWidth: 2,
        }}
      >
        <Panel className="flex gap-2" position="bottom-right">
          <Button onClick={onSave}>Save</Button>
          <Button onClick={onAdd}>Add node</Button>
        </Panel>
        <Controls />
      </ReactFlow>
    </>
  );
};

export default SaveRestore;
