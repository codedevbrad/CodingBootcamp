export type HTMLTag = | 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav' | 'aside'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'ul' | 'ol' | 'li' | 'a' | 'button'
  | 'form' | 'input' | 'label';

// Constants
export const TAGS: HTMLTag[] = [
  "div",
  "section",
  "article",
  "header",
  "footer",
  "main",
  "nav",
  "aside",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "ul",
  "ol",
  "li",
  "a",
  "button",
  "form",
  "input",
  "label",
];

export const TYPES = [
  "string",
  "number",
  "boolean",
  "object",
  "undefined",
  "function",
];

export interface TagValidation {
    tag: HTMLTag;
    expectedToPass?: boolean; // defaults to true if omitted
}
  
export interface TextValidation {
    text: string;
    expectedToPass?: boolean; // defaults to true if omitted
}

export interface PropTypeValidation {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function';
}

export interface TestValidations {
    tags?: (HTMLTag | TagValidation)[];
    includesText?: (string | TextValidation)[];
}

export interface GlobalValidations extends TestValidations {
    props?: PropTypeValidation[];
}

export interface TestCase {
    props: Record<string, any>;
    validations?: TestValidations;
}

export interface ReactTestSuite {
    testCases: {
        tests: TestCase[];
        validations?: GlobalValidations;
    }
}