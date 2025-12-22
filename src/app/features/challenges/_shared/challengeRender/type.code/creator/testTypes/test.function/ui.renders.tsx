// components/testCases/RenderFunctionTestCases.tsx
import React from 'react'

export default function RenderFunctionTestCases({ cases }) {
  return (
    <ul className="space-y-2 text-sm">
      {cases.tests.map((testCase, index) => (
        <li key={index} className="bg-gray-900 p-4 rounded-md">
          <div className='mb-2'>
            Args: [
            {testCase.args.map((arg, i) => (
              <span key={i}>
                {arg.value}
                <span className='bg-blue-700 rounded-sm px-1 py-0.5 mx-1 my-0.5'>
                  {arg.type}
                </span>
                {i < testCase.args.length - 1 ? ', ' : ''}
              </span>
            ))}]
          </div>
          <div>
            Expected: {testCase.expected.value}
            <span className='bg-blue-700 rounded-sm px-1 py-0.5 mx-1 my-0.5'>
              {testCase.expected.type}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
