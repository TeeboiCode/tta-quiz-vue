
// Varaiable
// const quizQuestions = [
//   {
//     id: 1,
//     question:
//       "Which keyword is used to declare a variable that can be reassigned in JavaScript?",
//     options: ["let", "const", "var", "function"],
//     correct: "let",
//   },
//   {
//     id: 2,
//     question:
//       "Which of the following will throw an error if the variable is redeclared?",
//     options: ["let", "var", "const", "None of the above"],
//     correct: "let",
//   },
//   {
//     id: 3,
//     question:
//       "What is the default value of a variable declared with 'let' before it is assigned a value?",
//     options: ["undefined", "null", "0", "NaN"],
//     correct: "undefined",
//   },
//   {
//     id: 4,
//     question:
//       "Which keyword would you use to declare a variable that should not be reassigned?",
//     options: ["let", "var", "const", "function"],
//     correct: "const",
//   },
//   {
//     id: 5,
//     question: "Which of the following is true about 'var' declarations?",
//     options: [
//       "They are block-scoped",
//       "They are function-scoped",
//       "They are not hoisted",
//       "They cannot be reassigned",
//     ],
//     correct: "They are function-scoped",
//   },
//   {
//     id: 6,
//     question: "What will happen if you try to reassign a 'const' variable?",
//     options: [
//       "It will throw a syntax error",
//       "It will create a new variable",
//       "It will silently fail",
//       "It will reassign the variable",
//     ],
//     correct: "It will throw a syntax error",
//   },
//   {
//     id: 7,
//     question:
//       "Which of the following can be used to declare a variable in JavaScript?",
//     options: ["let", "const", "var", "All of the above"],
//     correct: "All of the above",
//   },
//   {
//     id: 8,
//     question: "What is the scope of a variable declared with 'let'?",
//     options: ["Global", "Block-scoped", "Function-scoped", "None of the above"],
//     correct: "Block-scoped",
//   },
//   {
//     id: 9,
//     question:
//       "Which of the following declarations creates a variable in the global scope?",
//     options: [
//       "var myVar = 10;",
//       "let myVar = 10;",
//       "const myVar = 10;",
//       "All of the above",
//     ],
//     correct: "var myVar = 10;",
//   },
//   {
//     id: 10,
//     question:
//       "What will be the output of the following code: \n\n const num = 5; \n num = 10; \n console.log(num);",
//     options: ["10", "5", "Syntax Error", "TypeError"],
//     correct: "TypeError",
//   },
//   {
//     id: 11,
//     question:
//       "Which keyword allows you to declare a variable that is limited in scope to the block, statement, or expression in which it is used?",
//     options: ["let", "var", "const", "global"],
//     correct: "let",
//   },
//   {
//     id: 12,
//     question:
//       "What happens if a variable is declared with 'var' inside a function?",
//     options: [
//       "It becomes a global variable",
//       "It becomes a block-scoped variable",
//       "It becomes a local variable",
//       "It cannot be reassigned",
//     ],
//     correct: "It becomes a local variable",
//   },
//   {
//     id: 13,
//     question:
//       "Which of the following is a characteristic of 'const' declarations?",
//     options: [
//       "They can be reassigned",
//       "They cannot be redeclared",
//       "They are not block-scoped",
//       "They are function-scoped",
//     ],
//     correct: "They cannot be redeclared",
//   },
//   {
//     id: 14,
//     question: "Which keyword is hoisted with an initial value of 'undefined'?",
//     options: ["let", "const", "var", "All of the above"],
//     correct: "var",
//   },
//   {
//     id: 15,
//     question:
//       "What will be the output of the following code: \n\n let x = 10; \n { let x = 20; } \n console.log(x);",
//     options: ["10", "20", "undefined", "ReferenceError"],
//     correct: "10",
//   },
//   {
//     id: 16,
//     question: "Which of the following will result in a 'SyntaxError'?",
//     options: [
//       "Re-declaring a variable with 'let' in the same block",
//       "Reassigning a 'const' variable",
//       "Declaring a variable with 'var' inside a function",
//       "Re-declaring a variable with 'const' outside the block",
//     ],
//     correct: "Re-declaring a variable with 'let' in the same block",
//   },
//   {
//     id: 17,
//     question:
//       "Can a variable declared with 'var' be accessed before its declaration?",
//     options: [
//       "Yes, it will be 'undefined'",
//       "No, it will throw a 'ReferenceError'",
//       "Yes, but it will be 'null'",
//       "No, it will be 'NaN'",
//     ],
//     correct: "Yes, it will be 'undefined'",
//   },
//   {
//     id: 18,
//     question:
//       "Which of the following statements is true about 'const' objects?",
//     options: [
//       "You cannot modify the properties of a 'const' object",
//       "You cannot add new properties to a 'const' object",
//       "You can modify the properties of a 'const' object",
//       "A 'const' object is immutable",
//     ],
//     correct: "You can modify the properties of a 'const' object",
//   },
//   {
//     id: 19,
//     question: "Which of the following will produce a 'ReferenceError'?",
//     options: [
//       "Using 'let' before its declaration",
//       "Using 'var' before its declaration",
//       "Using 'const' after its declaration",
//       "Reassigning a variable declared with 'var'",
//     ],
//     correct: "Using 'let' before its declaration",
//   },
//   {
//     id: 20,
//     question:
//       "What is the scope of a variable declared with 'const' inside a block?",
//     options: ["Block-scoped", "Global", "Function-scoped", "Script-scoped"],
//     correct: "Block-scoped",
//   },
// ];

