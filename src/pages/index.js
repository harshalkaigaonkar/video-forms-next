import Image from "next/image";
import { Inter } from "next/font/google";
import SaveRestore from "@/components/flow-editor";
import { ReactFlowProvider } from "reactflow";
import NodesProvider from "@/providers/NodesProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex text-black min-h-screen h-screen w-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <NodesProvider>
        <ReactFlowProvider>
          <SaveRestore />
        </ReactFlowProvider>
      </NodesProvider>
      <Toaster />
    </main>
  );
}
