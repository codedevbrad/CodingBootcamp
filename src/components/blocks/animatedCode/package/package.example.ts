import type { animatedCodeChallengeBlock } from "./package.types"

import { animatedData } from "./package.types";

export const refactorData: animatedData = [
    {
      step: 1,
      code: [{ content: `function DisplayName` , newLine: false , indent: 0 }],
      type: "interactive",
      audio: "",
      // indent: 0,
      // newLine: false,
      appendType: { type: "new" },
      interactive: {
        correct: 0,
        options: [
          `function keyword function name`,
          `function name function keyword`,
        ],
        question: "How do we tell js we want to create a named function?",
      },
    },
    {
      step: 2,
      type: "interactive",
      appendType: { type: "new" },
      audio: "",
      // indent: 0,
      // newLine: false,
      code: [{ content: `( { name , age } ) {`, newLine: false , indent: 0.5 }],
      interactive: {
        correct: 0,
        options: [`({ propname })`, `([ propname ])`, `(propname)`],
        question: "How do we allow for arguments to be passed to a function?",
      },
    },
    {            
      step: 3,
      type: "interactive",
      audio: "",
      // indent: 2,
      // newLine: { state: true , by: 1 },
      code: [{ content: `return`, newLine: { state: true , by: 1 } , indent: 2 }],
      appendType: { type: "new" },
      interactive: {
        correct: 0,
        options: [`return`, `visualise`, `render`],
        question:
          "How do we turn a function into a component that can render jsx?",
      },
    },
    {
      step: 4,
      type: "interactive",
      audio: "",
      // indent: 0,
      // newLine: false,
      appendType: { type: "new" },
      code: [
        { content: "(", indent: 0.5, newLine: false },
        { content: "<div>", indent: 4, newLine: { state: true , by: 1 } },
        { content: "{ name }", indent: 6, newLine: { state: true , by: 1 } },
        { content: "</div>", indent: 4, newLine: { state: true , by: 1 } },
        { content: ")", indent: 2, newLine: { state: true , by: 1 } },
        { content: "}", indent: 0, newLine: { state: true , by: 1 } }
      ],
      interactive: {
        correct: 2,
        options: [`[ ]`, `{ }`, `( )`],
        question: "How do we open and close jsx for a component?",
      },
    },
    {
        step: 5,
        type: "interactive",
        audio: "",
        appendType: { type: "edit", step: 4 },
        code: [
          { content: "(", indent: 0.5, newLine: false },
          { content: "<div>", indent: 4, newLine: { state: true , by: 1 } },
          { content: "{ name } { age }", indent: 6, newLine: { state: true , by: 1 } },
          { content: "</div>", indent: 4, newLine: { state: true , by: 1 } },
          { content: ")", indent: 2, newLine: { state: true , by: 1 } },
          { content: "}", indent: 0, newLine: { state: true , by: 1 } }
        ],
        interactive: {
            correct: 0,
            options: ["{ name } { age }", "{ name } age", "{ name , age }"],
            question: "Now try rendering the age prop",
        },
      },
       {
          step: 6,
          type: "interactive",
          audio: "",
          appendType: { type: "new" },
          code: [
              { 
                content: "export default DisplayName;", indent: 0, newLine: { state: true , by: 2 } 
              },
          ],
          interactive: {
              correct: 1,
              options: [
                  "export function DisplayName",
                  "export default function DisplayName;",
              ],
              question: "How do we export this component to use elsewhere?",
          },
    },
    {
        step: 7,
        type: "interactive",
        audio: "",
        // indent: 0,
        // newLine: false,
        appendType: { type: "edit", step: 6 },
        code: [
          { 
            content: `export { DisplayName };`, 
            indent: 0,
            newLine: { state: true, by: 2 },
          }
        ],
        interactive: {
          correct: 0,
          options: [
            `export { DisplayName }`,
            `export const DisplayName`,
          ],
          question: "What though if we want to export as a object?",
        },
    }
  ];

export const animatedCodeChallengeObject : animatedCodeChallengeBlock = { 
    type: 'animatedCodeChallenge',
    title: 'Creating ReactJs components',
    description: `Learn how to create a ReactJs component from scratch, step by step.`,
    summary: `We can see how a component is created and the syntax needed. I'd say the hardest parts are getting the keywords right.`,
    data: {
        steps : refactorData,
        codeType: 'jsx',
    },
}
