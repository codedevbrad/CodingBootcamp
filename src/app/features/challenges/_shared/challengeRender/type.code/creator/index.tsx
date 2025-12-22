'use client'
import { useState, useTransition , useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import handleFunctionCases from "./testTypes/test.function"
import handleReactComponentCases from "./testTypes/test.react"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Code2Icon, FileText, Lightbulb, TestTube, Save, X, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getInitialTestCasesByType , testTypes , TaskCodeDataProps } from "../definition"

import { db_updateTaskCodeData } from "@/app/features/challenges/creator/domains/db"
import { Challenge } from "@prisma/client"
import { taskCodeData } from "../definition"

function DataPopover({ data }: { data: TaskCodeDataProps }) {
  const jsonString = useMemo(
    () => JSON.stringify(data, null, 2),
    [data]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Code2Icon className="w-4 h-4" />
          View JSON
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] overflow-hidden bg-black" side="left" align="start">
        <ScrollArea className="bg-gray-900 text-white m-2 p-5 rounded-lg">
          <pre className="text-sm whitespace-pre-wrap break-words">
            {jsonString}
          </pre>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}


function HandleTestTypeRenderAndChange ( { data , setData }: { data: TaskCodeDataProps, setData: React.Dispatch<React.SetStateAction<TaskCodeDataProps>> } ) {
      
    const { renderTestCasesUI } = handleFunctionCases({ data, setData });
    const { renderReactTestUI } = handleReactComponentCases({ data, setData });

    function handleSelectChange(val: string) {
      const codeType = val as testTypes;
    
      setData((prev: TaskCodeDataProps) => ({
        ...prev,
        codeType,
        testCases: getInitialTestCasesByType(codeType),
      }));
    }    

    return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Test Configuration
            </CardTitle>
            <CardDescription>
              Configure test cases for your challenge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Test Type</Label>
              <Select
                value={data.codeType}
                onValueChange={ handleSelectChange }
              >
                <SelectTrigger className="w-full max-w-[200px]">
                  <SelectValue placeholder="Select code type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="js">JavaScript</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-4">
                  {data.codeType === "js" && renderTestCasesUI()}
                  {data.codeType === "react" && renderReactTestUI()}
            </div>
          </CardContent>
        </Card>
    )
}


export default function CreatorTaskTypeCode ({ challenge }: { challenge: Challenge } ) {
    // Initialize data from challenge.work, or use default structure if empty
    const initialData = challenge.work && typeof challenge.work === 'object' && Object.keys(challenge.work).length > 0
      ? (challenge.work as unknown as TaskCodeDataProps)
      : taskCodeData;
    
    const [data, setData] = useState<TaskCodeDataProps>(initialData);
    const [isPending, startTransition] = useTransition();

    const handleAddHint = () => {
      setData((prev) => ({ ...prev, hints: [...prev.hints, ""] }));
    };

    const handleHintChange = (index: number, value: string) => {
      const hints = [...data.hints];
      hints[index] = value;
      setData((prev) => ({ ...prev, hints }));
    };

    const handleRemoveHint = (index: number) => {
      const hints = data.hints.filter((_, i) => i !== index);
      setData((prev) => ({ ...prev, hints }));
    };

    const handleUpdate = () => {
      startTransition(async () => {
        try {
          await db_updateTaskCodeData({ id: challenge.id, data });
        } 
        catch (err) {
          console.error(err);
        }
      });
    };


    return (
      <div className="space-y-6 p-1">
        {/* Header with JSON viewer */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Challenge Editor</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Configure your coding challenge details and test cases
            </p>
          </div>
          <DataPopover data={ data } />
        </div>

        <Separator />

        {/* Description and Hints in a row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Challenge Description
              </CardTitle>
              <CardDescription>
                Provide a clear description of what students need to accomplish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Enter challenge description..."
                  className="min-h-[120px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hints Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Hints
              </CardTitle>
              <CardDescription>
                Add helpful hints to guide students when they get stuck
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.hints.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hints added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.hints.map((hint, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <Label htmlFor={`hint-${index}`} className="text-xs text-muted-foreground mb-1 block">
                            Hint {index + 1}
                          </Label>
                          <Textarea
                            id={`hint-${index}`}
                            value={hint}
                            onChange={(e) => handleHintChange(index, e.target.value)}
                            placeholder={`Enter hint ${index + 1}...`}
                            className="min-h-[80px] resize-none"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveHint(index)}
                          className="mt-6 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {index < data.hints.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddHint}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Hint
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Configuration in a column underneath */}
        <HandleTestTypeRenderAndChange data={ data } setData={ setData } />

        {/* Footer with Save button */}
        <Separator />
        <div className="flex justify-end">
          <Button 
            onClick={handleUpdate} 
            disabled={isPending}
            size="lg"
            className="gap-2 min-w-[140px]"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Task Data
              </>
            )}
          </Button>
        </div>
      </div>
    );
}