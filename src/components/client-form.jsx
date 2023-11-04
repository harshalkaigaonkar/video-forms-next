import { ArrowLeft, ArrowLeftCircleIcon, ArrowRightCircleIcon, CopyIcon, Loader, Pause, Play } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import dynamic from 'next/dynamic'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Textarea } from './ui/textarea'
import { Audio } from 'react-loader-spinner'
import { Transition } from '@headlessui/react'

// const data = [
//     {
//         video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         label: "Q1. How was your experience on interviewing with our company?",
//         type: "text" ,
//         nextBlock: 1,
//     },
//     {
//         video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         label: "Q2. How many interview rounds was there while interviewing process?",
//         type: "mcq",
//         options: [
//             {
//                 value: "4 Rounds",
//                 nextBlock: 2,
//             },
//             {
//                 value: "3 Rounds",
//                 nextBlock: 3,
//             },
//             {
//                 value: "2 Rounds",
//                 nextBlock: 4,
//             },
//         ],
//         nextBlock: null
//     },
//     {
//         video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         label: "Q3. How was your experience with interviewing for a senior position role?",
//         type: "text" ,
//         nextBlock: 4,
//     },
//     {
//         video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         label: "Q3. How was your experience with interviewing for a junior position role?",
//         type: "text" ,
//         nextBlock: 4,
//     },
//     {
//         video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         label: "Q4. How will you rate the overall interview experience with us?",
//         type: "mcq",
//         options: [
//             {
//                 value: "1",
//                 nextBlock: 5,
//             },
//             {
//                 value: "2",
//                 nextBlock: 5,
//             },
//             {
//                 value: "3",
//                 nextBlock: 5,
//             },
//             {
//                 value: "4",
//                 nextBlock: 5,
//             },
//             {
//                 value: "5",
//                 nextBlock: 5,
//             },
//         ],
//         nextBlock: null
//     },
//     {
//         video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         label: "Q5. Thanks for taking this Survey, will see you soon ✌️",
//         type: null ,
//         nextBlock: null,
//     },
//     ]


