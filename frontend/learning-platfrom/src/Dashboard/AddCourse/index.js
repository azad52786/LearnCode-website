import React, { useEffect, useRef } from "react";
import { CourseCreationData } from "../../utils/constants";
import { courseUploadTips } from "../../utils/constants";
import CreateCourseForm from "./CreateCourseForm";
import { useDispatch, useSelector } from "react-redux";
import StepSection from "./StepSection";
import { setEditCourseDetails, setStep } from "../../Store/Slices/CreateCourseSlice";
import SectionHome from "../Addsections/SectionHome";
import PublishHome from "../PublishSection/PublishHome";
export default function AddCourse(){
    const { step , editCourseDetails } = useSelector((store) => store.CourseData);
    const dispatch = useDispatch();
    let formRef = useRef(null);
    
    useEffect(() => {

        window.scrollTo({top : 0, left : 0 , behavior: "smooth"});
        
    } , [step])
    
    useEffect(() => {
        return () => {
            dispatch(setEditCourseDetails(false))
            dispatch(setStep(1));
        }
    }, [])
    
    return (
        <div className="w-full h-full flex  gap-5 mt-6 ">
            <div className="w-[60%]">
                <div className=" w-full text-center text-2xl text-pure-greys-25 font-bold font-inter">
                {!editCourseDetails ? "Add Course" : "Edit Course"}</div>
                <StepSection CourseCreationData = { CourseCreationData } step = {step}/>
                { step === 1 && <CreateCourseForm/> }
                { step === 2 && <SectionHome/> }
                { step === 3 && <PublishHome/>}
            </div>
            <div className=" w-[30%] ">
                <div className=" w-fit h-fit p-6  bg-richblack-700 rounded-md text-start border border-pure-greys-500 font-inter">
                   <div className=" text-xl font-bold mb-4">⚡Course Upload Tips</div>
                   <ul style={{"list-style-type":"circle"}} className=" text-sm text-pure-greys-100 pl-4">
                        {
                            courseUploadTips.map((tips , index) => (
                                <li key={ index} className=" mb-2">{tips}</li>
                            ))
                        }
                   </ul>
                </div>
            </div>
        </div>
    )
}