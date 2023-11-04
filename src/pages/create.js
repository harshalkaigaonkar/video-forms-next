import { Inter } from "next/font/google";
import { ReactFlowProvider } from "reactflow";
import NodesProvider from "@/providers/NodesProvider";
import { Toaster } from "@/components/ui/toaster";
import FlowEditor from "@/components/flow-editor";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Create() {
  const [formName, setFormName] = useState("");

  return (
    <NodesProvider>
      <main
        className={`overflow-hidden flex flex-col text-black min-h-screen h-screen w-screen ${inter.className}`}
      >
        <nav className="fixed z-50 bg-white flex items-center border-b gap-2 w-full p-4 px-10 top-0">
          <div className="flex items-center gap-2">
            <h3 className=" font-bold text-2xl   bg-clip-text text-transparent bg-gradient-to-b from-gray-300 via-gray-900 to-black ">
              VideoForms /
            </h3>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-[180px]"
              placeholder="Enter form name"
            />
          </div>
        </nav>
        <div className="flex-1">
          <ReactFlowProvider>
            <FlowEditor formName={formName} />
          </ReactFlowProvider>
          <Toaster />
        </div>
      </main>
    </NodesProvider>
  );
}
