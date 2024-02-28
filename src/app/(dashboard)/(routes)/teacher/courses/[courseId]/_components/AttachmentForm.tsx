"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Delete,
  File,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import toast, { ToastBar } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import FileUpload from "@/components/FileUpload";

interface AttachmentFormProps {
  initialData: Course & { attchments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentForm = ({ courseId, initialData }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Attachment Uploaded");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted succesfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attchments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              {" "}
              No attchments yet
            </p>
          )}
          {/* {initialData.attchments.map((attachment)=>(
          <p key={attachment.name}>{attachment.name}</p>
        ))} */}
          {initialData.attchments.length > 0 && (
            <div className="space-y-2">
              {initialData.attchments.map((attchment) => (
                <div
                  key={attchment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md "
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attchment.name}</p>
                  {deletingId === attchment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    </div>
                  )}
                  {deletingId !== attchment.id && (
                    <button onClick={()=>onDelete(attchment.id)} className="ml-auto hover:opacity-75 transition">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
