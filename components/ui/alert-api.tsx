import React from "react";
import { Badge,BadgeProps } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";


type AlertApiProps = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMapping :Record<AlertApiProps['variant'],string>={
    public:"Public",
    admin:"Admin"
}

const variantMap : Record<AlertApiProps["variant"],BadgeProps['variant']>={
  public:"secondary",
  admin:"destructive"
}
const onCopy = (description:string) =>{
  navigator.clipboard.writeText(description)
  toast.success("Route copied")
}

const AlertApi = ({ title, description, variant }: AlertApiProps) => {
  return (
    <div className="px-6 pt-6"> 
    <Alert>
      <Server className="h-5 w-4" />
      <AlertTitle className="flex gap-x-2 items-center">
        {title}
        <Badge variant={variantMap[variant]}>{variant}</Badge>
        </AlertTitle>
      <AlertDescription className="mt-1 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] font-mono text-sm font-semibold">
        {description}
        </code>
          <Button variant={'ghost'} size={'icon'} onClick={()=>{onCopy(description)}}>
            <Copy className="h-5 w-4" />
          </Button>
        
        </AlertDescription>
    </Alert>

    </div>
  );
};

export default AlertApi;
