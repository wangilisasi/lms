"use client"

import { Category } from "@prisma/client";
import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode
} from "react-icons/fc"
import { IconType } from "react-icons";
import CategoryItem from "./CategoryItem";

interface CategoriesProps {
    items:Category[]
}

const iconMap: Record<Category["name"], IconType>={
    "Mathematics":FcMusic,
    "Englis":FcOldTimeCamera,
    "Swahili":FcSportsMode,
    "Accounting":FcSalesPerformance,
    "Computer Science":FcMultipleDevices,
    "Geography":FcEngineering,
    "Physics":FcMusic,
    // "Filming":FcFilmReel,
}



const Categories = ({items}:CategoriesProps) => {
    return ( 
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item)=>(
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
     );
}
 
export default Categories;