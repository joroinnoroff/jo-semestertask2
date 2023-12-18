"use client"
import React, { useState } from 'react';

import Image from 'next/image';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { login } from '../../(auth)/login/index';

const LoginPage = () => {
  const SignIn = async (event: { preventDefault: () => void; target: any; }) => {
    event.preventDefault();
    const form = event?.target;
    const formData = new FormData(form);
    formData.get("email")
    formData.get("password")

    const profile = {

      email: formData.get("email"),
      password: formData.get("password")
    }

    await login(profile);
    router.push('/');



  }






  const router = useRouter();




  return (
    <div className='mt-[10rem] flex items-center justify-center border my-10 p-10 shadow-md lg:w-[700px] m-auto text-black'>
      <div className='flex items-center justify-center align-center mx-auto flex-col text-center'>


        <h1 className='font-semibold mb-2 text-2xl'>Sign in to your account</h1>
        <div className='h-full w-full'>
          <form
            onSubmit={SignIn}
            id='loginForm'
            method='post'
            action="/auth/login"
            className='flex flex-col'
          >

            <label htmlFor="Please enter your Email"></label>
            <input type="email" name='email' placeholder='Email' required className='border m-3 p-2 w-32/4' pattern='^[\w\-.]+@(stud\.)?noroff\.no$' title='Email must Be Noroff affiliated' />
            <input type="password" name='password' placeholder='Password' required className='border m-3 p-2 w-32/4' minLength={8} />



            <div className='flex gap-3'>

              <button
                title="Login"
                placeholder="Login"
                id="submit"
                type="submit"
                className="border  px-5 py-3 rounded-lg"

              >
                Login
              </button>


              <div className='flex gap-1 items-center'><input type="checkbox" name="" id="" />
                <small>Remember me</small>
              </div>
            </div>





            <p className="m-auto mt-5 pt-1 text-sm font-semibold">
              Dont have an account?</p>

            <div><Link href={"/profile/register"} className="text-sm">Register</Link></div>


          </form>

        </div>
      </div>
    </div>
  )
}

export default LoginPage
