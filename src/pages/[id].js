import { Inter } from "next/font/google";
import { ReactFlowProvider } from "reactflow";
import NodesProvider from "@/providers/NodesProvider";
import { Toaster } from "@/components/ui/toaster";
import FlowEditor from "@/components/flow-editor";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex text-black min-h-screen h-screen w-screen flex-col items-center justify-between p-24 ${inter.className}`}
    ></main>
  );
}

export const getServerSideProps = async (context) => {
  const id = context.query.id;
  const res = await fetch(`http://localhost:3000/api/get-form?id=${id}`);
  const repo = await res.json();
  console.log(repo);
  return { props: { repo } };
};
