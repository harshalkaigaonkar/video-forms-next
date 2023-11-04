import { Inter } from "next/font/google";
import { ReactFlowProvider } from "reactflow";
import NodesProvider from "@/providers/NodesProvider";
import { Toaster } from "@/components/ui/toaster";
import FlowEditor from "@/components/flow-editor";

const inter = Inter({ subsets: ["latin"] });

export default function Create() {
  return (
    <NodesProvider>
      <main
        className={`overflow-hidden flex flex-col text-black min-h-screen h-screen w-screen ${inter.className}`}
      >
        <nav className="fixed z-50 bg-white flex items-center border-b gap-2 w-full p-4 px-10 top-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className=" font-bold text-xl  sm:text-2xl   bg-clip-text text-transparent bg-gradient-to-b from-gray-300 via-gray-900 to-black ">
              VideoForms
            </h3>
          </div>
        </nav>
        <div className="flex-1">
          <ReactFlowProvider>
            <FlowEditor />
          </ReactFlowProvider>
          <Toaster />
        </div>
      </main>
    </NodesProvider>
  );
}