const UserForm = ({data, setCurrentLevel, setAnswers, isLast, isFirst}) => {
    const [hoverControls] = useAutoAnimate();
    const [showControls, setShowControls] = useState(true);
    const [showPlay, setShowPlay] = useState(true);
    const [answer, setAnswer] = useState();
    const [showLoader, setShowLoader] = useState(true);
    const videoRef = useRef();


    useEffect(() => {
        const timeout = setTimeout(() => setShowControls(false), 2000)
        if(videoRef.current) {
            setShowLoader(false)
            videoRef.current.play();
        }
        return () => {clearTimeout(timeout);}
    }, []);

  return (
    <Dialog defaultOpen={true} open={true} className="outline-none">
        <DialogContent className="p-0 w-full h-full md:max-w-[80%] md:h-[80%] flex flex-row gap-0">
            <div ref={hoverControls} className='relative md:w-1/2 w-full h-full bg-cover overflow-hidden' onMouseOver={() => {setShowControls(true)}} onMouseLeave={() => setTimeout(() => setShowControls(false), 1000)}>
            {
                showControls &&
                (
                    <>
                    {/* <Button className="absolute z-10 rounded-full top-0 right-0 w-20 h-20 p-4 " variant="outline" size="icon" onClick={() => {}}>

                    </Button> */}
                    {
                        showLoader ? (<>
                            <Loader />
                        </>): <Button className="absolute z-50 rounded-full top-[45%] left-[45%] w-20 h-20 p-4 " variant="outline" size="icon" onClick={() => !!videoRef.current.paused ? videoRef.current.play():  videoRef.current.pause()}>{
                     !showPlay ?  <Play className="h-7 w-7" />: <Pause className="h-7 w-7" />
                }</Button>
                    }
                    </>
                
                )
            }
                <video ref={videoRef} onPlay={() => {setShowPlay(true); setShowLoader(false)}} onPause={() => setShowPlay(false)} onLoadedMetadata={() => videoRef.current?.play()} className='absolute w-full h-full top-0 left-0 object-cover rounded-2' src={data.video} onLoad={() => showLoader(true)} autoFocus autoPlay />
            </div>
            <div className='hidden md:flex w-1/2 py-8 px-5 flex-col justify-between'>
            <Transition show={true} appear>
                <Transition.Child  unmount appear enter="transition-all ease-out duration-300 delay-200"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4">
                    
                    <h1 className='font-bold text-xl'>{data.label}</h1></Transition.Child>
                 {!!data.type && !isLast && (data.type === "text" ? (
                    <Transition.Child as={React.Fragment} unmount appear enter="transition-all ease-out duration-300 delay-300"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4">

                    <Textarea className="mt-5" placeholder="something" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                    </Transition.Child>
                 ): (
                    <Transition.Child as={React.Fragment} unmount appear enter="transition-all ease-out duration-300 delay-300"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4">

                    <RadioGroup value={answer} onValueChange={setAnswer} className="mt-7">
                        {data.options.map((option, index) => (<div key={index} className="flex items-center space-x-3 p-2 border w-full rounded-xl cursor-pointer">
                            <RadioGroupItem value={option.value} id={`r${index+1}`} />
                            <Label htmlFor={`r${index+1}`} className="w-full m-2">{option.value}</Label>
                        </div>)) }
                    </RadioGroup>
                    </Transition.Child>
                 ))}
            </Transition>
            <Transition show={true} as={React.Fragment} unmount appear enter="transition-all ease-out duration-300 delay-500"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4">
<div className='flex flex-row justify-between items-center'>
                    {
                        isLast ? (
                            <>
                                <div class="flex-1" />
                                <Button variant="">Submit 🔥</Button>
                            </>
                        ) : (
                            <>
                            {!isFirst ? <Button variant='outline' className="flex gap-1"><span><ArrowLeftCircleIcon size={15} /></span>Prev</Button>: <div className='flex-1' />}
                            <Button className="flex gap-1" onClick={() =>{
                                if(!!data.nextStep && data.nextStep !== -1 && data.type === 'text')
                                    setCurrentLevel(data.nextStep)
                                    else {
                                        const nextBlockIndex = data.options.findIndex((i) => i.value === answer);
                                        setCurrentLevel(data.options[nextBlockIndex].nextNode)
                                    }
                            }} disabled={!answer}> Next { "   "} <span><ArrowRightCircleIcon size={15} /></span></Button>
                            </>
                        )
                    }
                </div>
                
            </Transition>
            </div>
            <div className='md:hidden w-full h-auto max-h-[50%] overflow-auto absolute z-20 bottom-0 py-8 px-5 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/50 to-black/5 opacity-100'>
            <Transition show={true} appear>
                
                <div className='overflow-auto text-white'>
                <Transition.Child  unmount appear enter="transition-all ease-out duration-300 delay-200"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4">
                        
                    <h1 className='font-bold text-xl'>{data.label}</h1>
                    </Transition.Child>
                    {!!data.type && (data.type === "text" ? (
                        <Transition.Child as={React.Fragment} unmount appear enter="transition-all ease-out duration-300 delay-300"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4">

                        <Textarea className="mt-5 text-black" placeholder="something" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                    </Transition.Child>
                    ): (
                        <Transition.Child as={React.Fragment} unmount appear enter="transition-all ease-out duration-300 delay-300"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4">

                        <RadioGroup value={answer} onValueChange={setAnswer} className="mt-7">
                            {data.options.map((option, index) => (<div key={index} className="flex items-center space-x-3 p-2 border w-full rounded-xl cursor-pointer">
                                <RadioGroupItem value={option.value} id={`r${index+1}`} />
                                <Label htmlFor={`r${index+1}`} className="w-full m-2">{option.value}</Label>
                            </div>)) }
                        </RadioGroup>
                    </Transition.Child>
                    ))}
                </div>
                </Transition>
                <Transition show={true} as={React.Fragment} unmount appear enter="transition-all ease-out duration-300 delay-500"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4">

                <div className='flex flex-row justify-between items-center mt-2 text-white'>
                    {
                        isLast ? (
                            <>
                                <div class="flex-1" />
                                <Button variant="">Submit 🔥</Button>
                            </>
                        ) : (
                            <>
                            {!isFirst ? <Button variant='outline' className="flex gap-1 text-black"><span><ArrowLeftCircleIcon size={15} /></span>Prev</Button> :  <div className='flex-1' />}
                            <Button className="flex gap-1" onClick={() =>{
                                if(!!data.nextStep && data.nextStep !== -1 && data.type === 'text')
                                    setCurrentLevel(data.nextStep)
                                    else {
                                        const nextBlockIndex = data.options.findIndex((i) => i.value === answer);
                                        setCurrentLevel(data.options[nextBlockIndex].nextNode)
                                    }
                            }} disabled={!answer}> Next { "   "} <span><ArrowRightCircleIcon size={15} /></span></Button>
                            </>
                        )
                    }
                </div>
                    </Transition>

               
            </div>
        </DialogContent>
    </Dialog>
  )
}

const UserFormLevels = ({data}) => {
    const [parent] = useAutoAnimate();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [questionsData, setQuestionsData] = useState(data.questions);
    console.log(currentLevel)
    return (
        <div ref={parent}>
            {!!questionsData && questionsData.map((item, index, data) => {
                if(index === currentLevel) {
                  return  <UserForm key={index} isLast={index === (data.length-1)} isFirst={index === 0} data={item} setCurrentLevel={setCurrentLevel} setAnswers={setAnswers} />
                }
            })}
        </div>
    )
}

export default dynamic (() => Promise.resolve(UserFormLevels), {ssr: false})
