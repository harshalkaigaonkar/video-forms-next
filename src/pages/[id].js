import UserForm from "@/components/client-form";
import { useToast } from "@/components/ui/use-toast";
import UserInfoDialog from "@/components/user-info-dialog";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Form({ form }) {
  console.log(form);

  return (
    <main
      className={`flex text-black min-h-screen h-screen w-screen flex-col items-center justify-between p-24 ${inter.className}`}
    ></main>
  );
}

export const getServerSideProps = async (context) => {
  const id = context.query.form_id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/get-form-answers-by-questions?id=${id}`
  );
  const result = await res.json();
  return { props: { form: result?.form } };
};
