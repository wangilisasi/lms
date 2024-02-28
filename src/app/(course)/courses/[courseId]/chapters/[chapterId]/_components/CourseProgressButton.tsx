"use client";

import { Button } from "@/components/ui/button";
import { CheckCheck, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useConfettiStore } from "../../../../../../../../hooks/use-confetti-store";
import toast from "react-hot-toast";
import axios from "axios";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}

const CourseProgressButton: React.FC<CourseProgressButtonProps> = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}) => {

  const router = useRouter()
  const confetti = useConfettiStore()
  const [isLoading,setIsLoading]=useState(false)

  const Icon = isCompleted ? XCircle : CheckCircle;
  
  const onClick= async ()=>{
    try {
      setIsLoading(true)

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{
        isCompleted:!isCompleted
      })

      //This means we have reached the end of the course. The user has completed this course and there is no next chapter
      if(isCompleted && !nextChapterId){
        confetti.onOpen()
      }

      if(!isCompleted && nextChapterId){
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }

      toast.success("Progress updated")
      router.refresh()
      
    } catch (error) {
      toast.error("Something went wrong")
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <Button
    onClick={onClick}
    disabled={isLoading}
      className="w-full md:w-auto"
      type="button"
      variant={isCompleted ? "outline" : "success"}
    >
      {isCompleted ? "Not Completed" : "Mark as Complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;
