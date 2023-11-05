import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Label } from "@radix-ui/react-label";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

const AnswerAnalytics = ({ form }) => {
  return (
    <div className="w-full">
      <nav className=" bg-white justify-between flex items-center border-b gap-2 w-full p-4 px-10 top-0">
        <div className="flex items-center gap-2">
          <h3 className=" font-bold text-2xl   bg-clip-text text-transparent bg-gradient-to-b from-gray-300 via-gray-900 to-black ">
            <Link href="/">VideoForms</Link>
          </h3>
        </div>
        <Link className=" hidden sm:block" href="/create">
          <Button>Create Form</Button>
        </Link>
      </nav>
      <h3 className="mx-4 sm:mx-10 mt-8 font-medium text-md text-black/50 border w-fit px-4 py-2 rounded-xl">
        Answers / Form / {form?.id}
      </h3>
      <div className="mx-4 sm:mx-10 mt-5">
        <h6 className="text-sm font-bold">Name</h6>
        <h4 className="font-medium  text-xl text-black/80">{form?.name}</h4>
        <h3 className="font-bold text-sm mt-10">Questions</h3>
        <Accordion type="single" collapsible className="w-full">
          {!!form.questions &&
            form.questions.map((question, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger>
                  <div className="flex flex-col items-start">
                    <p className="sm:text-xl text-base text-left font-normal">
                      {question?.label}
                    </p>
                    <p className="text-sm font-normal text-black/50">
                      {question?.type} type | {question?.Answers?.length}{" "}
                      answers
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <h2 className="my-3 ">Answers</h2>
                  {!!question.type && question.type === "text" ? (
                    <>
                      <div className="flex flex-col gap-3">
                        {!!question?.Answers &&
                          question?.Answers?.map((ans, index, arr) => (
                            <div key={index}>
                              <p className="text-xs font-normal text-black/70">
                                {ans.response.user.name},{" "}
                                {ans.response.user.email}
                              </p>
                              <p className="text-lg font-semibold">
                                {ans.answer}
                              </p>
                              {arr.length - 1 !== index && <hr />}
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    question.type === "mcq" && (
                      <>
                        <div className="flex flex-col gap-3">
                          {!!question.options &&
                            JSON.parse(question?.options).map(
                              (option, index) => (
                                <MCQAnswers
                                  key={index}
                                  question={question}
                                  option={option}
                                  index={index}
                                />
                              )
                            )}
                        </div>
                      </>
                    )
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
};

const MCQAnswers = ({ question, option, index }) => {
  const [parent] = useAutoAnimate();
  const percentage = useMemo(() => {
    const totalAnswers = question?.Answers?.length;
    const obtAns = question?.Answers?.filter(
      (ans) => ans?.answer === option?.value
    )?.length;
    return (obtAns / totalAnswers) * 100;
  }, [question, option]);
  return (
    <div key={index} className="flex flex-col gap-2 w-[60%]">
      <div className="w-full flex justify-between items-center">
        <p className="text-md font-medium">
          {index + 1} option | {option.value}
        </p>
        <p className="text-black/60">{percentage}%</p>
      </div>
      <Progress ref={parent} value={percentage} className="w-full h-1" />
    </div>
  );
};

export default dynamic(() => Promise.resolve(AnswerAnalytics), { ssr: false });
