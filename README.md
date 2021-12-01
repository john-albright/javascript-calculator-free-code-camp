# JavaScript Calculator

This project is the fourth of five projects completed for FreeCodeCamp's third certificate: [Front End Libraries](https://www.freecodecamp.org/learn/front-end-development-libraries). The project was created using vanilla JavaScript.

The calculator uses formula/expression logic to calculate strings with arithmetic expressions. In other words, it evaluates expressions using order of operations, e.g. BODMAS or PEMDAS. No support for parentheses or exponents is provided, and the user is limited to use the buttons provided. The buttons are also linked to keys on the keyboard. See the table below for the equivalencies. 

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
|  delete  |   Delete, ArrowLeft   | deletes the last element from the display |
|   clear  |   c   | resets the display to show zero |
|  answer  |   a   | adds the last calculated value to the display |
|   add    |   +   | adds an addition sign to the display |
| subtract |   -   | adds a negative sign to the display |
| multiply |   *   | adds a multiplication sign to the display |
|  divide  |   /   | adds a division sign to the display |
|  equals  |   Enter, =   | processes the arithmetic expression in the display and stores the result in ANS |

The calculate() function relies on a class function by the same name of an abstract syntax tree data structure. This tree relies on a node class that has been slightly altered to have either a poperty of either operator or value (i.e. operand, number). The node class is built to make sure that a node has one or the other but not both. 

The calculator can process strings with chains of operators and numbers by using complex regex expressions. The final operator in the chain between one operand and the subsequent will be the one chosen for processing. However, a subtraction symbol before any number will be interpreted as a negative sign. 