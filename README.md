# JavaScript Calculator

This project is the fourth of five projects completed for FreeCodeCamp's third certificate: [Front End Libraries](https://www.freecodecamp.org/learn/front-end-development-libraries). The project was created using vanilla JavaScript.

The calculator uses formula/expression logic to calculate strings with arithmetic expressions. In other words, it evaluates expressions using order of operations, e.g. BODMAS or PEMDAS. The user is limited to use the buttons provided, which are also linked to keys on the keyboard. See the table below for the keyboard/click equivalencies. 

| div name |  key  |        action         |
| -------- |  ---  | --------------------- |
|   one    |   1   | adds 1 to the display |
|   two    |   2   | adds 2 to the display |
|  three   |   3   | adds 3 to the display |
|   four   |   4   | adds 4 to the display |
|   five   |   5   | adds 5 to the display |
|    six   |   6   | adds 6 to the display |
|   seven  |   7   | adds 7 to the display |
|   eight  |   8   | adds 8 to the display |
|    nine  |   9   | adds 9 to the display |
|    zero  |   0   | adds 0 to the display |
|  decimal |   .   | adds . to the display |
|  delete  |   Backspace, ArrowLeft   | deletes the last element from the display |
|   clear  |  Shift + c   | resets the display to show zero |
|  answer  |   a   | adds the last calculated value to the display |
|   add    |   +   | adds + to the display |
| subtract |   -   | adds − to the display |
| multiply |   *   | adds × to the display |
|  divide  |   /   | adds ÷ to the display |
| exponent | ^ | adds ˆ to the display |
| front-parenthesis | ( | adds ( to the display |
| back-parenthesis | ) | adds ) to the display |
|  equals  |   Enter, =   | processes the arithmetic expression in the display and stores the result in ANS 

The data structures (and methods) used in this program are shown in the following list:
- Node
- Stack: peek(), size(), isEmpty(), pop(), push(), print(), toArray(), empty()
- Queue: dequeue(), enqueue(), length(), isEmpty(), toArray()
- Abstract Syntax Tree: build(), calculate(), toPrintArray(), height(), fullNodeCount(), print()

The following is a list of all event listeners added to the document:
- addNumber(): leading zeros cannot be input, i.e. 00050.2 cannot be input 
- addOperator(): only the subtraction sign can be added at the beginning of an entry; all operators can be added anywhere except after an exponent or lone decimal.
- addDecimal(): a decimal can be placed at the start, middle, or end of a number but is not allowed to appear twice in the same number.
- addExponent(): an exponent can only be added after a number other than 0.
- addParenthesis(): a parenthesis can be added anywhere except a right parenthesis; a right parenthesis is only allowed if there are enough left parentheses.
- showLastAnswer(): the last calculated value is shown (if available); it's stored in a global variable called lastVal.
- deleteLast(): this works like a backspace and allows the user to erase the last value input.
- clearAll(): this clears all values from the display div and resets its value to 0.  
- calculate(): this calculates the result of the expression entered into the display. 

The calculate() event listener function relies on an abstract syntax tree class method by the same name. This tree is built with the node class, which has been slightly altered to have a poperty of either operator or value (i.e. operand, number). The node class is built to make sure that a node has one or the other (a value OR an operand) but not both. The build() class method is automatically triggered if an abstract syntax tree is instantiated with an array of valid operands and operators, i.e. a number like -92.34 or 6 and any operator from the following list:
- &#43; (unicode: U+002b)
- &#8722; (unicode: U+2212) (not the same as the minus sign - unicode U+002d)
- × (unicode: U+00d7)
- ÷ (unicode: U+00f7)
- ˆ (unicode: U+02C6) (not the same as the circumflex - unicode U+005e)
- ( (unicode: U+0028)
- ) (unicode: U+0029)

The calculator can process strings with chains of operators and numbers by using complex regex expressions. The final operator in the chain between one operand and the subsequent will be the one chosen for processing. However, a subtraction symbol before any number will be interpreted as a negative sign. Upon hitting the equals sign, the text in the display div will be printed to the console as well as a version with erroneous uses of parentheses extracted (with a few regex statements and replaceAll() calls to the string). The final version of the display div text is shown in an array that has been parsed with regex expressions weeding out chains or operators and processing subtraction signs before numbers as minus signs. 

An instance of the abstract syntax tree (AST) data structure is then made with the array of elements mentioned above. The build() method of the data structure uses queues and stacks to process the parentheses in the correct order, each time processing the exponents, then multiplcation and division, and finally subtraction and addition. The leaves of the tree are created first. The final node created is the root and is assigned to the root of that instantiation. The print() method of the AST is then called so that if the user would like to see a visual representation of the tree, he or she can refer to the console. The calculate() method is then called recursively to process the expression from the leaves to the root. The result is shown in the display div as well as in the console. This result is stored in the answer key. 