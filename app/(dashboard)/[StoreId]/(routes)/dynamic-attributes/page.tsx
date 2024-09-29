"use client";

import { useState, useEffect } from 'react';
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
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const DynamicAttributesPage = () => {
  const params = useParams();
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState({ name: '', type: 'string' });

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    const response = await axios.get(`/api/${params.StoreId}/dynamicAttribute`);
    setAttributes(response.data);
  };

  const handleAddAttribute = async () => {
    await axios.post(`/api/${params.StoreId}/dynamicAttribute`, newAttribute);
    setNewAttribute({ name: '', type: 'string' });
    fetchAttributes();
  };

  return (
    <div>
      <Heading title="Dynamic Attributes" description="Manage custom attributes for your products" />
      <Separator />
      <div className="mt-4">
        <Input
          placeholder="Attribute Name"
          value={newAttribute.name}
          onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
        />
        <Select
          value={newAttribute.type}
          onValueChange={(value) => setNewAttribute({ ...newAttribute, type: value })}
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
        <Button onClick={handleAddAttribute}>Add Attribute</Button>
      </div>
      <div className="mt-4">
        <h2>Existing Attributes:</h2>
        <ul>
          {attributes.map((attr:any) => (
            <li key={attr.id}>{attr.name} - {attr.type}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DynamicAttributesPage;