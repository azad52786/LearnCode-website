import React from 'react'
import { useSelector } from 'react-redux'
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
    const {user , loader : ProfileLoader} = useSelector((store) => store.User);
    // console.log(user);]
    const navigate = useNavigate();
    const { loader : AuthLoader } = useSelector((store) => store.Auth);
    const isLoader = ProfileLoader || AuthLoader;
    return isLoader ? (
      <Loader/>
    ) : (
      <div className=' w-full min-h-screen bg-richblack-900 flex flex-col items-center justify-center text-pure-greys-25 p-6'>
        <div className=' w-full text-4xl font-bold text-pure-greys-200 mb-8 text-center'>My Profile</div>
        <div className='flex justify-between w-[70%] bg-richblack-700 p-8 rounded-md items-center mb-16'>
          <div className=' flex gap-4 items-center'>
            <img src={user.image} alt='profile'height={100} width={100} className=' rounded-full'/>
            <div className=' flex flex-col gap-2'>
              <div className=' text-pure-greys-25 font-bold text-xl'>{user.firstName + " " + user.lastName}</div>
              <div className=' text-pure-greys-300 text-sm'>{user.email}</div>
            </div>
          </div>
          <button className={` ml-7 font-bold text-black bg-[#FFD60A]
          w-fit h-fit py-3 px-6 rounded-md transition-all duration-250 hover:scale-95 cursor-pointer border-b-2 border-r-2 border-richblack-700 hover:border-black`}
            onClick={() => {
                navigate("/dashboard/default/setting")
            }}
          >
           { "Edit" + " " + "✏️"}
          </button>
        </div>
        <div className='flex flex-col w-[70%] bg-richblack-700 p-8 rounded-md items-center gap-y-4'>
          <div className=' flex w-full items-start justify-between mb-6'>
            <div className='text-pure-greys-25 font-bold text-xl'>Personal Details</div>
            <button className={` ml-7 font-bold text-black bg-[#FFD60A]
              w-fit h-fit py-3 px-6 rounded-md transition-all duration-250 hover:scale-95 cursor-pointer border-b-2 border-r-2 border-richblack-700 hover:border-black`}
                onClick={() => {
                    navigate("/dashboard/default/setting")
                }}
            > { "Edit" + " " + "✏️"}</button>
          </div>
          <div className='flex w-full'>
            <div className='w-[50%]'>
              <p className=' text-sm text-pure-greys-300 mb-2'>First Name</p>
              <p className='font-bold text-start text-pure-greys-25'>{user.firstName}</p>
            </div>
            <div className=' w-[50%]'>
              <p className=' text-sm text-pure-greys-300 mb-2'>Last Name</p>
              <p className='font-bold text-pure-greys-25'>{user.lastName}</p>
            </div>
          </div>
          <div className='flex w-full'>
            <div className='w-[50%]'>
              <p className=' text-sm text-pure-greys-300 font-inter mb-2'>Email</p>
              <p className='font-bold font-inter text-start text-pure-greys-25'>{user?.email}</p>
            </div>
            <div className='w-[50%]'>
              <div className=' text-sm  font-inter text-pure-greys-300 mb-2'>Contact Number</div>
              <p className='font-bold font-inter text-pure-greys-25'>{user?.contact ? user.contact : "Null" }</p>
            </div>
          </div>
        </div>
      </div>
    );
}

export default MyProfile
