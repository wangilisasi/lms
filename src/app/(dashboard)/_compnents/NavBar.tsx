import Link from "next/link"
import MobileSidebar from "./MobileSidebar";
import NavBarRoutes from "@/components/NavBarRoutes";

const NavBar = () => {
    return ( 
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <MobileSidebar/>
            <NavBarRoutes />
        </div>
     );
}
 
export default NavBar;