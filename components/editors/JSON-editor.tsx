"use client";
import React, { useState, useRef, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "../ui/use-toast";

interface JsonEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  useEffect(() => {
    if (editorRef.current && cursorPosition !== null) {
      editorRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [value, cursorPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCursorPosition(e.target.selectionStart);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Textarea
        ref={editorRef}
        id={label}
        value={value}
        onChange={handleChange}
        className="font-mono text-sm h-[60vh] resize-none"
        placeholder={`Enter JSON for ${label}`}
      />
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

interface Field {
  name: string;
  label: string;
  defaultValue?: string;
}
type OnSubmitProps = {
  categories?: string[];
  colors?: Record<string, string>;
  sizes?: Record<string, string>;
  bills?: Record<string, string>;
};

interface JsonEditorModalProps {
  title: string;
  description: string;
  triggerButtonText: string;
  fields: Field[];
  onSubmit: (data: OnSubmitProps) => Promise<void>;
}

const JsonEditorModal: React.FC<JsonEditorModalProps> = ({
  title,
  description,
  triggerButtonText,
  fields,
  onSubmit,
}) => {
  const [jsonData, setJsonData] = useState<Record<string, string>>(() =>
    fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "{}";
      return acc;
    }, {} as Record<string, string>)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>(() =>
    fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, string>)
  );

  const validateJson = (json: string, fieldName: string) => {
    try {
      JSON.parse(json);
      setJsonErrors((prev) => ({ ...prev, [fieldName]: "" }));
    } catch (error) {
      setJsonErrors((prev) => ({
        ...prev,
        [fieldName]: `Invalid JSON: ${(error as Error).message}`,
      }));
    }
  };

  const handleJsonChange = (newValue: string, fieldName: string) => {
    setJsonData((prev) => ({ ...prev, [fieldName]: newValue }));
    validateJson(newValue, fieldName);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (Object.values(jsonErrors).every((error) => error === "")) {
      const parsedData = Object.fromEntries(
        Object.entries(jsonData).map(([key, value]) => [key, JSON.parse(value)])
      );
      await onSubmit(parsedData);
      setIsLoading(false);
      setIsOpen(false);
      toast({
        title: "Quick Data was Added !! Bzzzing out.....🚀",
      });
      window.location.reload();
    } else {
      console.log("Cannot submit. Please fix JSON errors.");
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="">
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            {triggerButtonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] max-h-[80vh] h-full w-full overflow-y-scroll">
          <div className="">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div
              className={`grid gap-6 mt-10 ${getGridColumns(fields.length)}`}
            >
              {fields.map((field) => (
                <JsonEditor
                  key={field.name}
                  label={field.label}
                  value={jsonData[field.name]}
                  onChange={(newValue) =>
                    handleJsonChange(newValue, field.name)
                  }
                  error={jsonErrors[field.name] ? "Invalid JSON" : ""}
                />
              ))}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  Object.values(jsonErrors).some((error) => error !== "") ||
                  isLoading
                }
                className="relative"
              >
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const getGridColumns = (fieldCount: number) => {
  switch (fieldCount) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-1 md:grid-cols-2";
    case 3:
      return "grid-cols-1 md:grid-cols-3";
    default:
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  }
};

export default JsonEditorModal;
