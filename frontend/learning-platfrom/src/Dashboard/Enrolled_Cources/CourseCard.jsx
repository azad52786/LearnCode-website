import React from 'react'
import ProgressBar from './ProgressBar';

const CourseCard = ({courseDetails}) => {
  console.log(courseDetails);
  const {thumbnail, courseName , _id } = courseDetails;
  return (
    <div className=' w-full h-full flex items-center justify-between px-3'>
      <div className=' flex justify-center items-center gap-x-4 font-edu-sa lg:font-semibold
          
      '>
        <img src={thumbnail} alt='course Thumbnail' className=' w-20 h-16 rounded-md'/>
        <p>{courseName}</p>
      </div>
      <ProgressBar/>
    </div>
  )
}

export default CourseCard
