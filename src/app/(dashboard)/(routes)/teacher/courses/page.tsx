import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";


const CoursePage = async () => {

  const {userId} = auth()

  //Lets fetch our courses
  const courses = await db.course.findMany({
    where:{
      userId:userId!
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  if(!userId){
    return redirect("/")
  }

  return (
    <div className="p-6">
      {/* <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link> */}
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursePage;
