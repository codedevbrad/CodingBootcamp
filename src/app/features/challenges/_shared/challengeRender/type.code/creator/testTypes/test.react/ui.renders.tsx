// components/testCases/RenderReactTestCases.tsx
import React from "react";
import { HTMLTag, ReactTestSuite } from "./type";

interface RenderReactTestCasesProps {
  cases: ReactTestSuite["testCases"];
}

/* A nice ui to render the test cases for react. */


export default function RenderReactTestCases({ cases }: RenderReactTestCasesProps) {
  return (
    <ul className="space-y-4 text-sm">
      {cases.tests.map((test, index) => (
        <li key={index} className="bg-gray-900 p-4 rounded-md space-y-3">
          <div>
            <strong>Props:</strong>{" "}
            {Object.entries(test.props).length === 0 ? (
              <span className="italic text-gray-400">No props</span>
            ) : (
              <ul className="pl-4 list-disc space-y-1">
                {Object.entries(test.props).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-medium">{key}</span>:{" "}
                    <code className="text-blue-300">
                      {JSON.stringify(value)}
                    </code>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <strong>Tag Validations:</strong>{" "}
            {test.validations?.tags?.length ? (
              <ul className="pl-4 list-disc space-y-1">
                {test.validations.tags.map((tag, i) => {
                  const tagName = typeof tag === "string" ? tag : tag.tag;
                  const expected = typeof tag === "string" ? true : tag.expectedToPass ?? true;
                  return (
                    <li key={i}>
                      <span className="text-green-300">{`<${tagName}>`}</span>{" "}
                      {expected ? "should exist" : "should NOT exist"}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="italic text-gray-400">No tag checks</span>
            )}
          </div>

          <div>
            <strong>Text Validations:</strong>{" "}
            {test.validations?.includesText?.length ? (
              <ul className="pl-4 list-disc space-y-1">
                {test.validations.includesText.map((txt, i) => {
                  const value = typeof txt === "string" ? txt : txt.text;
                  const expected = typeof txt === "string" ? true : txt.expectedToPass ?? true;
                  return (
                    <li key={i}>
                      Text "<span className="text-yellow-300">{value}</span>"{" "}
                      {expected ? "should exist" : "should NOT exist"}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="italic text-gray-400">No text checks</span>
            )}
          </div>
        </li>
      ))}

      {cases.validations?.props?.length ? (
        <li className="bg-gray-800 p-4 rounded-md space-y-2">
          <div>
            <strong>Global Prop Validations:</strong>
            <ul className="pl-4 list-disc space-y-1">
              {cases.validations.props.map((v, i) => (
                <li key={i}>
                  <span className="font-medium">{v.name}</span>:{" "}
                  <span className="text-blue-400">{v.type}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ) : null}
    </ul>
  );
}
