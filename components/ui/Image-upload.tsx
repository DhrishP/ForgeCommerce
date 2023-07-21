"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

type ImageUploadProps = {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value:string) => void;
  values: string[];
};
const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  values,
}: ImageUploadProps) => {
  const [mounted, isMounted] = useState(false);

  useEffect(() => {
    isMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!mounted) {
    return null;
  }
  return (
    <div>
      <div className="mb-4 flex items-center gap-4 ">
        {values.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-lg ">
            <div className="absolute z-10 top-2 right-2">
              <Button
                type="button"
                variant={"destructive"}
                size={"icon"}
                onClick={() => {
                  onRemove(url);
                }}
              >
                <Trash className="h-5 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      {/* This is CldUploadWidget and the whole block of code inside it is taken from next cloudinary docs  */}
      <CldUploadWidget onUpload={onUpload} uploadPreset="xfddec76">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant={"secondary"}
              onClick={onClick}
            >
              <ImagePlus className="h-5 w-4 mr-3" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
