// All your imports
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TaskCodeDataProps } from "../../../definition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestCase , TAGS , TYPES } from "./type";
import TestCaseImporter from "./importer";
import { templates } from "./examples";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import HelpPopover from "./help";


// Supported prop and array item types
const PROP_TYPES = ["string", "number", "boolean" , "array" ] as const;
const ARRAY_ITEM_TYPES = ["string", "number"] as const;

type PropType = (typeof PROP_TYPES)[number];


export default function handleReactComponentCases({
  data,
  setData,
}: {
  data: TaskCodeDataProps;
  setData: React.Dispatch<React.SetStateAction<TaskCodeDataProps>>;
}) {

 // Add a new empty test case
  const addTestCase = () => {
    const newCase: TestCase = {
      props: {},
      validations: { tags: [], includesText: [] },
    };
    setData((prev) => ({
      ...prev,
      testCases: {
        ...prev.testCases,
        tests: [...prev.testCases.tests, newCase],
      },
    }));
  };

  // Remove a test case by index
  const removeTestCase = (index: number) => {
    const tests = data.testCases.tests.filter((_, i) => i !== index);
    setData((prev) => ({
      ...prev,
      testCases: { ...prev.testCases, tests },
    }));
  };

  /**
   * Update a prop's type, value, or array items
   */
  const updateProp = (
    testIndex: number,
    key: string,
    newVal: any,
    action?: "type" | "addItem" | "removeItem" | "itemType" | "itemValue",
    idx?: number
  ) => {
    const updated = [...data.testCases.tests];
    const propsMap = {
      ...((updated[testIndex].props as Record<string, any>) || {}),
    };

    if (action === "type") {
      propsMap[key] = newVal === "array" ? [] : newVal === "number" ? 0 : newVal === "boolean" ? false : "";
    } else if (action === "addItem") {
      (propsMap[key] as any[]).push("");
    } else if (action === "removeItem" && typeof idx === "number") {
      (propsMap[key] as any[]).splice(idx, 1);
    } else if (action === "itemType" && typeof idx === "number") {
      (propsMap[key] as any[])[idx] = newVal === "number" ? 0 : "";
    } else if (action === "itemValue" && typeof idx === "number") {
      (propsMap[key] as any[])[idx] = newVal;
    } else {
      propsMap[key] = newVal;
    }

    updated[testIndex].props = propsMap;
    setData((prev) => ({
      ...prev,
      testCases: { ...prev.testCases, tests: updated },
    }));
  };

  // Generic validation updater
  const updateValidation = (
    testIndex: number,
    type: "tags" | "includesText",
    idx: number,
    key: string,
    value: string | boolean
  ) => {
    const updated = [...data.testCases.tests];
    const list = (updated[testIndex].validations?.[type] as any[]) || [];
    if (!list[idx]) list[idx] = {};
    list[idx][key] = value;
    updated[testIndex].validations = {
      ...updated[testIndex].validations,
      [type]: list,
    };
    setData((prev) => ({
      ...prev,
      testCases: { ...prev.testCases, tests: updated },
    }));
  };

  // Validation add/remove helpers
  const addValidationItem = (
    testIndex: number,
    type: "tags" | "includesText"
  ) => {
    const updated = [...data.testCases.tests];
    const curr = updated[testIndex].validations?.[type] || [];
    const def =
      type === "tags"
        ? { tag: "div", expectedToPass: true }
        : { text: "", expectedToPass: true };
    updated[testIndex].validations = {
      ...updated[testIndex].validations,
      [type]: [...curr, def],
    };
    setData((prev) => ({
      ...prev,
      testCases: { ...prev.testCases, tests: updated },
    }));
  };

  const removeValidationItem = (
    testIndex: number,
    type: "tags" | "includesText",
    idx: number
  ) => {
    const updated = [...data.testCases.tests];
    const list = (updated[testIndex].validations?.[type] as any[]) || [];
    list.splice(idx, 1);
    updated[testIndex].validations = {
      ...updated[testIndex].validations,
      [type]: list,
    };
    setData((prev) => ({
      ...prev,
      testCases: { ...prev.testCases, tests: updated },
    }));
  };

  // Global prop validation updater
  const updateGlobalValidation = (
    i: number,
    key: "name" | "type",
    val: string
  ) => {
    const updated = [...(data.testCases.validations?.props || [])];
    if (!updated[i]) updated[i] = { name: "", type: "string" };
    updated[i][key] = val;
    setData((prev) => ({
      ...prev,
      testCases: {
        ...prev.testCases,
        validations: { ...(prev.testCases.validations || {}), props: updated },
      },
    }));
  };

  // Unique prop key generator
  const generateNewPropKey = (testIndex: number) => {
    const keys = Object.keys(data.testCases.tests[testIndex].props || {});
    let i = 1;
    let k = `prop${i}`;
    while (keys.includes(k)) {
      i++;
      k = `prop${i}`;
    }
    return k;
  };

  // Main render ...
  const renderReactTestUI = () => (
    <div className="flex flex-col gap-6 bg-gray-50 p-4 rounded-xl">

      <TestCaseImporter
        onImport={(parsed) => setData((prev) => ({ ...prev, testCases: parsed }))}
        templates={templates}
      />

      <div className="flex items-center justify-between">
        <Label className="text-lg">React Test Cases</Label>
        <HelpPopover />
      </div>

      <Carousel className="w-full">
        <CarouselContent>
          {data.testCases.tests.map((test, testIndex) => (
            <CarouselItem key={testIndex} className="basis-full">
              <div className="space-y-4 p-3 bg-white rounded-xl border flex-col flex">

                <h2 className="text-lg font-bold">Test {testIndex + 1}</h2>

                <div className="border p-3  flex flex-col gap-4 rounded-lg">
                    <Label>Props</Label>
                    <p className="text-sm text-gray-500">
                       Define input values passed to your component.
                    </p>
                    <div className="flex flex-col gap-3">
                      {Object.entries(test.props || {}).map(([key, val], idx) => {
                        const propType: PropType = Array.isArray(val)
                        ? "array"
                        : typeof val === "number"
                        ? "number"
                        : typeof val === "boolean"
                        ? "boolean"
                        : "string";
                        return (
                          <div key={idx} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Input
                                className="w-[150px]"
                                value={key}
                                placeholder="Prop name"
                                onChange={(e) => {
                                  const newKey = e.target.value;
                                  if (!newKey) return;
                                  const propsMap = { ...(test.props || {}) };
                                  const value = propsMap[key];
                                  delete propsMap[key];
                                  propsMap[newKey] = value;
                                  const updated = [...data.testCases.tests];
                                  updated[testIndex].props = propsMap;
                                  setData((prev) => ({
                                    ...prev,
                                    testCases: { ...prev.testCases, tests: updated },
                                  }));
                                }}
                              />
                              <Select
                                className="w-[100px]"
                                value={propType}
                                onValueChange={(type) =>
                                  updateProp(testIndex, key, type, "type")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PROP_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Prop value input */}
                            {propType === "boolean" ? (
                                    <Select
                              className="w-[120px]"
                              value={String(val)}
                              onValueChange={(val) => updateProp(testIndex, key, val === "true")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Value" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                              </SelectContent>
                            </Select>
                            ) : 

                            propType === "array" ? (
                              <div className="flex flex-col gap-2">
                                {(val as any[]).map((item, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Select
                                      className="w-[80px]"
                                      value={typeof item === "number" ? "number" : "string"}
                                      onValueChange={(type) =>
                                        updateProp(
                                          testIndex,
                                          key,
                                          type,
                                          "itemType",
                                          index
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {ARRAY_ITEM_TYPES.map((t) => (
                                          <SelectItem key={t} value={t}>
                                            {t}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      className="w-full"
                                      type={typeof item === "number" ? "number" : "text"}
                                      value={item}
                                      placeholder="Value"
                                      onChange={(e) => {
                                        const value =
                                          typeof item === "number"
                                            ? Number(e.target.value)
                                            : e.target.value;
                                        updateProp(
                                          testIndex,
                                          key,
                                          value,
                                          "itemValue",
                                          index
                                        );
                                      }}
                                    />
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        updateProp(
                                          testIndex,
                                          key,
                                          null,
                                          "removeItem",
                                          index
                                        )
                                      }
                                    >
                                      ✖
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateProp(testIndex, key, null, "addItem")}
                                >
                                  ➕ Add Item
                                </Button>
                              </div>
                            ) : (
                              <Input
                                className="w-full"
                                type={propType === "number" ? "number" : "text"}
                                value={val as string | number}
                                placeholder="Prop value"
                                onChange={(e) => {
                                  const value =
                                    propType === "number"
                                      ? Number(e.target.value)
                                      : e.target.value;
                                  updateProp(testIndex, key, value);
                                }}
                              />
                          )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const updated = [...data.testCases.tests];
                                delete updated[testIndex].props[key];
                                setData((prev) => ({
                                  ...prev,
                                  testCases: { ...prev.testCases, tests: updated },
                                }));
                              }}
                            >
                              ✖
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const key = generateNewPropKey(testIndex);
                        updateProp(testIndex, key, "", "type");
                      }}
                    >
                      ➕ Add Prop
                    </Button>
                </div>

                <div className="border p-3  flex flex-col gap-4 rounded-lg">
                    {/* Tag Validations */}
                    <Label>Tag Validations</Label>
                    <p className="text-sm text-gray-500">
                      Check for specific HTML tags in the rendered output.
                    </p>
                    {test.validations?.tags.map((tag, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Select
                          className="w-[120px]"
                          value={tag.tag}
                          onValueChange={(val) =>
                            updateValidation(testIndex, "tags", i, "tag", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tag" />
                          </SelectTrigger>
                          <SelectContent>
                            {TAGS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          className="w-[120px]"
                          value={String(tag.expectedToPass)}
                          onValueChange={(val) =>
                            updateValidation(
                              testIndex,
                              "tags",
                              i,
                              "expectedToPass",
                              val === "true"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Expected?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Should Exist</SelectItem>
                            <SelectItem value="false">Should Not Exist</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeValidationItem(testIndex, "tags", i)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addValidationItem(testIndex, "tags")}
                    >
                      Add Tag Check
                    </Button>
                </div>
                    
                <div className="border p-3 flex flex-col gap-4 rounded-lg">                
                    {/* Text Validations */}
                    <Label>Text Validations</Label>
                    <p className="text-sm text-gray-500">
                      Ensure specific text appears or does not appear.
                    </p>
                    {test.validations?.includesText.map((txt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={txt.text}
                          placeholder="Text to check"
                          onChange={(e) =>
                            updateValidation(
                              testIndex,
                              "includesText",
                              i,
                              "text",
                              e.target.value
                            )
                          }
                        />
                        <Select
                          className="w-[120px]"
                          value={String(txt.expectedToPass)}
                          onValueChange={(val) =>
                            updateValidation(
                              testIndex,
                              "includesText",
                              i,
                              "expectedToPass",
                              val === "true"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Expected?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Should Exist</SelectItem>
                            <SelectItem value="false">Should Not Exist</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            removeValidationItem(testIndex, "includesText", i)
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addValidationItem(testIndex, "includesText")}
                    >
                      Add Text Check
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTestCase(testIndex)}
                    >
                      Remove Test Case
                    </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-6" />
        <CarouselNext className="mr-6" />
      </Carousel>

      <Button size="sm" variant="outline" onClick={addTestCase}>
        ➕ Add Test Case
      </Button>

      <div className="space-y-4 mt-6">
        <Label>Global Prop Validations</Label>
        {data.testCases.validations?.props.map((g, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              className="w-[150px]"
              value={g.name}
              placeholder="Prop name"
              onChange={(e) =>
                updateGlobalValidation(i, "name", e.target.value)
              }
            />
            <Select
              className="w-[120px]"
              value={g.type}
              onValueChange={(val) => updateGlobalValidation(i, "type", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const updated = [...(data.testCases.validations?.props || [])];
                updated.splice(i, 1);
                setData((prev) => ({
                  ...prev,
                  testCases: {
                    ...prev.testCases,
                    validations: {
                      ...(prev.testCases.validations || {}),
                      props: updated,
                    },
                  },
                }));
              }}
            >
              ✖
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            updateGlobalValidation(
              (data.testCases.validations?.props || []).length,
              "name",
              ""
            )
          }
        >
          ➕ Add Prop Validation
        </Button>
      </div>
    </div>
  );

  return { renderReactTestUI };
}
