import { Handle, Position, useNodeId } from "reactflow";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNodesContext } from "@/providers/NodesProvider";

export const QuestionNode = ({ id, data, isConnectable }) => {
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
        position={Position.Left}
        id={id}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
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
