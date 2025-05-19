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

const departments = [
  { label: "Sales", value: "sales" },
  { label: "Marketing", value: "marketing" },
  { label: "HR", value: "hr" },
  { label: "Support", value: "support" },
  { label: "Development", value: "dev" },
];

const DailyReports = () => {
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
          <form className="space-y-6">
            <div>
              <Label htmlFor="department" className="mb-1 block font-medium">
                Organization
              </Label>
              <Select>
                <SelectTrigger id="department" className="h-12 rounded-lg border bg-white/80 shadow-sm focus:ring-primary/30 transition-all">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-white z-20 shadow-lg rounded-xl border mt-2" position="popper">
                  {departments.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="w-full h-11 bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all duration-150"
            type="submit"
          >
            Generate Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DailyReports
