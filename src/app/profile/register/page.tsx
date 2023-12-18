
"use client"
import { register } from '../../(auth)/register/templates/registertemp/index'

import React from 'react'
import { toast } from 'sonner';
interface User {
  name: string;
  email: string;
  avatar: string;
  credits: number;
  wins: string[];
}

const RegisterPage = () => {

  const handleRegisterFormSubmit = async (event: { preventDefault: () => void; target: any; }) => {

    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const profile = Object.fromEntries(formData.entries());



    try {
      await register(profile);


      window.location.href = '/';
    } catch (error) {

      console.error(error);
      toast.error('Registration Failed');
    }
  };



  return (
    <div>

      <div className='flex items-center justify-center container mt-20'>
        <div className='flex items-center justify-center border my-10 p-10 mt-20 shadow-md'>
          <div className='flex flex-col items-center justify-center my-3 mt-10'>
            <h1 className='text-center font-semibold text-xl md:text-2xl'>RegisterPage</h1>
            <form
              onSubmit={handleRegisterFormSubmit}
              id='registerForm' method='post' action="/auth/register" className='flex flex-col'>

              <input type="text" name='name' placeholder='Name' required className='border m-3 p-2 w-[300px] md:w-[400px]' pattern='^[\w]+$' title='User name must only contain lowercase and uppercase letters, numbers and underscore...' />
              <input type="email" name='email' placeholder='Email' required className='border m-3 p-2 w-[300px] md:w-[400px]' pattern='^[\w\-.]+@(stud\.)?noroff\.no$' title='Email must Be Noroff affiliated' />
              <input type="password" name='password' placeholder='Password' required className='border m-3 p-2 w-[300px]md:w-[400px]' minLength={8} />

              <input type="url" name='avatar' placeholder='Avatar' className='border m-3 p-2 w-[300px] md:w-[400px]' />




              <button title='Register' placeholder='Register' id='submit' type='submit' className='border hover:bg-black hover:text-white'>Register</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default RegisterPage;
