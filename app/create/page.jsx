"use client"
import React, { useState } from 'react'
import SelectOption from './_components/SelectOption'
import TopicInput from './_components/TopicInput';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCourses } from '../../context/CourseContext';

function Create() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState([])
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {user}=useUser();
    const { fetchCourses } = useCourses();

    const handleUserInput=(fieldName, fieldValue)=>{
        setFormData(prev=>({
            ...prev,
            [fieldName]: fieldValue
        }))
    }

    const GenerateCourseOutline = async () => {
      try {
        const courseId = uuidv4();
        setLoading(true);
        const payload = {
          courseId,
          courseType: formData.studyType,
          topic: formData.topic,
          difficultyLevel: formData.difficultyLevel || "Medium",
          createdBy: user?.primaryEmailAddress?.emailAddress,
        };

        await axios.post("/api/generate-course-outline", payload);

        await fetchCourses();
        toast.success("Course created successfully.");
        setLoading(false);
        router.replace('/dashboard')
      } catch (error) {
        console.error(
          "Error generating course outline:",
          error?.response?.data || error.message
        );
        setLoading(false);
        toast.error("Failed to generate course outline. Please check your input.");
      }
    };

  return (
    <div className='flex flex-col items-center  min-h-screen'>
        <h2 className='font-bold text-4xl text-primary'>Start Building Your Personal Study Material</h2>
        <p className='text-gray-500 text-lg'>Fill all the details in order to generate study material for your next project</p>
        <div className='mt-5'>
            {step==0? <SelectOption selectedStudyType={(value)=>handleUserInput("studyType",value)}/> : <TopicInput setTopic={(value)=>handleUserInput("topic", value)} setDifficultyLevel={(value)=>handleUserInput("difficultyLevel", value)}/>}
        </div>
        <div className="flex justify-between w-full mt-16">
        {step!=0? <button className="btn btn-primary" onClick={()=>setStep(step-1)}>Previous</button>:'-'}
        {step==0? <button onClick={()=>setStep(step+1)} className="btn btn-outline-primary">Next</button> : <button className="btn btn-outline-primary" onClick={GenerateCourseOutline} disabled={loading}>{loading?<Loader className='animate-spin'/>:"Generate"}</button>}
      </div>
    </div>
  )
}

export default Create
