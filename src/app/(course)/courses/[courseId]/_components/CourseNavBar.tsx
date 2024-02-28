import NavBarRoutes from "@/components/NavBarRoutes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import CourseMobileSideBar from "./CourseMobileSideBar";

interface CourseNavBarprops {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number;
}

const CouirseNavBar = ({ course, progressCount }: CourseNavBarprops) => {
  return <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
    <CourseMobileSideBar
    course = {course}
    progressCount={progressCount}
    />
    <NavBarRoutes/>
    </div>;
};

export default CouirseNavBar;
