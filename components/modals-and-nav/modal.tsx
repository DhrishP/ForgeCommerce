"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


type ModalProps ={
    title:string,
    description:string,
    isOpen:boolean,
    onClose:() => void,
    children? : React.ReactNode
};

export const Modal =({title,description,isOpen,onClose,children}:ModalProps) =>{
const Onchange = (open:boolean) => {
    if (!open) {
        onClose();
    }
}

return(
  <div>
    <Dialog open={isOpen} onOpenChange={Onchange}>
      <DialogContent>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>
       {description}
      </DialogDescription>
    </DialogHeader>
    <div>
        {children}
    </div>
  </DialogContent>
    </Dialog>
    </div>
)
}