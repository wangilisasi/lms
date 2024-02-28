"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string; //the current value
}

export const Preview = ({ value }: PreviewProps) => {
  //To prevent ssr and avoid hydration errors
  const ReactQuil = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return <ReactQuil theme="bubble" value={value} readOnly />;
};
