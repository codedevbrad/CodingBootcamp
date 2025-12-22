export type ExpectedType = "string" | "number" | "boolean" | "array" | "object" | "null" | "undefined"

export interface Argument {
  value: string;
  type: ExpectedType;
}

export interface Expected {
  value: string;
  type: ExpectedType;
}

export interface TestObj {
    args: Argument[];
    expected: Expected;
}

// test cases for functions.
export interface TestCaseFunction {
  tests: TestObj[] | [] 
}