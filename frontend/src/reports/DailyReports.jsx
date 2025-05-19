import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Folder } from "lucide-react";
import api from '../api';
import { getBookingDetails } from "./bookingDetails";
import { generatePdf } from "./GeneratePdf";




const DailyReports = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await api.get('api/user/organizations');
        setOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const reportDetails = async () => {

    try {
      const response = await api.get('127.0.0.1:8000/api/booking/org/reports/2025-05-19/2025-05-19/1/');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  }



  const handleGenerateReport = async () => {
    if (!selectedOrganizationId) {
      alert("Please select an organization first");
      return;
    }
    const today = new Date().toISOString().split('T')[0];

    try {
      const bookingDetails = await getBookingDetails(today, today, selectedOrganizationId);
      const orgDetails = organizations.find(org => org.id === selectedOrganizationId);

      // Call the function directly (no JSX)
      generatePdf(bookingDetails, today, today, orgDetails);

    } catch (error) {
      console.error("Failed to fetch booking details:", error);
      alert("Failed to generate report. Please try again.");
    }
  };

  // Find the selected organization to display its name
  const selectedOrganization = organizations.find(org => org.id === selectedOrganizationId);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-[380px] bg-white/70 backdrop-blur-xl shadow-xl border-0 rounded-2xl glass-morphism transition-transform hover:scale-[1.014]">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-br from-primary to-violet-400 p-2 rounded-full shadow-sm">
              <Folder className="w-6 h-6 text-white drop-shadow" />
            </span>
            <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">
              Today's Booking
            </CardTitle>
          </div>
          <CardDescription className="mt-2 text-gray-500">
            Generate a booking report for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="organization" className="mb-1 block font-medium">
                Organization
              </Label>
              <Select
                value={selectedOrganizationId}
                onValueChange={setSelectedOrganizationId}
              >
                <SelectTrigger id="organization" className="h-12 rounded-lg border bg-white/80 shadow-sm focus:ring-primary/30 transition-all">
                  <SelectValue placeholder="Select organization">
                    {selectedOrganization ? selectedOrganization.name : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white z-20 shadow-lg rounded-xl border mt-2">
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="w-full h-11 bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all duration-150"
            type="button"
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DailyReports;