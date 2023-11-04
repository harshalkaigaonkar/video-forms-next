import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ forms }) {
  return (
    <main
      className={` text-black min-h-screen px-2 sm:px-4 h-screen w-screen ${inter.className}`}
    >
      <nav className="sticky bg-white justify-between flex items-center border-b gap-2 w-full p-4 px-10 top-0">
        <div className="flex items-center gap-2">
          <h3 className=" font-bold text-2xl   bg-clip-text text-transparent bg-gradient-to-b from-gray-300 via-gray-900 to-black ">
            VideoForms
          </h3>
        </div>
        <Link className=" hidden sm:block" href="/create">
          <Button>Create Form</Button>
        </Link>
      </nav>
      <div className=" max-w-[1080px] px-0 py-4 sm:py-8 w-full mx-auto gap-4 grid grid-cols-1 sm:grid-cols-2 ">
        {forms.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-end">
              <Button>🚀 Share</Button>
            </CardFooter>
          </Card>
        ))}
        <Link href={"/create"} className="absolute bottom-4 right-4 sm:hidden">
          <Button>Create Form</Button>
        </Link>
      </div>
    </main>
  );
}

export const getServerSideProps = async (context) => {
  const res = await fetch(
    `http://localhost:3000/api/get-forms-for-user?id=${"admin"}`
  );
  const result = await res.json();
  return { props: { forms: result.forms } };
};
