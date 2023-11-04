import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import React from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent } from './ui/dialog'

const ThanksDialog = () => {
  return (
    <Dialog defaultOpen={true} open={true} className="outline-none">
        <DialogContent className="p-0 w-full h-full md:max-w-[80%] md:h-[80%] flex flex-row gap-0 items-center justify-center">
            <Transition show={true} appear className="">
                <Transition.Child
                as={React.Fragment}
                unmount
                appear
                enter="transition-all ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
                >
                    <h1 className='text-center font-semibold text-2xl w-full'>Your Response has been recorded! 🎉</h1>
                </Transition.Child>
                <Transition.Child
                as={React.Fragment}
                unmount
                appear
                enter="transition-all ease-out duration-300 delay-200"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
                >
                    <h4 className='text-center font-medium text-lg w-full'>all caught up!</h4>
                </Transition.Child>
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
                    <p className='fixed bottom-5 w-96 text-center text-black/20 '>p.s. you can close this tab!</p>
                </Transition.Child>
            </Transition>
        </DialogContent>
      </Dialog>
  )
}

export default dynamic(() => Promise.resolve(ThanksDialog), { ssr: false });
