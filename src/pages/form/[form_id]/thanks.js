import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Form({ form }) {
  return (
    <main
      className={`flex text-black min-h-screen h-screen w-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Dialog defaultOpen={true} open={true} className="outline-none">
        <DialogContent className="p-0 w-full h-full md:max-w-[80%] md:h-[80%] flex flex-row gap-0"></DialogContent>
      </Dialog>
    </main>
  );
}