// Data Type
// const quizQuestions = [
//   {
//     id: 1,
//     question: "Which data type represents textual data in JavaScript?",
//     options: ["String", "Number", "Boolean", "Undefined"],
//     correct: "String",
//   },
//   {
//     id: 2,
//     question: "What is the result of the expression 'typeof 42'?",
//     options: ["'number'", "'string'", "'boolean'", "'undefined'"],
//     correct: "'number'",
//   },
//   {
//     id: 3,
//     question: "Which of the following represents a Boolean value?",
//     options: ["true", "'false'", "'yes'", "'0'"],
//     correct: "true",
//   },
//   {
//     id: 4,
//     question: "What is the default value of an uninitialized variable in JavaScript?",
//     options: ["undefined", "null", "0", "NaN"],
//     correct: "undefined",
//   },
//   {
//     id: 5,
//     question: "What is the result of the expression 'typeof null'?",
//     options: ["'object'", "'null'", "'undefined'", "'boolean'"],
//     correct: "'object'",
//   },
//   {
//     id: 6,
//     question: "Which method can be used to find the length of a string?",
//     options: ["length", "size", "count", "getLength"],
//     correct: "length",
//   },
//   {
//     id: 7,
//     question: "Which of the following is NOT a valid number in JavaScript?",
//     options: ["42", "'42'", "NaN", "true"],
//     correct: "true",
//   },
//   {
//     id: 8,
//     question: "What is the output of the following code: \n\n console.log(typeof NaN);",
//     options: ["'number'", "'NaN'", "'undefined'", "'string'"],
//     correct: "'number'",
//   },
//   {
//     id: 9,
//     question: "Which of the following is considered a falsy value in JavaScript?",
//     options: ["0", "'false'", "'0'", "'null'"],
//     correct: "0",
//   },
//   {
//     id: 10,
//     question: "Which of the following values represents 'no value' or 'nothing'?",
//     options: ["null", "undefined", "NaN", "false"],
//     correct: "null",
//   },
//   {
//     id: 11,
//     question: "What will be the output of 'console.log(typeof \"Hello\")'?",
//     options: ["'string'", "'text'", "'String'", "'object'"],
//     correct: "'string'",
//   },
//   {
//     id: 12,
//     question: "Which of the following values will 'typeof undefinedVariable' return?",
//     options: ["'undefined'", "'null'", "'string'", "'NaN'"],
//     correct: "'undefined'",
//   },
//   {
//     id: 13,
//     question: "What does 'NaN' stand for in JavaScript?",
//     options: ["Not a Number", "Null and Number", "No Any Number", "None of the above"],
//     correct: "Not a Number",
//   },
//   {
//     id: 14,
//     question: "What is the result of 'typeof true'?",
//     options: ["'boolean'", "'true'", "'string'", "'number'"],
//     correct: "'boolean'",
//   },
//   {
//     id: 15,
//     question: "What is the output of 'typeof 3.14'?",
//     options: ["'number'", "'float'", "'decimal'", "'integer'"],
//     correct: "'number'",
//   },
//   {
//     id: 16,
//     question: "Which value represents the absence of any object value?",
//     options: ["null", "undefined", "0", "false"],
//     correct: "null",
//   },
//   {
//     id: 17,
//     question: "What is the output of 'typeof \"42\"'?",
//     options: ["'number'", "'string'", "'boolean'", "'undefined'"],
//     correct: "'string'",
//   },
//   {
//     id: 18,
//     question: "Which of the following is a primitive data type in JavaScript?",
//     options: ["String", "Number", "Boolean", "All of the above"],
//     correct: "All of the above",
//   },
//   {
//     id: 19,
//     question: "Which of the following will result in 'NaN'?",
//     options: [
//       "'Hello' - 2",
//       "'42' - 2",
//       "'42' + 2",
//       "42 * 2",
//     ],
//     correct: "'Hello' - 2",
//   },
//   {
//     id: 20,
//     question: "What will be the output of 'console.log(typeof undefined)'?",
//     options: ["'undefined'", "'null'", "'object'", "'NaN'"],
//     correct: "'undefined'",
//   },
// ];