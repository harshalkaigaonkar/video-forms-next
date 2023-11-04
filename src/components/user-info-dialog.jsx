import dynamic from 'next/dynamic'
import React from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

const UserInfoDialog = ({showUserModal, setUserInfo, userInfo, onSubmitHandler}) => {
  return (
    <Dialog open={showUserModal} className='absolute z-50'>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Your Details!</DialogTitle>
          <DialogDescription>
            Your Name and Email is only visible to the form owners.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="John Doe" value={userInfo.name} onChange={(e) => setUserInfo((info) => ({...info, name: e.target.value}))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" placeholder="something@gmail.com" value={userInfo.email} onChange={(e) => setUserInfo((info) => ({...info, email: e.target.value}))} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmitHandler}>Save Info</Button>
        </DialogFooter>
      </DialogContent>
</Dialog>
  )
}

export default dynamic (() => Promise.resolve(UserInfoDialog), {ssr: false})