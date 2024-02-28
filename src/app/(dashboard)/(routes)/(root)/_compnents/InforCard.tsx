import React from "react";
import { Clock, LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/IconBadge";

interface InfoCardProps {
  icon: LucideIcon;
  label: string; // Label text
  numberOfItems: number; // Number of items
  variant?: "default" | "success";
}

const InfoCard: React.FC<InfoCardProps> = ({
  variant,
  icon: Icon,
  label,
  numberOfItems,
}) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge variant={variant} icon={Icon} />
      <div>
      <p className='font-medium'>{label}</p>
      <p className="text-gray-500 text-sm">
        {numberOfItems} {numberOfItems===1? "Course":" Courses"}
      </p>
      </div>
    </div>
  );
};

export default InfoCard;
