import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const DynamicAttributeFields = ({ control, dynamicAttributes }:{
    control: any;
    dynamicAttributes: any;
}) => {
  return (
    <>
      {dynamicAttributes.map((attr:any, index:any) => (
        <FormField
          key={attr.id}
          control={control}
          name={`dynamicAttributes.${attr.name}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{attr.name}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={`Enter ${attr.name}`}
                  type={attr.type === 'number' ? 'number' : 'text'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
};

export default DynamicAttributeFields;