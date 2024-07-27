import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { FiPlusCircle } from "react-icons/fi";
import ErrorMessageComponent from '../AddCourse/ErrorMessageComponent';
import { useDispatch, useSelector } from 'react-redux';
import { createSectionCall, updateSection } from '../../service/operations/CourseBackendConnection';
import Section from './Section';
import toast from 'react-hot-toast';
import { setCourseDetails, setSubSection } from '../../Store/Slices/CreateCourseSlice';

const SectionHome = () => {
    const [showCreateSection , setShowCreateSection] = useState(true);
    const [ editSectionId , setEditSectionId ] = useState(-1);
    const [ editSectionName , setEditSectionName ] = useState("");
    const { courseDetails } = useSelector((store) => store.CourseData);
    const { token } = useSelector((store) => store.Auth);
    const dispatch = useDispatch();
    const {
        register,
        getValues,
        setValue,
        formState: { errors },
        reset,
        handleSubmit,
      } = useForm({
        criteriaMode: "all",
      });
      const onsubmit = async(data) => {
      if(showCreateSection){
        let formData = new FormData();
        formData.append("sectionName" , data.sectionName);
        formData.append("courseId" , courseDetails._id);
        createSectionCall(formData , token , dispatch);
        setValue("sectionName" , "")
      }else{
        const editedName = getValues("sectionName");
        if(editSectionName === editedName){
            toast.error("You didn't change anything. Please press the unedit button for add new Section.🥴");
            return ;
        }
        let formData = new FormData();
        formData.append("newSectionName" , data.sectionName);
        formData.append("sectionId" , editSectionId);
        let updatedSection = await updateSection(formData , token , dispatch);
        // console.log(editIndex.current)
        let index = -1;
        courseDetails.courseContent.forEach((course , i) => {
            // console.log(course._id , " " , updatedSection._id);
             if(course._id === updatedSection._id) index = i;
        });
        let newContent = [...courseDetails.courseContent]
        newContent.splice(index , 1 , updatedSection);
        dispatch(setSubSection(newContent))
        setValue("sectionName" , "")
        setShowCreateSection(true)
      }
      setEditSectionId(-1);
      setEditSectionName("");
      }
  return (
    <div className=' w-full h-full mt-6 relative'>
      <form className=' bg-richblack-800 w-[93%] mr-3 mx-auto h-fit rounded-md border border-pure-greys-600
            p-6 pr-12 text-pure-greys-25 font-inter flex flex-col gap-y-3 '
                onSubmit={handleSubmit(onsubmit)}
            >
            <div className=' text-2xl text-pure-greys-200 font-bold font-inter'>Course Bilder</div>

            <div className=" w-full h-fit flex gap-y-1 flex-col mb-3 text-pure-greys-100 ">
                <input
                  id="sectionName"
                  className=" h-11 p-2 bg-richblack-600 border-b border-pure-greys-50 rounded-md"
                  placeholder="Enter  Section Name"
                  {...register("sectionName", {
                    required: {
                      value: true,
                      message: "Section Name is Required 😒",
                    },
                  })}
                /> 
                <ErrorMessageComponent 
                    name = {"sectionName"} 
                    errors={errors}
                />
            </div>
            <button type='submit'
                className=' px-3 py-2  text-yellow-50 flex w-fit items-center justify-center gap-x-3 border border-yellow-50 rounded-md'
                
            ><FiPlusCircle/> {showCreateSection ? "Create Section" : "Edit Section"}</button>
            
            <div className=' w-full h-fit bg-richblack-600 rounded-md'>
            {
                courseDetails?.courseContent.map((section , index) => (
                    <Section section={section} index={index} setShowCreateSection={ setShowCreateSection} setValue={setValue} token = {token}
                    setEditSectionId = {setEditSectionId} editSectionbtn = {editSectionId === section._id} setEditSectionName = {setEditSectionName}
 
                    />
                ))
            }
            </div>
      </form>
      
    </div>
  )
}


export default SectionHome