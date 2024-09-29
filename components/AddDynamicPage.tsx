import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddDynamicPage = ({ onPageAdded }: { onPageAdded: (page: any) => void }) => {
  const params = useParams();
  const [pageName, setPageName] = useState('');
  const [attributes, setAttributes] = useState([{ name: '', type: 'string' }]);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', type: 'string' }]);
  };
  const handleAttributeChange = (index: number, field: keyof typeof attributes[number], value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/${params.StoreId}/dynamicPages`, {
        name: pageName,
        attributes,
      });
      onPageAdded(response.data);
      setPageName('');
      setAttributes([{ name: '', type: 'string' }]);
    } catch (error) {
      console.error('Error adding dynamic page:', error);
    }
  };

  return (
    <div>
      <Input
        placeholder="Page Name"
        value={pageName}
        onChange={(e) => setPageName(e.target.value)}
      />
      {attributes.map((attr, index) => (
        <div key={index}>
          <Input
            placeholder="Attribute Name"
            value={attr.name}
            onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
          />
          <Select
            value={attr.type}
            onValueChange={(value) => handleAttributeChange(index, 'type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select attribute type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button onClick={handleAddAttribute}>Add Attribute</Button>
      <Button onClick={handleSubmit}>Create Page</Button>
    </div>
  );
};

export default AddDynamicPage;