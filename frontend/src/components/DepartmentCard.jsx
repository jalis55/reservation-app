import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const DepartmentCard = () => {
  const [department, setDepartment] = useState('');

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleClick = () => {
    alert(`Selected department: ${department}`);
  };

  return (
    <Card>
      <CardHeader>
        <h2>Select Department</h2>
      </CardHeader>
      <CardContent>
        <select value={department} onChange={handleDepartmentChange}>
          <option value="">Select a department</option>
          <option value="hr">Human Resources</option>
          <option value="marketing">Marketing</option>
          <option value="engineering">Engineering</option>
          <option value="sales">Sales</option>
        </select>
      </CardContent>
      <CardFooter>
        <Button onClick={handleClick}>Submit</Button>
      </CardFooter>
    </Card>
  );
};

export default DepartmentCard;
