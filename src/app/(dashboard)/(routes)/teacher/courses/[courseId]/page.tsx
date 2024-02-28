import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChaptersForm from "./_components/ChaptersForm";
import Banner from "@/components/Banner";
import CourseActions from "./_components/CourseActions";

//We have to mark this function as asynchronous coz we first have to fecth the course form the databse before modifying it

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  //get the userid from clerk
  const { userId } = auth();

  //fecth the categories from the database
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!userId) {
    return redirect("/");
  }
  //fetch the course
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId, //so that only the creator of the course can fetch the course
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attchments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter=>chapter.isPublished)
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields} )`;

  const isComplete =requiredFields.every(Boolean);

  return (
    <>
    {!course.isPublished && (
      <Banner label="This course is not published. It will not be visible to students"/>
    )}
     <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">
            {" "}
            Complete all fields {completionText}
          </span>
        </div>
       <CourseActions disabled={!isComplete} isPublished={course.isPublished} courseId={params.courseId}/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm courseId={course.id} initialData={course} />
          <DescriptionForm courseId={course.id} initialData={course} />
          <ImageForm courseId={course.id} initialData={course} />
          <CategoryForm
            courseId={course.id}
            initialData={course}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <ChaptersForm courseId={course.id} initialData={course} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell Your Course</h2>
            </div>
            <PriceForm courseId={course.id} initialData={course} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <AttachmentForm courseId={course.id} initialData={course} />
          </div>
        </div>
      </div>
    </div>
    </>
   
  );
};

export default CourseIdPage;
