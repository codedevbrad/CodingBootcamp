// @ts-nocheck
import React from "react"
import { Highlight, themes } from "prism-react-renderer"
import { motion } from "framer-motion"

// EditorHeader Component.
export const EditorHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between bg-gray-800 text-white px-3 py-2 rounded-lg"
    >
      <div className="text-center flex-grow text-sm">challenge.jsx</div>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="w-3 h-3 bg-red-500 rounded-full"> </div>
      </div>
    </motion.div>
  );
};

// NextButton Component.
export const NextButton = ({ onClick, isDisabled }) => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
      disabled={isDisabled}
    >
      What's next?
    </motion.button>
  );
};

// CompletedButton Component.
export const CompletedButton = ({ completedText = "Retry the challenge!" , onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="bg-black text-white px-4 py-2 rounded-xl"
    >
        { completedText }
    </motion.button>
  );
};

// OptionsDisplay Component.
export const OptionsDisplay = ({
  options,
  onSelectOption,
  selectedOption,
  correctOption,
  incorrectSelections,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex space-x-4"
    >
      {options.map((option, index) => {
        const isIncorrect = incorrectSelections.includes(index);
        const isCorrect = index === correctOption;
        const isSelected = index === selectedOption;

        let buttonClass = "flex flex-row px-3 py-3 rounded-xl focus:outline-none";

        if (isCorrect && isSelected) {
          buttonClass += " bg-black text-white";
        } 
        else if (isIncorrect) {
          buttonClass += " bg-red-700 text-white"; // Grey out incorrect selections
        } 
        else {
          buttonClass += " bg-gray-700 text-white hover:bg-gray-600";
        }

        return (
          <button
            key={index}
            onClick={() => onSelectOption(index)}
            className={buttonClass}
            disabled={isIncorrect} // Disable the button if it has been incorrectly selected
          >
            { isIncorrect &&
                <div className="mr-2 bg-red-800 px-2 rounded-md">
                    incorrect
                </div>
            } 
            { isCorrect && isSelected && 
                <div className="mr-2 bg-gray-700 px-2 rounded-md">
                   Correct
                </div>
            }
            {option}
          </button>
        );
      })}
    </motion.div>
  );
};

// CodeDisplay Component.
export const CodeDisplay = ({ displayedCode, previousCode , codeType = 'jsx' }) => {
  return (
    <div className="bg-gray-900 text-green-400 p-4 rounded-b-lg bg-transparent">
      <Highlight
        theme={themes.nightOwl}
        code={displayedCode}
        language={ codeType }
        style={{ backgroundColor: "transparent", padding: 0 }}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          let previousIndex = 0; // Tracks the position in the previousCode
          let currentIndex = 0;  // Tracks the position in the displayedCode

          return (
            <pre style={{ ...style, backgroundColor: "transparent", padding: 0 }}>
              {tokens.map((line, i) => {
                const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });

                return (
                  <div key={lineKey} {...lineProps} className={`relative`}>
                    <span className="text-gray-600 mr-3" contentEditable={false}>
                      {i + 1}
                    </span>
                    <>
                      {line.map((token, tokenIndex) => {
                        const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key: tokenIndex });
                        const tokenContent = token.content;

                        // Determine if this token is new or edited by comparing with previousCode
                        const isTokenNewOrEdited = 
                          currentIndex >= previousIndex &&
                          (currentIndex < displayedCode.length && tokenContent !== previousCode.slice(currentIndex, currentIndex + tokenContent.length));
                          
                        currentIndex += tokenContent.length;
                        previousIndex += tokenContent.length;

                        return (
                          <motion.span
                          key={tokenKey}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          {...tokenProps}
                          className={isTokenNewOrEdited ? ' py-1' : 'py-1'}
                          >
                            {tokenContent}
                          </motion.span>
                        );
                      })}
                    </>
                  </div>
                );
              })}
            </pre>
          );
        }}
      </Highlight>
    </div>
  );
};