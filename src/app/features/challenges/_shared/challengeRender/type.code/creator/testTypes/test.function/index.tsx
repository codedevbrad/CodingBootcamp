'use client'
import { ExpectedType, TestCaseFunction, TestObj } from "./types";
import { TaskCodeDataProps } from "../../../definition";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

const EXPECTED_TYPES: ExpectedType[] = [
  "string",
  "number",
  "boolean",
  "array",
  "object",
  "null",
  "undefined",
];

// Component for rendering test cases with carousel
function TestCasesCarousel({
  data,
  setData,
}: {
  data: TaskCodeDataProps;
  setData: React.Dispatch<React.SetStateAction<TaskCodeDataProps>>;
}) {
  const testCases = data.testCases as TestCaseFunction;
  const tests = testCases.tests;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    // Reset to first slide when test cases change
    if (api && tests.length > 0) {
      api.scrollTo(0);
    }
  }, [tests.length, api]);

  const handleAddTestCase = () => {
    const newCase: TestObj = {
      args: [],
      expected: { value: "", type: "string" },
    };
    setData((prev) => ({
      ...prev,
      testCases: {
        ...(prev.testCases as TestCaseFunction),
        tests: [...(prev.testCases as TestCaseFunction).tests, newCase],
      },
    }));
  };

  const handleRemoveTestCase = (index: number) => {
    const updatedTests = tests.filter((_: TestObj, i: number) => i !== index);
    setData((prev) => ({
      ...prev,
      testCases: {
        ...(prev.testCases as TestCaseFunction),
        tests: updatedTests,
      },
    }));
  };

  const handleAddArgument = (testIndex: number) => {
    const updated = [...tests];
    updated[testIndex].args.push({ value: "", type: "string" });
    setData((prev) => ({
      ...prev,
      testCases: {
        ...(prev.testCases as TestCaseFunction),
        tests: updated,
      },
    }));
  };

  const handleRemoveArgument = (testIndex: number, argIndex: number) => {
    const updated = [...tests];
    updated[testIndex].args = updated[testIndex].args.filter(
      (_: unknown, i: number) => i !== argIndex
    );
    setData((prev) => ({
      ...prev,
      testCases: {
        ...(prev.testCases as TestCaseFunction),
        tests: updated,
      },
    }));
  };

  const handleArgChange = (
    testIndex: number,
    argIndex: number,
    key: "value" | "type",
    value: string
  ) => {
    const updated = [...tests];
    if (key === "type") {
      updated[testIndex].args[argIndex][key] = value as ExpectedType;
    } else {
      updated[testIndex].args[argIndex][key] = value;
    }
    setData((prev) => ({
      ...prev,
      testCases: {
        ...(prev.testCases as TestCaseFunction),
        tests: updated,
      },
    }));
  };

  const handleExpectedChange = (
    testIndex: number,
    key: "value" | "type",
    value: string
  ) => {
    const updated = [...tests];
    if (key === "type") {
      updated[testIndex].expected[key] = value as ExpectedType;
    } else {
      updated[testIndex].expected[key] = value;
    }
    setData((prev) => ({
      ...prev,
      testCases: {
        ...(prev.testCases as TestCaseFunction),
        tests: updated,
      },
    }));
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Test Cases</Label>
        {tests.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {current} of {count}
          </div>
        )}
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-sm mb-4">No test cases added yet</p>
          <Button variant="outline" size="sm" onClick={handleAddTestCase} className="gap-2">
            <Plus className="w-4 h-4" />
            Add First Test Case
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {tests.map((test: TestObj, testIndex: number) => (
                <CarouselItem key={testIndex}>
                  <div className="p-6 bg-white rounded-xl border space-y-6">
                    {/* Test Case Header */}
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <h3 className="font-semibold">Test Case {testIndex + 1}</h3>
                        <p className="text-sm text-muted-foreground">
                          Configure arguments and expected result
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTestCase(testIndex)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Arguments Section */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Arguments</Label>
                      {test.args.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground border-2 border-dashed rounded-lg text-sm">
                          No arguments yet
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {test.args.map((arg, argIndex: number) => (
                            <div key={argIndex} className="flex gap-2 items-center">
                              <Input
                                value={arg.value}
                                onChange={(e) =>
                                  handleArgChange(testIndex, argIndex, "value", e.target.value)
                                }
                                placeholder="Argument value"
                                className="flex-1"
                              />
                              <Select
                                value={arg.type}
                                onValueChange={(val) =>
                                  handleArgChange(testIndex, argIndex, "type", val)
                                }
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {EXPECTED_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveArgument(testIndex, argIndex)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddArgument(testIndex)}
                        className="w-full gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Argument
                      </Button>
                    </div>

                    {/* Expected Result Section */}
                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-sm font-medium">Expected Result</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`expected-value-${testIndex}`} className="text-xs text-muted-foreground">
                            Expected Value
                          </Label>
                          <Input
                            id={`expected-value-${testIndex}`}
                            value={test.expected.value}
                            onChange={(e) =>
                              handleExpectedChange(testIndex, "value", e.target.value)
                            }
                            placeholder="Expected value"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`expected-type-${testIndex}`} className="text-xs text-muted-foreground">
                            Expected Type
                          </Label>
                          <Select
                            value={test.expected.type}
                            onValueChange={(val) =>
                              handleExpectedChange(testIndex, "type", val)
                            }
                          >
                            <SelectTrigger id={`expected-type-${testIndex}`}>
                              <SelectValue placeholder="Expected type" />
                            </SelectTrigger>
                            <SelectContent>
                              {EXPECTED_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" onClick={handleAddTestCase} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Test Case
        </Button>
      </div>
    </div>
  );
}

export default function handleFunctionCases({
  data,
  setData,
}: {
  data: TaskCodeDataProps;
  setData: React.Dispatch<React.SetStateAction<TaskCodeDataProps>>;
}) {
  const renderTestCasesUI = () => {
    return <TestCasesCarousel data={data} setData={setData} />;
  };

  return {
    renderTestCasesUI,
  };
}
