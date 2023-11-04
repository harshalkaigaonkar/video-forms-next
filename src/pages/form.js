import UserForm from "@/components/client-form";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Form() {
  return (
    <main
      className={`flex text-black min-h-screen h-screen w-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <UserForm />
    </main>
  );
}
