import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState, useEffect } from "react";
import { addEdge } from "reactflow";

const EdgeDialogComponent = ({
  setEdges,
  nodes,
  setNodes,
  dialogOpen,
  setDialogOpen,
}) => {
  const [sourceNode, setSourceNode] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);

  const handleConnect = () => {
    const { source, target, params } = dialogOpen;
    setNodes((nodes) => {
      return nodes.map((node) => {
        if (node.id === source) {
          return {
            ...node,
            data: {
              ...node.data,
              options: node.data.options.map((option) => {
                if (option.value === selectedOption) {
                  return {
                    ...option,
                    target: target,
                  };
                }
                return option;
              }),
            },
          };
        }
        return node;
      });
    });
    setEdges((eds) =>
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
    setDialogOpen(null);
  };

  useEffect(() => {
    if (dialogOpen) {
      const { source } = dialogOpen;
      const sourceNode = nodes.find((node) => node.id === source);
      setSourceNode(sourceNode);
    }
  }, [dialogOpen, nodes]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
        <div className="grid gap-4 py-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {sourceNode?.data?.options
              .filter((item) => !item.target)
              .map((item) => (
                <div key={item.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={item.value}
                    id={`text-${item.value}`}
                  />
                  <Label htmlFor={`text-${item.value}`}>{item.value}</Label>
                </div>
              ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleConnect} type="submit">
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EdgeDialogComponent;
