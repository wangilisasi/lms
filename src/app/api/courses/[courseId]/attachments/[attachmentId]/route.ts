import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  //Now we need to know if this user is the owner of this course
  const courseOwner = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId: userId,
    },
  });

  if(!courseOwner){
    return new NextResponse("Unauthorized",{status:401})
  }

  const attachment = await db.attachment.delete({
    where:{
        courseId:params.courseId,
        id:params.attachmentId
    }
  })

  return NextResponse.json(attachment)


//   const { id } = await req.json();

  try {
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("", { status: 500 });
  }
}
