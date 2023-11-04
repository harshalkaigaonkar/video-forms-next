import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
  Handle,
  Position,
  Controls,
  useNodeId,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Sheet,
} from "./ui/sheet";
import { useNodesContext } from "@/providers/NodesProvider";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { DeleteIcon } from "lucide-react";
import { PlusCircleIcon } from "lucide-react";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const flowKey = "example-flow";

const getNodeId = () => `randomnode_${+new Date()}`;

const initialNodes = [
  {
    id: "1",
    type: "questionNode",
    data: { question: "A default question", options: [], type: "text" },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

const QuestionNode = ({ id, data, isConnectable }) => {
  const { dispatch } = useNodesContext();
  const handleNodeEdit = (id) => () => {
    dispatch({
      type: "set-edit",
      id,
    });
  };

  const nodeId = useNodeId();

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id={id}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={id}
        isConnectable={isConnectable}
      />
      <Card className="border bg-white p-4">
        <div>Question:</div>
        <div className="mb-2">{data.question}</div>
        <div>Type:</div>
        <div className=" capitalize mb-4">{data.type}</div>
        <Button onClick={handleNodeEdit(nodeId)}>Edit Node</Button>
      </Card>
    </>
  );
};

const nodeTypes = {
  questionNode: QuestionNode,
};

const SheetComponent = ({ nodes, setNodes }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeData, setNodeData] = useState({
    type: "text",
  });
  const { data, dispatch } = useNodesContext();
  const [options, setOptions] = useState([""]);

  useEffect(() => {
    if (data.id === "new") {
      setNodeData((prev) => ({
        ...prev,
        question: "default",
        type: "text",
      }));
      setOpen(true);
    } else if (data.id) {
      const selectedNode = nodes.find((item) => item.id === data.id);
      setSelectedNode(selectedNode);
      setNodeData({ ...selectedNode.data });
      setOpen(true);
    }
  }, [data.id, setSelectedNode, nodes]);

  const handleQuestionChange = (event) => {
    setNodeData((prev) => ({
      ...prev,
      question: event.target.value,
    }));
  };

  const handleAddOptions = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const handleRemoveOptions = (index) => () => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionsChange = (index) => (event) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = event.target.value;
      return newOptions;
    });
  };

  const handleTypeChange = (value) => {
    setNodeData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleOpenChange = (openValue) => {
    if (!openValue) {
      dispatch({
        type: "reset",
      });
    }
    setOpen(openValue);
  };

  const handleSave = () => {
    // check the nodeData

    if (!nodeData?.question?.trim()) {
      toast({
        variant: "destructive",
        title: "Question cannot be empty",
      });
      return;
    }

    if (!nodeData?.type) {
      toast({
        variant: "destructive",
        title: "Type cannot be empty",
      });
      return;
    }

    if (
      nodeData?.type === "mcq" &&
      !options?.filter((item) => !!item.trim()).length
    ) {
      toast({
        variant: "destructive",
        title: "Options cannot be empty",
      });
      return;
    }

    if (data.id === "new") {
      const newNode = {
        id: getNodeId(),
        type: "questionNode",
        data: { ...nodeData, ...(nodeData?.type === "mcq" && { options }) },
        position: {
          x: 0,
          y: 0,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    } else if (data.id) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === data.id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...nodeData,
                ...(nodeData?.type === "mcq" && { options }),
              },
            };
          }
          return node;
        })
      );
    }
    dispatch({
      type: "reset",
    });
    setOpen(false);
  };

  return (
    <Sheet className="bg-white" open={open} onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {data.id === "new" ? "Add Node" : "Edit Node"}
          </SheetTitle>
          <SheetDescription>
            Make changes to your node here. Click save when done.
          </SheetDescription>
        </SheetHeader>
        <div>
          <div className="my-4">
            <div className="my-1">Question:</div>
            <Input
              id="question"
              onChange={handleQuestionChange}
              value={nodeData?.question || ""}
              className="col-span-3"
            />
          </div>
          <div className="my-4">
            <div className="my-1">Answer type:</div>
            <RadioGroup
              onValueChange={handleTypeChange}
              value={nodeData?.type || "text"}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text-option" />
                <Label htmlFor="text-option">Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mcq" id="mcq-option" />
                <Label htmlFor="mcq-option">MCQ</Label>
              </div>
            </RadioGroup>
          </div>
          {nodeData?.type === "mcq" && (
            <div className="mt-4 mb-2">Options:</div>
          )}
          {nodeData?.type === "mcq" &&
            options.map((item, index) => (
              <div
                className="flex items-center gap-2 mb-4"
                key={index + "options"}
              >
                <Input onChange={handleOptionsChange(index)} value={item} />
                <DeleteIcon onClick={handleRemoveOptions(index)} />
                <PlusCircleIcon onClick={handleAddOptions} />
              </div>
            ))}
        </div>
        <SheetFooter>
          <Button onClick={handleSave} type="submit">
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const EdgeDialogComponent = ({ setEdges, edges }) => {
  const handleConnect = () => {
    console.log("connected");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Choose edge connection</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose edge connection</DialogTitle>
          <DialogDescription>
            Select the option based on which the source will be connected to the
            target
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button onClick={handleConnect} type="submit">
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SaveRestore = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback(
    (params) => {

      const sourceNodeId = params.source;
      const targetNodeID = params.target;

      const sourceNode = nodes.find((node) => node.id === sourceNodeId);
      const targetNode = nodes.find((node) => node.id === targetNodeID);

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

      if(sourceNode.data.type === "mcq"){

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
    [setEdges, nodes, toast]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      console.log(flow);
    }
  }, [rfInstance]);

  const { dispatch } = useNodesContext();
  const onAdd = useCallback(() => {
    dispatch({
      type: "new-node",
    });
  }, [dispatch]);

  return (
    <>
      <SheetComponent nodes={nodes} setNodes={setNodes} />
      {dialogOpen && (
        <EdgeDialogComponent
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      )}
      <ReactFlow
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
