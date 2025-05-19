"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Users, CalendarCheck, CheckCircle2, Info } from "lucide-react"
import api from '../api';
// import "@/styles/booking.css"

const CreateBooking = () => {
    const [selectedDates, setSelectedDates] = useState([])
    const [isMultipleMode, setIsMultipleMode] = useState(false)
    const [bookings, setBookings] = useState([])
    const [successMessage, setSuccessMessage] = useState("")

    // Function to format dates for display
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return format(date, "MMMM d, yyyy")
    }

    //api call to get bookings

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get("/api/booking/reserve-dates/")

                setBookings(response.data)
            } catch (error) {
                console.error("Error fetching bookings:", error)
            }
        }

        fetchBookings()
    }, [])

    // Function to handle date selection
    const handleDateSelect = (dates) => {
        if (isMultipleMode) {
            if (Array.isArray(dates) && dates.length > 0) {
                setSelectedDates(dates.map((date) => format(date, "yyyy-MM-dd")))
            } else {
                setSelectedDates([])
            }
        } else {
            if (dates instanceof Date) {
                setSelectedDates([format(dates, "yyyy-MM-dd")])
            } else {
                setSelectedDates([])
            }
        }
    }

    // Function to save bookings
    const handleSaveBooking = async () => {
        if (selectedDates.length === 0) return


        // Create new booking entries
        const newBookings = selectedDates.map((date) => ({
            booking_date: date
        }))

        //api call to save bookings
        try {
            await api.post("/api/booking/create/", newBookings)
        }
        catch (error) {
            console.error("Error saving bookings:", error)
            setSuccessMessage("Error saving bookings. Please try again.")
            return
        }

        // Update bookings state
        setBookings([...bookings, ...newBookings])

        // Show success message
        setSuccessMessage(`Successfully booked ${selectedDates.length} date${selectedDates.length > 1 ? "s" : ""}`)

        // Clear selected dates
        setSelectedDates([])

        // Hide success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage("")
        }, 3000)
    }

    //Delete booking
    const handleCancelBooking = async (booking) => {
        try {
            const response = await api.delete(`/api/booking/cancel-booking/${booking.booking_date}/`)
            if (response.status === 204) {
                setBookings(bookings.filter((b) => b.booking_date !== booking.booking_date))
                setSuccessMessage("Booking deleted successfully.")
            }
            else {
                setSuccessMessage("Error deleting booking. Please try again.")
            }
        }
        catch (error) {
            console.error("Error deleting booking:", error)
            setSuccessMessage("Error deleting booking. Please try again.")
            return
        }
    }

    // Convert booked dates to Date objects for comparison
    const bookedDatesAsObjects = bookings.map((booking) => new Date(booking.booking_date))

    // Function to check if a date is booked
    const isDateBooked = (date) => {
        return bookedDatesAsObjects.some(
            (bookedDate) =>
                bookedDate.getFullYear() === date.getFullYear() &&
                bookedDate.getMonth() === date.getMonth() &&
                bookedDate.getDate() === date.getDate(),
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-2 px-2 sm:px-6">
            <header className="mb-4 text-center">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Booking Calendar</h1>
                <p className="text-base text-gray-500">Select dates to make your booking</p>
            </header>

            {successMessage && (
                <div className="flex items-center justify-center mb-6 p-3 rounded-md bg-green-100 text-green-700 font-medium gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {successMessage}
                </div>
            )}

            <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-lg overflow-hidden">
                    <TabsTrigger value="calendar" className="flex items-center gap-2 py-2 px-4 text-gray-700 hover:bg-gray-200 transition">
                        <CalendarIcon className="h-4 w-4" />
                        Calendar
                    </TabsTrigger>
                    <TabsTrigger value="bookings" className="flex items-center gap-2 py-2 px-4 text-gray-700 hover:bg-gray-200 transition">
                        <Users className="h-4 w-4" />
                        Bookings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="calendar">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="shadow-md border border-gray-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Select Dates</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsMultipleMode(!isMultipleMode)}
                                        className="h-8"
                                    >
                                        {isMultipleMode ? "Single Date" : "Multiple Dates"}
                                    </Button>
                                </div>
                                <CardDescription className="text-gray-500">
                                    {isMultipleMode ? "Select multiple dates for your booking" : "Select a single date for your booking"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border border-gray-200 p-3 bg-white">
                                    <Calendar
                                        mode={isMultipleMode ? "multiple" : "single"}
                                        selected={
                                            isMultipleMode
                                                ? selectedDates.map((date) => new Date(date))
                                                : selectedDates.length > 0
                                                    ? new Date(selectedDates[0])
                                                    : undefined
                                        }
                                        onSelect={handleDateSelect}
                                        disabled={(date) => isDateBooked(date) || date < new Date()}
                                        className="booking-calendar"
                                        modifiers={{
                                            booked: (date) => isDateBooked(date),
                                        }}
                                        modifiersClassNames={{
                                            booked: "bg-red-200 text-red-700 pointer-events-none opacity-60",
                                        }}
                                        components={{
                                            IconLeft: () => <span className="text-lg">&lt;</span>,
                                            IconRight: () => <span className="text-lg">&gt;</span>,
                                        }}
                                        showOutsideDays={true}
                                        fixedWeeks={true}
                                        ISOWeek={false}
                                    />
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-red-200 border border-red-400"></div>
                                    <span className="text-sm text-gray-500">Booked dates</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                    onClick={handleSaveBooking}
                                    disabled={selectedDates.length === 0}
                                >
                                    Book {selectedDates.length} Date{selectedDates.length !== 1 ? "s" : ""}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="shadow-md border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-lg">Your Selection</CardTitle>
                                <CardDescription className="text-gray-500">
                                    {selectedDates.length > 0
                                        ? `You have selected ${selectedDates.length} date${selectedDates.length !== 1 ? "s" : ""}`
                                        : "No dates selected yet"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedDates.length > 0 ? (
                                    <ul className="space-y-2">
                                        {selectedDates.map((date, index) => (
                                            <li key={index} className="flex items-center gap-2 text-gray-700">
                                                <CalendarCheck className="h-4 w-4 text-blue-500" />
                                                {formatDate(date)}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                        <CalendarIcon className="h-8 w-8 mb-2" />
                                        <p className="text-sm">Select dates from the calendar</p>
                                    </div>
                                )}
                            </CardContent>
                            {selectedDates.length > 0 && (
                                <CardFooter className="flex justify-between border-t pt-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Info className="h-4 w-4 mr-1" />
                                        Click Book to confirm your selection
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedDates([])}>
                                        Clear
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="bookings">
                    <Card className="shadow-md border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-lg">All Bookings</CardTitle>
                            <CardDescription className="text-gray-500">View all current bookings in the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookings.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                            </tr>
                                        </thead>
<tbody className="bg-white divide-y divide-gray-100">
    {bookings.map((booking, index) => {
        const bookingDate = new Date(booking.booking_date);
        const today = new Date();
        const isPastDate = bookingDate < today;
        const isToday = bookingDate.toDateString() === today.toDateString();
        const isAfter11AM = today.getHours() >= 11;

        const showCancelButton = !isPastDate && (!isToday || (isToday && !isAfter11AM));

        return (
            <tr key={index}>
                <td className="px-4 py-2 text-gray-700">{formatDate(booking.booking_date)}</td>
                <td className="px-4 py-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                        Confirmed
                    </span>
                </td>
                <td className="px-4 py-2">
                    {showCancelButton ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelBooking(booking)}
                        >
                            Cancel
                        </Button>
                    ) : null}
                </td>
            </tr>
        );
    })}
</tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <Users className="h-8 w-8 mb-2" />
                                    <p className="text-sm">No bookings found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default CreateBooking