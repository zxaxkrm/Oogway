import { auth } from '@/auth'
import StartUpForm from '@/components/StartUpForm'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {

const session = await auth();

if(!session) redirect("/")

  return (
    <>
    <section className='pink-container min-h-57.5'>
        <h1 className='heading-hero'>Submit Your Startup</h1>
    </section>


        <StartUpForm/>
    </>
  )
}

export default page