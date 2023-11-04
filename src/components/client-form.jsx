import { ArrowLeft, ArrowLeftCircleIcon, ArrowRightCircleIcon, CopyIcon, Pause, Play } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import dynamic from 'next/dynamic'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Textarea } from './ui/textarea'

const data = [
    {
        video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        label: "Q1. How was your experience on interviewing with our company?",
        type: "text" ,
        nextBlock: 1,
    },
    {
        video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        label: "Q2. How many interview rounds was there while interviewing process?",
        type: "mcq",
        options: [
            {
                value: "4 Rounds",
                nextBlock: 2,
            },
            {
                value: "3 Rounds",
                nextBlock: 3,
            },
            {
                value: "2 Rounds",
                nextBlock: 4,
            },
        ],
        nextBlock: null
    },
    {
        video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        label: "Q3. How was your experience with interviewing for a senior position role?",
        type: "text" ,
        nextBlock: 4,
    },
    {
        video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        label: "Q3. How was your experience with interviewing for a junior position role?",
        type: "text" ,
        nextBlock: 4,
    },
    {
        video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        label: "Q4. How will you rate the overall interview experience with us?",
        type: "mcq",
        options: [
            {
                value: "1",
                nextBlock: 5,
            },
            {
                value: "2",
                nextBlock: 5,
            },
            {
                value: "3",
                nextBlock: 5,
            },
            {
                value: "4",
                nextBlock: 5,
            },
            {
                value: "5",
                nextBlock: 5,
            },
        ],
        nextBlock: null
    },
    {
        video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        label: "Q5. Thanks for taking this Survey, will see you soon ✌️",
        type: null ,
        nextBlock: null,
    },
    ]


const UserForm = ({data, setCurrentLevel, setAnswers, isLast}) => {
    const [hoverControls] = useAutoAnimate();
    const [showControls, setShowControls] = useState(true);
    const [showPlay, setShowPlay] = useState(true);
    const [answer, setAnswer] = useState();
    const videoRef = useRef();


    useEffect(() => {
        const timeout = setTimeout(() => setShowControls(false), 2000)
        if(videoRef.current) {
            videoRef.current.play();
        }
        return () => {clearTimeout(timeout); videoRef.current?.pause()}
    }, []);

  return (
    <Dialog defaultOpen={true} open={true}>
        <DialogContent className="p-0 w-full h-full md:max-w-[80%] md:h-[80%] flex flex-row gap-0">
            <div ref={hoverControls} className='relative w-1/2 h-full bg-cover overflow-hidden' onMouseEnter={() => {setShowControls(true)}} onMouseLeave={() =>setTimeout(() => setShowControls(false), 1000)}>
            {
                showControls &&
                <Button className="absolute z-10 rounded-full top-[45%] left-[45%] w-12 h-12 " variant="outline" size="icon" onClick={() => !!videoRef.current.paused ? videoRef.current.play():  videoRef.current.pause()}>{
                    !!videoRef.current?.paused && !showPlay ?  <Play className="h-10 w-10" />: <Pause className="h-10 w-10" />
                }</Button>
            }
                <video ref={videoRef} onPlay={() => setShowPlay(true)} onPause={() => setShowPlay(false)} className='absolute w-full h-full top-0 left-0 object-cover rounded-2' src={data.video} autoFocus autoPlay />
            </div>
            <div className='w-1/2 py-8 px-5 flex flex-col justify-between'>
            <div>
                <h1 className='font-bold text-xl'>{data.label}</h1>
                 {!!data.type && (data.type === "text" ? (
                    <Textarea className="mt-5" placeholder="something" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                 ): (
                    <RadioGroup value={answer} onValueChange={setAnswer} className="mt-7">
                        {data.options.map((option, index) => (<div className="flex items-center space-x-3 p-2 border w-full rounded-xl cursor-pointer">
                            <RadioGroupItem value={option.value} id={`r${index+1}`} />
                            <Label htmlFor={`r${index+1}`} className="w-full m-2">{option.value}</Label>
                        </div>)) }
                    </RadioGroup>
                 ))}
            </div>
                <div className='flex flex-row justify-between items-center'>
                    {
                        isLast ? (
                            <>
                                <div class="flex-1" />
                                <Button variant="">Submit 🔥</Button>
                            </>
                        ) : (
                            <>
                            <Button variant='outline' className="flex gap-1"><span><ArrowLeftCircleIcon size={15} /></span>Prev</Button>
                            <Button className="flex gap-1" onClick={() =>{
                                if(!!data.nextBlock && data.type === 'text')
                                    setCurrentLevel(data.nextBlock)
                                    else {
                                        const nextBlockIndex = data.options.findIndex((i) => i.value === answer);
                                        setCurrentLevel(data.options[nextBlockIndex].nextBlock)
                                    }
                            }} disabled={!answer}> Next { "   "} <span><ArrowRightCircleIcon size={15} /></span></Button>
                            </>
                        )
                    }
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

const UserFormLevels = () => {
    const [parent] = useAutoAnimate();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [answers, setAnswers] = useState([]);
    return (
        <div ref={parent}>
            {!!data && data.map((item, index, data) => {
                if(index === currentLevel) {
                  return  <UserForm isLast={index === (data.length-1)} data={item} setCurrentLevel={setCurrentLevel} setAnswers={setAnswers} />
                }
            })}
        </div>
    )
}

export default dynamic (() => Promise.resolve(UserFormLevels), {ssr: false})
