import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  Loader,
  Pause,
  Play,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Label } from "./ui/label";
import dynamic from "next/dynamic";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Textarea } from "./ui/textarea";
import { Transition } from "@headlessui/react";
import { submitResponses } from "@/api-functions/answers.api";
import { useRouter } from "next/router";
import { useToast } from "./ui/use-toast";

const UserForm = ({
  data,
  setCurrentLevel,
  isLast,
  isFirst,
  setDataList,
  onSubmitForm,
  setQuestionsMapping,
  questionsMapping,
  length,
}) => {
  const [hoverControls] = useAutoAnimate();
  const [showControls, setShowControls] = useState(true);
  const [showPlay, setShowPlay] = useState(true);
  const [answer, setAnswer] = useState();
  const [showLoader, setShowLoader] = useState(true);
  const videoRef = useRef();

  useEffect(() => {
    const timeout = setTimeout(() => setShowControls(false), 2000);
    if (videoRef.current) {
      setShowLoader(false);
      videoRef.current.play();
    }
    setAnswer(data.answer);
    return () => {
      clearTimeout(timeout);
    };
  }, [data.answer]);

  const onPrevHandler = () => {
    if (questionsMapping.length === 0) {
      return;
    }
    const currLevel = questionsMapping.at(-1);
    setQuestionsMapping((mapping) => mapping.slice(0, -1));
    setCurrentLevel(currLevel);
  };

  const onNextHandler = () => {
    let nextStep;
    if (!!data.nextStep && data.nextStep !== -1 && data.type === "text")
      nextStep = data.nextStep;
    else {
      const nextBlockIndex = data.options.findIndex((i) => i.value === answer);

      if (nextBlockIndex !== -1) {
        nextStep = data.options[nextBlockIndex].nextNode;
      }
    }

    setDataList((d) => [
      ...d.map((item) => {
        if (item.id === data.id) {
          return { ...item, answer };
        }
        return item;
      }),
    ]);

    if (!nextStep) {
      nextStep = length - 1;
    }
    setCurrentLevel(nextStep);
    setQuestionsMapping((mapping) => [...mapping, nextStep]);
  };

  return (
    <Dialog defaultOpen={true} open={true} className="outline-none">
      <DialogContent className="p-0 w-full h-full md:max-w-[80%] md:h-[80%] flex flex-row gap-0">
        <div
          ref={hoverControls}
          className="relative md:w-1/2 w-full h-full bg-cover overflow-hidden"
          onMouseOver={() => {
            setShowControls(true);
          }}
          onMouseLeave={() => setTimeout(() => setShowControls(false), 1000)}
        >
          {showControls && (
            <>
              {showLoader ? (
                <>
                  <Loader />
                </>
              ) : (
                <Button
                  className="absolute z-40 rounded-full top-[45%] left-[45%] w-20 h-20 p-4 "
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    !!videoRef.current.paused
                      ? videoRef.current.play()
                      : videoRef.current.pause()
                  }
                >
                  {!showPlay ? (
                    <Play className="h-7 w-7" />
                  ) : (
                    <Pause className="h-7 w-7" />
                  )}
                </Button>
              )}
            </>
          )}
          <video
            ref={videoRef}
            onPlay={() => {
              setShowPlay(true);
              setShowLoader(false);
            }}
            onPause={() => setShowPlay(false)}
            onLoadedMetadata={() => videoRef.current?.play()}
            className="absolute w-full h-full top-0 left-0 object-cover rounded-2"
            src={data.video}
            onLoad={() => showLoader(true)}
            autoFocus
            autoPlay
          />
        </div>
        <div className="hidden md:flex w-1/2 py-8 px-5 flex-col justify-between">
          <Transition show={true} appear>
            <Transition.Child
              unmount
              appear
              enter="transition-all ease-out duration-300 delay-200"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <h1 className="font-bold text-xl">{data.label}</h1>
            </Transition.Child>
            {!!data.type &&
              (data.type === "text" ? (
                <Transition.Child
                  as={React.Fragment}
                  unmount
                  appear
                  enter="transition-all ease-out duration-300 delay-300"
                  enterFrom="opacity-0 translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-4"
                >
                  <Textarea
                    className="mt-5"
                    placeholder="something"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </Transition.Child>
              ) : (
                <Transition.Child
                  as={React.Fragment}
                  unmount
                  appear
                  enter="transition-all ease-out duration-300 delay-300"
                  enterFrom="opacity-0 translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-4"
                >
                  <RadioGroup
                    value={answer}
                    onValueChange={setAnswer}
                    className="mt-7"
                  >
                    {data.options.map((option, index) => (
                      <div key={index} className="   w-full  ">
                        <Label
                          htmlFor={`r${index + 1}`}
                          className="w-full flex items-center border rounded-xl cursor-pointer gap-2 p-4 m-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`r${index + 1}`}
                          />
                          {option.value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Transition.Child>
              ))}
          </Transition>
          <Transition
            show={true}
            as={React.Fragment}
            unmount
            appear
            enter="transition-all ease-out duration-300 delay-500"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-4"
          >
            <div className="flex flex-row justify-between items-center">
              {isLast ? (
                <>
                  <div class="flex-1" />
                  <Button
                    variant=""
                    type="submit"
                    onClick={onSubmitForm(data.id, answer)}
                  >
                    Submit 🔥
                  </Button>
                </>
              ) : (
                <>
                  {!isFirst ? (
                    <Button
                      variant="outline"
                      className="flex gap-1"
                      onClick={onPrevHandler}
                    >
                      <span>
                        <ArrowLeftCircleIcon size={15} />
                      </span>
                      Prev
                    </Button>
                  ) : (
                    <div className="flex-1" />
                  )}
                  <Button
                    className="flex gap-1"
                    onClick={onNextHandler}
                    disabled={!answer}
                  >
                    {" "}
                    Next {"   "}{" "}
                    <span>
                      <ArrowRightCircleIcon size={15} />
                    </span>
                  </Button>
                </>
              )}
            </div>
          </Transition>
        </div>
        <div className="md:hidden w-full h-auto max-h-[50%] overflow-auto absolute z-20 bottom-0 py-8 px-5 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/50 to-black/5 opacity-100">
          <Transition show={true} appear>
            <div className="overflow-auto text-white">
              <Transition.Child
                unmount
                appear
                enter="transition-all ease-out duration-300 delay-200"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <h1 className="font-bold text-xl">{data.label}</h1>
              </Transition.Child>
              {!!data.type &&
                (data.type === "text" ? (
                  <Transition.Child
                    as={React.Fragment}
                    unmount
                    appear
                    enter="transition-all ease-out duration-300 delay-300"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4"
                  >
                    <Textarea
                      className="mt-5 text-black"
                      placeholder="something"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                  </Transition.Child>
                ) : (
                  <Transition.Child
                    as={React.Fragment}
                    unmount
                    appear
                    enter="transition-all ease-out duration-300 delay-300"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4"
                  >
                    <RadioGroup
                      value={answer}
                      onValueChange={setAnswer}
                      className="mt-7"
                    >
                      {data.options.map((option, index) => (
                        <div key={index} className="   w-full  ">
                          <Label
                            htmlFor={`r${index + 1}`}
                            className="w-full flex items-center border rounded-xl cursor-pointer gap-2 p-4 m-2"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`r${index + 1}`}
                            />
                            {option.value}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </Transition.Child>
                ))}
            </div>
          </Transition>
          <Transition
            show={true}
            as={React.Fragment}
            unmount
            appear
            enter="transition-all ease-out duration-300 delay-500"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-4"
          >
            <div className="flex flex-row justify-between items-center mt-2 text-white">
              <>
                {!isFirst ? (
                  <Button
                    variant="outline"
                    className="flex gap-1 text-black"
                    onClick={onPrevHandler}
                  >
                    <span>
                      <ArrowLeftCircleIcon size={15} />
                    </span>
                    Prev
                  </Button>
                ) : (
                  <div className="flex-1" />
                )}
                <Button
                  className="flex gap-1"
                  onClick={onNextHandler}
                  disabled={!answer}
                >
                  {" "}
                  Next {"   "}{" "}
                  <span>
                    <ArrowRightCircleIcon size={15} />
                  </span>
                </Button>
              </>
            </div>
          </Transition>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserFormLevels = ({ data, userInfo }) => {
  const [parent] = useAutoAnimate();
  const { toast } = useToast();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [questionsData, setQuestionsData] = useState(data.questions);
  const [questionsMapping, setQuestionsMapping] = useState([0]);
  const router = useRouter();

  const onSubmitForm = (id, answer) => () => {
    const newQuestionsData = [
      ...questionsData.map((item) => {
        if (item.id === id) {
          return { ...item, answer };
        }
        return item;
      }),
    ];
    const body = {
      questions: newQuestionsData,
      user: userInfo,
    };

    submitResponses(body)
      .then((data) => {
        toast({
          variant: "success",
          title: "Thank you for your response.",
        });
        router.push(`/form/${data.id}/thanks`);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Something went wrong. Please try again.",
        });
      });
  };
  return (
    <div ref={parent}>
      {!!questionsData &&
        questionsData.map((item, index) => {
          const hasNextNode =
            (!!item.nextStep && item.nextStep !== -1 && item.type === "text") ||
            item.options.find((i) => i.nextNode !== -1);

          if (item.step === currentLevel) {
            return (
              <UserForm
                key={index}
                questionsMapping={questionsMapping}
                setQuestionsMapping={setQuestionsMapping}
                isLast={!hasNextNode}
                isFirst={index === 0}
                data={item}
                length={questionsData.length}
                setCurrentLevel={setCurrentLevel}
                setDataList={setQuestionsData}
                onSubmitForm={onSubmitForm}
              />
            );
          }
        })}
    </div>
  );
};

export default dynamic(() => Promise.resolve(UserFormLevels), { ssr: false });
