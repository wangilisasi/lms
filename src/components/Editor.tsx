"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string; //the current value
}

export const Editor = ({ onChange, value }: EditorProps) => {
  //To prevent ssr and avoid hydration errors
  const ReactQuil = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <div className="bg-white">
      <ReactQuil theme="snow" value={value} onChange={onChange} />
    </div>
  );
};
