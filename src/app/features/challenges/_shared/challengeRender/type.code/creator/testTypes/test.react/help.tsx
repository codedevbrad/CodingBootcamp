import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Info } from "lucide-react";

export default function HelpPopover() {
  return (
    <Popover>
      <PopoverTrigger className="ml-2 text-sm text-blue-600 hover:underline items-center flex gap-1">
        Guide <Info className="w-4 h-4" /> 
      </PopoverTrigger>
      <PopoverContent className="max-w-md text-sm p-6 space-y-4" side="bottom" align="end">
        <p className="bg-gray-50 p-3 rounded-md"><strong>Validations:</strong> You can add positive or negative checks using the dropdowns.</p>
        <p className="bg-gray-50 p-3 rounded-md"><strong>Prop Type Validations:</strong> Ensure your component receives correct prop types (e.g., string, number).</p>
        <p className="bg-gray-50 p-3 rounded-md"><strong>Test Cases:</strong> Each test simulates a different scenario. Add as many as you need!</p>
      </PopoverContent>
    </Popover>
  );
}