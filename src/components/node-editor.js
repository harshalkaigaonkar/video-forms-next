import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Sheet,
} from "./ui/sheet";
import { DeleteIcon } from "lucide-react";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { useNodesContext } from "@/providers/NodesProvider";
import { useState, useEffect } from "react";
import CloudinaryUploadWidget from "./cloudinary-uploader";

const NodeEditor = ({ nodes, setNodes }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeData, setNodeData] = useState({
    type: "text",
  });
  const { data, dispatch } = useNodesContext();
  const [options, setOptions] = useState([
    {
      value: "",
      target: null,
    },
  ]);

  useEffect(() => {
    if (data.id === "new") {
      setNodeData((prev) => ({
        ...prev,
        question: "default",
        type: "text",
        video: null,
      }));
      setOptions([""]);
      setOpen(true);
    } else if (data.id) {
      const selectedNode = nodes.find((item) => item.id === data.id);
      setSelectedNode(selectedNode);
      setNodeData({ ...selectedNode.data });
      setOptions([...selectedNode.data.options, ""]);
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
    setOptions((prev) => [
      ...prev,
      {
        value: "",
        target: null,
      },
    ]);
  };

  const handleRemoveOptions = (index) => () => {
    if (options.length < 2) {
      toast({
        variant: "destructive",
        title: "Minimum 1 option required",
      });
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionsChange = (index) => (event) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = {
        ...newOptions[index],
        value: event.target.value,
      };
      return newOptions;
    });
  };

  const handleTypeChange = (value) => {
    setNodeData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleClose = () => {
    dispatch({
      type: "reset",
    });
    setOpen(false);
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
      !options?.filter((item) => !!item.value.trim()).length
    ) {
      toast({
        variant: "destructive",
        title: "Options cannot be empty",
      });
      return;
    }

    // check if same options
    const isSameOptions = (options) => {
      const uniqueOptions = [
        ...new Set(options.map((option) => option.value.trim())),
      ];
      return uniqueOptions.length !== options.length;
    };

    if (nodeData?.type === "mcq" && isSameOptions(options)) {
      toast({
        variant: "destructive",
        title: "Options cannot be same",
      });
      return;
    }

    if (!nodeData?.video) {
      toast({
        variant: "destructive",
        title: "Video cannot be empty",
      });
      return;
    }

    if (data.id === "new") {
      const newNode = {
        id: String(nodes.length + 1),
        type: "questionNode",
        data: { ...nodeData, ...{ options } },
        position: {
          x: 400,
          y: 400,
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
                ...{ options },
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
    <Sheet className="bg-white" open={open}>
      <SheetContent className=" overflow-y-auto ">
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
            <div className="my-1 mt-4">Video: </div>
            {!!nodeData?.video && (
              <p className=" truncate text-ellipsis ">{nodeData.video}</p>
            )}
            {!!nodeData?.video && (
              <video controls className="my-4" src={nodeData.video}></video>
            )}
            <CloudinaryUploadWidget
              setPublicId={(url) => {
                setNodeData((prev) => ({
                  ...prev,
                  video: url,
                }));
              }}
              uwConfig={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET,
              }}
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
                <Input
                  onChange={handleOptionsChange(index)}
                  value={item.value}
                />
                <DeleteIcon onClick={handleRemoveOptions(index)} />
                <PlusCircleIcon onClick={handleAddOptions} />
              </div>
            ))}
        </div>
        <SheetFooter>
          <Button onClick={handleSave} type="submit">
            Save changes
          </Button>
          <Button onClick={handleClose} variant="secondary">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NodeEditor;
