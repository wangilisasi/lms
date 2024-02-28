import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const TeacherLayout = (
    {children}:{children:React.ReactNode}
) => {

    //Prevent a user trying to access the /teacher/courses/ page by typing it in the URL. He will be redirected to the home page. 
    //This is a layout file, its going to aplly to all files in the inner folders
    //We have protected our frontend.
    //Now we need to protect pur backend using the same logic . in th api routes
    const {userId} = auth()
    if(!isTeacher(userId)){
        return redirect("/")
    }
    return ( 
        <>{children}</>
     );
}
 
export default TeacherLayout;