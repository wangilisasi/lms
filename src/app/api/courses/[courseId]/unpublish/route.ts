import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //fetch course we want to publish
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }


    //we UNpublish the course
    const unPublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: false,
        userId,
      },
    });

    return NextResponse.json(unPublishedCourse);
  } catch (error) {
    console.log("UNPUBLISH_COURSE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
