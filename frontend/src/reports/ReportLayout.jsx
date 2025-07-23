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
import { getBookingDetails } from "./bookingDetails";
import { generatePdf } from "./GeneratePdf";
import { format } from "date-fns";
import Swal from 'sweetalert2'; // Import SweetAlert2
import API from "@/api/axios";

const ReportLayout = ({ reportType }) => {
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await API.get('api/user/organizations');
                setOrganizations(response.data);
            } catch (error) {
                console.error('Error fetching organizations:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch organizations',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        };

        fetchOrganizations();
    }, []);

    const selectedOrganization = organizations.find(org => org.id === selectedOrganizationId);

    const getReportTitle = () => {
        switch (reportType) {
            case 'currentDate':
                return "Today's Booking";
            case 'asonDate':
                return "As On Date Report";
            case 'dateRange':
                return "Date Range Report";
            default:
                return "Booking Report";
        }
    };

    const getReportDescription = () => {
        switch (reportType) {
            case 'currentDate':
                return "Generate a booking report for today";
            case 'asonDate':
                return "Generate a booking report as on specific date";
            case 'dateRange':
                return "Generate a booking report for a date range";
            default:
                return "Generate booking report";
        }
    };

    const handleGenerateReport = async () => {
        // Validate organization selection
        if (!selectedOrganizationId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select an organization first',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }

        let loadingSwal;
        try {
            setIsLoading(true);
            loadingSwal = Swal.fire({
                title: 'Generating report...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // Determine date range based on report type
            const { startDate: reportStartDate, endDate: reportEndDate } = getDateRangeForReport();

            // Validate date selection
            validateDateSelection(reportStartDate, reportEndDate);

            // Fetch booking details
            const bookingDetails = await getBookingDetails(
                reportStartDate,
                reportEndDate,
                selectedOrganizationId
            );

            // Get organization details
            const orgDetails = organizations.find(org => org.id === selectedOrganizationId);
            if (!orgDetails) {
                throw new Error("Organization details not found");
            }

            // Generate PDF report
            await generatePdf(bookingDetails, reportStartDate, reportEndDate, orgDetails);

            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Report generated successfully',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } catch (error) {
            console.error("Failed to generate report:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate report. Please try again.';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } finally {
            if (loadingSwal) {
                loadingSwal.close();
            }
            setIsLoading(false);
        }
    };

    // Helper function to determine date range based on report type
    const getDateRangeForReport = () => {
        let reportStartDate = startDate;
        let reportEndDate = endDate;

        switch (reportType) {
            case 'currentDate':
                const today = format(new Date(), 'yyyy-MM-dd');
                reportStartDate = today;
                reportEndDate = today;
                setStartDate(today);
                setEndDate(today);
                break;

            case 'asonDate':
                if (!startDate) {
                    throw new Error('Please select a date');
                }
                reportEndDate = startDate; // For "as of" date, start and end are the same
                break;

            case 'dateRange':
                if (!startDate || !endDate) {
                    throw new Error('Please select both start and end dates');
                }
                if (startDate > endDate) {
                    throw new Error('Start date cannot be greater than end date');
                }
                break;

            default:
                throw new Error('Invalid report type');
        }

        return { startDate: reportStartDate, endDate: reportEndDate };
    };

    // Helper function to validate date selection
    const validateDateSelection = (startDate, endDate) => {
        if (!startDate || !endDate) {
            throw new Error('Please select valid dates');
        }

        if (startDate > endDate) {
            throw new Error('Start date cannot be greater than end date');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Card className="w-full max-w-[380px] bg-white/70 backdrop-blur-xl shadow-xl border-0 rounded-2xl glass-morphism transition-transform hover:scale-[1.014]">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-br from-primary to-violet-400 p-2 rounded-full shadow-sm">
                            <Folder className="w-6 h-6 text-white drop-shadow" />
                        </span>
                        <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">
                            {getReportTitle()}
                        </CardTitle>
                    </div>
                    <CardDescription className="mt-2 text-gray-500">
                        {getReportDescription()}
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
                                disabled={isLoading}
                            >
                                <SelectTrigger id="organization" className="h-12 rounded-lg border bg-white/80 shadow-sm focus:ring-primary/30 transition-all">
                                    <SelectValue placeholder="Select organization">
                                        {selectedOrganization?.name}
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

                        {reportType !== 'currentDate' && (
                            <>
                                {reportType === 'asonDate' && (
                                    <div>
                                        <Label htmlFor="asonDate" className="mb-1 block font-medium">
                                            As on date
                                        </Label>
                                        <input
                                            type="date"
                                            id="asonDate"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="h-12 w-full rounded-lg border bg-white/80 shadow-sm focus:ring-primary/30 transition-all"
                                            disabled={isLoading}
                                        />
                                    </div>
                                )}
                                {reportType === 'dateRange' && (
                                    <>
                                        <div>
                                            <Label htmlFor="fromDate" className="mb-1 block font-medium">
                                                From date
                                            </Label>
                                            <input
                                                type="date"
                                                id="fromDate"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="h-12 w-full rounded-lg border bg-white/80 shadow-sm focus:ring-primary/30 transition-all"
                                                disabled={isLoading}
                                                max={endDate}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="toDate" className="mb-1 block font-medium">
                                                To date
                                            </Label>
                                            <input
                                                type="date"
                                                id="toDate"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="h-12 w-full rounded-lg border bg-white/80 shadow-sm focus:ring-primary/30 transition-all"
                                                disabled={isLoading}
                                                min={startDate}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        className="w-full h-11 bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all duration-150"
                        type="button"
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                    >
                        {isLoading ? "Generating..." : "Generate Report"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ReportLayout;