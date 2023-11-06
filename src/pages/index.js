import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Github } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { internalsSymbol } from "reactflow";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ forms }) {
  const { toast } = useToast();
  const handleCopy = (formId) => () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/form/${formId}`)
      .then(() => {
        toast({
          variant: "success",
          description: "Copied to clipboard",
        });
      });
  };
  return (
    <main
      className={` text-black min-h-screen px-2 sm:px-4 h-screen w-screen ${inter.className}`}
    >
      <nav className=" bg-white justify-between flex items-center border-b gap-2 w-full p-4 px-2 sm:px-10 top-0">
        <div className="flex items-center gap-2">
          <h3 className=" font-bold text-2xl   bg-clip-text text-transparent bg-gradient-to-b from-gray-300 via-gray-900 to-black ">
            <Link href="/">VideoForms</Link>
          </h3>
        </div>
        <div className="flex flex-row gap-3">

        <Link className="" href="https://github.com/harshalkaigaonkar/video-forms-next">
          <Button variant="outline" size="icon"><Github className="w-4 h-4" /></Button>
        </Link>
        <Link className="" href="/create">
          <Button className="hidden sm:block">Create Form</Button>
          <Button className="flex sm:hidden text-xl items-center justify-center">
            +
          </Button>
        </Link>
        </div>
      </nav>
      <h3 className="mt-8 font-medium text-md text-black/50 border w-fit px-4 py-2 rounded-xl">
        My Forms / Admin
      </h3>
      <div className=" mt-3 py-4 sm:py-3 w-full gap-3 flex flex-row flex-wrap items-center justify-around">
        {forms.map((item) => (
          <Card className="px-0 w-80" key={item.id}>
            <CardContent className="relative h-96">
              <video
                autoPlay
                loop
                muted
                src={item.questions[0].video}
                className="absolute w-full h-full top-0 left-0 object-cover rounded-t-md rounded-b-none"
              ></video>
            </CardContent>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription className="text-black/30">
                {item.questions.length} questions
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Link href={`/${item.id}`}>View Answers</Link>
              </Button>
              <Button onClick={handleCopy(item.id)}>🚀 Share</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}

export const getServerSideProps = async (context) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/get-forms-for-user?id=${"admin"}`
  );
  const result = await res.json();
  return { props: { forms: result.forms } };
};
