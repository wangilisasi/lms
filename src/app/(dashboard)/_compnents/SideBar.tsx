import Logo from "./Logo"
import SideBarRoutes from "./SibeBarRoutes";

const sideBarItems = [];

const SideBar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="flex items-center p-6">
        <Logo/>
        <p className="m-4 font-bold">LMS</p>
      </div>
      <div className="flex flex-col w-full">
        <SideBarRoutes/>

      </div>
    </div>
  );
};

export default SideBar;
