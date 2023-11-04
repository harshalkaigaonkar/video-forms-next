import UserForm from "@/components/client-form";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Form({form}) {
  console.log("repo", form)
  return (
    <main
      className={`flex text-black min-h-screen h-screen w-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <UserForm data={{...form, questions: form.questions.map((q) => ({
        ...q, options: JSON.parse(q.options)
      }))}} />
    </main>
  );
}

export const getServerSideProps = async (context) => {
  const id = context.query.form_id;
  console.log(id)
  const res = await fetch(`http://localhost:3000/api/get-form?id=${id}`);
  const result = await res.json();
  return { props: { form:result?.form } };
};
