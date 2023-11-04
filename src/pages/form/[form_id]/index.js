import UserForm from "@/components/client-form";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import UserInfoDialog from "@/components/user-info-dialog";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Form({ form }) {
  const { toast } = useToast();
  const [showUserModal, setShowUserModal] = useState(true);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!userInfo.name) {
      toast({
        variant: "destructive",
        title: "Please include a name.",
      });
      return;
    }
    if (!(userInfo.email.includes("@") && userInfo.email.includes("."))) {
      toast({
        variant: "destructive",
        title: "Please include '@/.' in the email address",
      });
      return;
    }

    setShowUserModal(false);
  };
  return (
    <main
      className={`flex text-black min-h-screen h-screen w-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {!showUserModal ? (
        <UserForm
          data={{
            ...form,
            questions: [
              ...form.questions.map((q) => ({
                ...q,
                options: JSON.parse(q.options),
              })),
            ],
          }}
          userInfo={userInfo}
        />
      ) : (
        <UserInfoDialog
          showUserModal={showUserModal}
          setShowUserModal={setShowUserModal}
          setUserInfo={setUserInfo}
          userInfo={userInfo}
          onSubmitHandler={onSubmitHandler}
        />
      )}
      <Toaster />
    </main>
  );
}

export const getServerSideProps = async (context) => {
  const id = context.query.form_id;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-form?id=${id}`);
  const result = await res.json();
  return { props: { form: result?.form } };
};
