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
import SaveFormDialog from "./save-form-dialog";
import { useRouter } from "next/router";

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
      video: null,
    },
    label: "cool",
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

const nodeTypes = {
  questionNode: QuestionNode,
};

const FlowEditor = () => {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewPort } = useReactFlow();
  const router = useRouter();

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

  const onSave = useCallback(
    (formName) => {
      if (rfInstance) {
        const flow = rfInstance.toObject();

        if (!formName.trim()) {
          toast({
            variant: "destructive",
            title: "Form name cannot be empty",
          });
          return;
        }

        const validNodes = nodes.reduce((prev, node) => {
          return prev && !!node?.data?.video && !!node?.data?.question?.trim();
        }, true);

        if (validNodes) {
          createForm({
            nodes: flow.nodes,
            edges: flow.edges,
            formName,
          })
            .then(() => {
              toast({
                variant: "success",
                title: "Form saved",
              });
              router.push("/");
              setSaveModalOpen(false);
            })
            .catch((error) => {
              toast({
                variant: "destructive",
                title: "Something went wrong",
              });
            });
        } else {
          toast({
            variant: "destructive",
            title: "All nodes must have a question and a video",
          });
          return;
        }
      }
    },
    [rfInstance, toast, nodes, router]
  );

  const { dispatch } = useNodesContext();
  const onAdd = useCallback(() => {
    dispatch({
      type: "new-node",
    });
  }, [dispatch]);

  const handleSave = () => {
    setSaveModalOpen(true);
  };

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
      {!!saveModalOpen && (
        <SaveFormDialog
          onSave={onSave}
          dialogOpen={saveModalOpen}
          setDialogOpen={setSaveModalOpen}
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
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={onAdd}>Add node</Button>
        </Panel>
        <Controls />
      </ReactFlow>
    </>
  );
};

export default FlowEditor;
