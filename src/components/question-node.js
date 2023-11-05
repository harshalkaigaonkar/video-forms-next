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
      <Card className="border rounded-md bg-white relative">
        {id === "1" && (
          <div className=" bg-black w-full mb-2 px-2 py-0.5 text-xs rounded-t-md text-white ">
            First node
          </div>
        )}
        <div className="p-2">
          <div>Question:</div>
          <div className="mb-2">{data.question}</div>
          <div>Type:</div>
          <div className=" capitalize mb-4">{data.type}</div>
          <Button className="w-full" onClick={handleNodeEdit(nodeId)}>
            Edit Node
          </Button>
        </div>
      </Card>
    </>
  );
};
