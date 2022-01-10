// Data structures to be used for calculations done via formula logic

// Node data structure for operators and operands
class Node {
    constructor(start, left = null, right = null) {
        if (typeof start === "number") {
            this.value = start;
            this.operation = null;
        } else {
            this.value = null;
            this.operation = start; 
        }
        this.left = left;
        this.right = right;
    }
};

// Stack data structure
class Stack {
    constructor(startingVals = []) {
        this.elements = [...startingVals];
    }

    peek() {
        return this.isEmpty() ? null : this.elements[this.size() - 1];
    }

    size() {
        return this.elements.length;
    }

    isEmpty() {
        return this.size() === 0;
    }

    pop() {
        return this.isEmpty() ? null : this.elements.pop();
    }

    push(element) {
        this.elements.push(element);
    }

    print() {
        console.log(this.elements);
    }

    toArray() {
        return this.elements;
    }

    empty() {
        this.elements = [];
    }
}

// Queue data structure
class Queue {
    constructor(startingVals = []) {
        this.elements = [...startingVals];
    }

    dequeue() {
        return this.isEmpty() ? null : this.elements.shift();
    }

    enqueue(element) {
        this.elements.push(element);
    }

    length() {
        return this.elements.length;
    }

    isEmpty() {
        return this.length() === 0;
    }

    toArray() {
        return this.elements;
    }
}

// Abstract syntax tree for strings of arithmetic
class AbstractSyntaxTree {
    constructor(elements = null) {
        this.root = null;
        if (elements) {
            this.build(elements);
        }
    }

    // This method builds the abstract syntax tree for arithmetic strings containing 
    // multiplication, division, subtraction, addition, exponents, and parentheses. 
    // It starts by creating the leaves with the greatest depth and working up to the root. 
    // The parameter elements must be an array of odd length and contain numbers and symbols
    // from the following list: +, ÷, ×, −, ˆ, ), or (.
    build(elements) {

        var reducedForAddSub, reducedForExponents, reducedForMultDiv;
        var frontFound = false;
        var reducedForParentheses = [];
        var stackForParentheses = new Stack();
       
        var dequeuedElem, poppedElem;
        var processedParenthesis; 
        var elementsQueue;
        var currentElements = [...elements];
        
        while (currentElements.length > 1) {

            elementsQueue = new Queue(currentElements); 
            processedParenthesis = false;

            while (!elementsQueue.isEmpty()) {
                dequeuedElem = elementsQueue.dequeue();
                //console.log(dequeuedElem);
                stackForParentheses.push(dequeuedElem);
                if (stackForParentheses.peek() === "(") {
                    frontFound = true;
                } else if ((frontFound && stackForParentheses.peek() === ")") || (!processedParenthesis && elementsQueue.isEmpty())) {
                    if (stackForParentheses.peek().toString().match(/[()]/)) {
                        poppedElem = null;
                        reducedForParentheses = [];
    
                        while (poppedElem !== "(") {
                            poppedElem = stackForParentheses.pop();
                            if (!poppedElem.toString().match(/[()]/)) reducedForParentheses.unshift(poppedElem);
                        }
                        processedParenthesis = true; 
                    } else {
                        reducedForParentheses = stackForParentheses.toArray();
                        stackForParentheses.empty();
                    }
    
                    //console.log(reducedForParentheses);
    
                    // Process subsection
                    reducedForExponents = processForOperation("ˆ", reducedForParentheses);
                    //console.log(reducedForExponents);
    
                    reducedForMultDiv = processForOperation("×÷", reducedForExponents);
                    //console.log(reducedForMultDiv);
    
                    reducedForAddSub = processForOperation("+−", reducedForMultDiv);
                    //console.log(reducedForAddSub);
    
                    stackForParentheses.push(reducedForAddSub[0]);
                    //console.log(stackForParentheses.toArray());
    
                    // Reset flag
                    frontFound = false;
                }
    
            }
            
            // Update the current elements
            currentElements = stackForParentheses.toArray();
            //console.log(currentElements);
        }

        this.root = currentElements[0]; // LAST STEP -- assignment of root node 
        

        // Helper function for each round of operation processing
        function processForOperation(operation, array) {
            var leftElem, rightElem, operator;
            var stack = new Stack();
            var queue = new Queue(array);
            const regex = new RegExp("[" + operation + "]");
            //console.log(regex);
            var dequeuedElem, nextDequeuedElem;

            while (!queue.isEmpty()) {
                //console.log(array[i].toString());
                dequeuedElem = queue.dequeue();
                //console.log(dequeuedElem);
                if (dequeuedElem.toString().match(regex)) {
                    //console.log("empty?", !stack.isEmpty());
                    //console.log("peek:", stack.peek());
                    //console.log("check type:", typeof stack.peek());
                    leftElem = (!stack.isEmpty() && typeof stack.peek() !== "object") ? new Node(stack.pop()) : stack.pop();
                    nextDequeuedElem = queue.dequeue();
                    rightElem = typeof nextDequeuedElem !== "object" ? new Node(nextDequeuedElem) : nextDequeuedElem;
                    operator = new Node(dequeuedElem, leftElem, rightElem);
                    stack.push(operator);
                    //stack.print();
                    //console.log(operator);
                } else {
                    stack.push(dequeuedElem);
                }
            }

            return stack.toArray();
        }
    }

    // This method evaluates the result of the arithmetic operations stored 
    // in the abstract syntax tree. 
    calculate(node = this.root) {
        //console.log(this.root.operation, this.root.value)
        if (node === null) {
            return 0;
        }

        if (node.value !== null) {
            return node.value;
        }

        switch (node.operation) {
            case "\u002b": // + 
                return this.calculate(node.left) + this.calculate(node.right);
            case "\u2212": // −
                return this.calculate(node.left) - this.calculate(node.right);
            case "\u00d7": // ×
                return this.calculate(node.left) * this.calculate(node.right);
            case "\u00f7": // ÷
                return this.calculate(node.left) / this.calculate(node.right);
            case "\u02C6": // ˆ
                return this.calculate(node.left) ** this.calculate(node.right);
        }
    }

    // This method constructs an array of values that is used to create a 
    // visual representation of the abstract syntax tree.
    toPrintArray() {
        if (this.root === null) {
            return [];
        }

        var listToPrint = [];
        var elementToProcess, firstToAdd, secondToAdd;
        var index = 0;
        var currentHeight = 1;
        var currentRow = 0;
        const totalHeight = this.height();

        listToPrint.push(this.root);

        while(currentHeight <= totalHeight) {
            currentRow += 2 ** (currentHeight - 1);
            while (index < currentRow) {
                elementToProcess = listToPrint[index];
                //console.log(elementToProcess);
                if (elementToProcess != null) listToPrint[index] = elementToProcess.value || elementToProcess.operation || 0;
                if (currentHeight < totalHeight) {
                    firstToAdd = elementToProcess ? elementToProcess.left : null;
                    secondToAdd = elementToProcess ? elementToProcess.right : null;
                    listToPrint.push(firstToAdd);
                    listToPrint.push(secondToAdd);
                }
                index++;
            }
            currentHeight++;
            //console.log(listToPrint);
        }

        return listToPrint;
    }

    // This method calculates the height of the abstract syntax tree. 
    height(node = this.root) {
        if (node == null) {
            return 0;
        } else {
            return Math.max(this.height(node.left), this.height(node.right)) + 1;
        }
    }

    // This method calculates the amount of nodes of the abstract syntax tree 
    // if it were a full and complete tree or if every node had two children. 
    // The method calls the height() method. 
    fullNodeCount() {
        var height = this.height();
        var width = 0;
        
        for (let i = 0; i < height; i++) {
            width += 2 ** i;
        }

        return width;
    }

    // This method prints out the contents of the array returned by the 
    // toPrintArray() method. 
    print() {

        const array = this.toPrintArray();
        //console.log(array);
        var totalHeight = this.height();

        // Find the longest string of the array
        var longestString = array.reduce((accumulator, current) => {
            const accLen = accumulator;
            const currLen = current ? current.toString().length : 0;
            //console.log(`longest: ${accLen} ${current}: ${currLen}`);
            return accLen > currLen ? accLen : currLen;
        });

        // Make sure longestString is an even number
        longestString = longestString % 2 === 0 ? longestString : longestString += 1;
        //console.log(longestString);

        var base = (2 ** (totalHeight - 1) * (longestString + 2) - 1); // change the value added to longestString to scale
        //console.log(base);

        var index = 0;
        var currentHeight = 1;
        var currentRow = 0;
        var printable = "abstract syntax tree:\n\n";
        var whiteSpaceCount = 0;
        var operandOrOperation;
        var firstIteration = false;

        while(currentHeight <= totalHeight) {
            currentRow += 2 ** (currentHeight - 1);
            while (index < currentRow) {
                // Make sure the first white space on each line is half that
                // of the white space between each operation or operand on that line
                if (!firstIteration) whiteSpaceCount = Math.floor(base / 2);
                else whiteSpaceCount = base;

                // Set the flag to true after the first operation of each row
                firstIteration = true;

                // Determine if the space on the tree is empty or full 
                // An empty space is denoted by a null value in the array returned from toPrintArray()
                operandOrOperation = array[index] !== null ? array[index].toString() : " ";
                //console.log(whiteSpaceCount, operandOrOperation.length);

                // Update white space taking into account the length of the value to be added
                whiteSpaceCount -= (operandOrOperation.length - 1); 
                //console.log(whiteSpaceCount);

                // Make sure the white space count is not negative
                if (whiteSpaceCount < 0) whiteSpaceCount = 0;

                // Add to the printable string and update the index
                printable += " ".repeat(whiteSpaceCount) + operandOrOperation;
                index++;
            }

            // Update the spacing for the next row, the current level of the loop, and
            // the printable string being accumulated; reset the first iteration flag
            base = Math.floor(base / 2);
            firstIteration = false; 
            printable += "\n\n";
            currentHeight++;
            //console.log(listToPrint);
        }

        printable += "\n";

        // Print the final string to the console
        console.log(printable);

    }
}

// Event listener assignments of the HTML document
document.addEventListener("DOMContentLoaded", function() {

    // Add classes to div groups for styles (to be toggled)
    var topPad = document.querySelectorAll("#clear, #delete, #front-parenthesis, #back-parenthesis, #answer");
    topPad.forEach(x => x.classList.add("inactive-top"));
    var rightPad = document.querySelectorAll(".operator, #exponent, #equals");
    rightPad.forEach(x => x.classList.add("inactive-right"));
    var mainPad = document.querySelectorAll(".number, #decimal");
    mainPad.forEach(x => x.classList.add("inactive-main"));

    var lastVal; // to keep track a previously calculated value
    
    const operatorsToChooseFrom = "+÷×−"; // the subtraction symbol used in the calculator is slightly longer than -
    const fourOperatorsRegex = new RegExp("[" + operatorsToChooseFrom + "]");

    // Define regex expressions for parsing complex strings 
    const numberRegex = /(((?<=\D)−)?|(^[−-]))[.]?\d+[.]?\d*/g;
    const operatorRegex = /(?<![(])[+÷×ˆ](?=[(]?[−]?\d?[.]?\d+)|[−](?=[(]?[−][.]?\d)|(?<=\d[)]?)[−^](?=[(]?[.]?\d)/g;
    const parenthesesRegex = /[()]/g;
    const completeRegex = new RegExp(numberRegex.source + "|" + operatorRegex.source + "|" + parenthesesRegex.source, "g");

    // Global variable that is set to true after a successful completion of the calculate() function
    // The variable is set to false when any other key is entered after the equal sign. 
    var calculateDone = false; 

    // Get DOM elements to be modified
    var numberDivs = document.querySelectorAll(".number");
    var operationDivs = document.querySelectorAll(".operator");
    var display = document.querySelector("#display");  
    var clearDiv = document.getElementById("clear");
    var deleteDiv = document.getElementById("delete");
    var equalsDiv = document.getElementById("equals");
    var decimalDiv = document.getElementById("decimal");
    var answerDiv = document.getElementById("answer");
    var exponentDiv = document.getElementById("exponent");
    var parenthesisFrontDiv = document.getElementById("front-parenthesis");
    var parenthesisBackDiv = document.getElementById("back-parenthesis");
    var parenthesesDivs = [parenthesisFrontDiv, parenthesisBackDiv];

    // Show all clicked divs - serves as a type of middleware for debugging
    var allDivs = document.querySelectorAll(".number, .operator, #clear, #equals, #decimal");
    
    // To see the names of all divs activated, uncomment the following line 
    // allDivs.forEach(x => x.addEventListener('click', printDivID));
    
    // Function for debugging
    function printDivID(e) {
        //console.log("lastVal:", lastVal);
        console.log("calculate done?", calculateDone);
        console.log("display:", display.innerHTML);
        console.log("");
        if (this.innerHTML) console.log("clicked on", this.innerHTML);
        if (e.type === "keydown") console.log("pressed key", e.key); 
    }

    // Add keydown events to document
    document.addEventListener('keydown', (e) => {
        //console.log(e);
        if (e.key.match(/\d/)) addNumber(e);
        else if (e.key.match(/[*+/-]/)) addOperator(e); 
        else if (e.key == ".") addDecimal();
        else if (e.key == "^") addExponent();
        else if (e.key == "(" || e.key == ")") addParenthesis(e);
        else if (e.key == "a") showLastAnswer();
        else if (e.key == "ArrowLeft" || e.key == "Backspace") deleteLast();
        else if (e.shiftKey && e.code === "KeyC") clearAll();
        else if (e.key == "=" || e.key == "Enter") calculate();
        
        // To see the names of all divs activated, uncomment the following line 
        // if (e.key.match(/[0-9*+/a()^-]/) || (e.shiftKey && e.code === "KeyC")) printDivID(e);
    });

    /*============================
       --- Add event listeners to divs with the class "number."
       --- Don't allow the user to add 0's before a number.
    ==============================*/
    numberDivs.forEach(x => x.addEventListener("click", addNumber));

    function addNumber(e) {

        // Apply styles 
        const divNames = ['zero', 'one', 'two', 'three', 'four', 'five',
                          'six', 'seven', 'eight', 'nine']

        var divToStyle = e.type === "click" ? this : document.getElementById(divNames[parseInt(e.key)]);

        divActiveStyles(divToStyle, "active-main", "inactive-main");

        // Parse display text
        var numbers = display.innerHTML.split(/[()ˆ+÷×−]/g);
        const displayLastParsed = numbers[numbers.length - 1];
        const displayLast = display.innerHTML[display.innerHTML.length - 1];
        //console.log("numbers:", numbers);
        //console.log("display last:", displayLast);
        //console.log("display last parsed:", displayLastParsed);

        // Determine value to add
        var valueToAdd = e.type === "keydown" ? e.key : this.innerHTML;
        //console.log("value to add:", valueToAdd);

        // Limit the user from inserting a 0 if 
        // (1) the display has a 0 in it
        // (2) the last parsed value (no operators) is equivalent to 0: "0" or "0."
        // (3) the last parsed value (no operators) is a lone decimal "."
        // (4) the last value of the display is not an operator
        if (valueToAdd == 0 && display.innerHTML != 0 && displayLastParsed == 0 && !displayLastParsed.match(/[.]/g) && !displayLast.match(/[()ˆ+÷×−]/g)) return;


        /*if (calculateDone) {
            display.innerHTML = "0";
            calculateDone = false; 
        }*/

        /* if (display.innerHTML == lastVal) { // display.innerHTML === valueToAdd
            display.innerHTML = valueToAdd;   
        } */
        
        if (calculateDone) {
            display.innerHTML = valueToAdd;
            calculateDone = false;
        } else if (display.innerHTML === "0") {
            display.innerHTML = valueToAdd;
        } else {
            display.innerHTML += valueToAdd;
        }

    }

    /*============================
       --- Add event listeners to the div with the id "decimal"
       --- Don't add a decimal if the last number has a decimal in it already. 
    ==============================*/
    decimalDiv.addEventListener("click", addDecimal);

    function addDecimal() {    
        // Apply styles
        divActiveStyles(decimalDiv, "active-main", "inactive-main");

        // Guard statement
        var numbers = display.innerHTML.split(/[()ˆ+÷×−]/g);
        const displayLast = numbers[numbers.length - 1];
        const decimalMatch = displayLast.match(/[.]/g);
        //console.log("numbers:", numbers);
        //console.log("display last:", displayLast);
        //console.log("decimal match:", decimalMatch);
        if (display.innerHTML != lastVal && decimalMatch) return;

        // Add the decimal point or a 0 and a decimal point
        // Change flag if its the first value input after pressing enter
        if (calculateDone) { // display.innerHTML == lastVal
            display.innerHTML = "0."
            calculateDone = false;
        }
        else {
            display.innerHTML += ".";
        }
    }
    
    /*============================
       --- Add event listeners to divs with ids "clear," "delete," and "answer."
       --- The default "empty" display value is 0.
    ==============================*/
    clearDiv.addEventListener("click", clearAll);
    
    function clearAll() {
        // Apply styles
        divActiveStyles(clearDiv, "active-top", "inactive-top");

        // Exit if the display is the string "0"
        if (display.innerHTML === "0") return;
        
        // Change the display to 0 if this statement is reached
        display.innerHTML = 0;
    }

    deleteDiv.addEventListener("click", deleteLast);
    
    function deleteLast() {
        // Apply Styles
        divActiveStyles(deleteDiv, "active-top", "inactive-top");

        // Exit if the display is the string 0
        if (display.innerHTML === "0") return;

        // Change the text if the display is not the string "0"
        display.innerHTML = display.innerHTML.slice(0, display.innerHTML.length - 1)
    }

    answerDiv.addEventListener("click", showLastAnswer);

    function showLastAnswer() {
        // Apply styles
        divActiveStyles(answerDiv, "active-top", "inactive-top");
        
        // Exit if there's not lastVal or the lastVal is in the display
        if (!lastVal) return;
        
        // Set the calculateDone flag
        if (calculateDone) {
            calculateDone = false;
        } 

        // Change the display text if reached
        if (display.innerHTML == 0 || display.innerHTML === lastVal.toString()) display.innerHTML = lastVal; 
        else display.innerHTML += lastVal;
    }

    /*============================
       --- Add event listeners to divs with ids "font-parenthesis" and "back-parenthesis."
       --- Makes sure that ) can only be added if there are is a corresponding ( available. 
    ==============================*/

    parenthesesDivs.forEach(x => x.addEventListener("click", addParenthesis));

    function addParenthesis(e) {
        // Apply styles
        var divToStyle = e.type === "click" ? this : e.key === "(" ? parenthesisFrontDiv : parenthesisBackDiv;
        divActiveStyles(divToStyle, "active-top", "inactive-top");

        // Determine how to add the parenthesis
        var valueToAdd; 
        if (this.id === "front-parenthesis" || e.key === "(") valueToAdd = "(";
        else if (this.id === "back-parenthesis" || e.key === ")") valueToAdd = ")";
        else valueToAdd = "";

        // Guard statement for the back parenthesis 
        if (valueToAdd === ")" && frontParenthesisCount(display.innerHTML) === 0) return;

        // Set the calculateDone flag
        if (calculateDone) calculateDone = false;

        // Add the parenthesis 
        if (display.innerHTML == 0 || display.innerHTML == lastVal) display.innerHTML = valueToAdd;
        else display.innerHTML += valueToAdd;

    }

    function frontParenthesisCount(array) {
        var stackFrontParentheses = new Stack();
        var valueQueue = new Queue(array);
        var dequeuedVal;

        while (!valueQueue.isEmpty()) {
            dequeuedVal = valueQueue.dequeue();

            if (dequeuedVal === "(") {
                stackFrontParentheses.push(dequeuedVal);
            } 
            if (dequeuedVal === ")") {
                stackFrontParentheses.pop();
            }
        }

        return stackFrontParentheses.size();

    }   

    /*============================
       --- Add event listeners to divs with the class "operator."
       --- Only the subtraction symbol can be added first.
       --- (It's treated as a negative sign when in the first position.)
    ==============================*/
    operationDivs.forEach(x => x.addEventListener("click", addOperator));

    function addOperator(e) {
        // Declare variables
        const displayLen = display.innerHTML.length;
        const displayLast = display.innerHTML[displayLen - 1]; 
        const displaySecondToLast = display.innerHTML[displayLen - 2];
        var valueToAdd;

        // Apply styles 
        const divNames = { '/':'divide', '*':'multiply', '-':'subtract', '+':'add' };
        var divToStyle = e.type === "click" ? this : document.getElementById(divNames[e.key]);
        divActiveStyles(divToStyle, "active-right", "inactive-right"); // apply styles

        // Guard statements
        if (displayLast === "." && displaySecondToLast.match(fourOperatorsRegex)) return;
        if (displayLast === "ˆ") return;
        if (display.innerHTML == 0 && valueToAdd !== "−") return;
        if (display.innerHTML == "−") return;

        // Set the calculateDone flag
        if (calculateDone) calculateDone = false;

        // Determine value to add 
        if (this.id === "add" || e.key === "+") valueToAdd = "+";
        else if (this.id === "subtract" || e.key === "-") valueToAdd = "−";
        else if (this.id === "multiply" || e.key === "*") valueToAdd = "×";
        else if (this.id === "divide" || e.key === "/") valueToAdd = "÷";

        //if (lastVal) display.innerHTML = lastVal;

        if (display.innerHTML == 0) display.innerHTML = valueToAdd;
        else display.innerHTML += valueToAdd; 
    }

    /*============================
       --- Add event listeners to the div with the id "exponent."
       --- Don't allow the user to add an exponent at the beginning,
           after an operator, or after a decimal point preceded only 
           by zero. 
    ==============================*/
    exponentDiv.addEventListener("click", addExponent);

    function addExponent() {
        // Apply styles
        divActiveStyles(exponentDiv, "active-right", "inactive-right");
        
        // Parse the text of the display
        var numbers = display.innerHTML.split(/[+÷×−]/g);
        const displayLastParsed = numbers[numbers.length - 1];
        const displayLast = display.innerHTML[display.innerHTML.length - 1];
        //console.log(numbers, displayLast, displayLastParsed);

        // Guard statements
        if (displayLast.match(fourOperatorsRegex)) return;
        if (displayLastParsed == 0) return;
        if (displayLastParsed == ".") return;
        if (displayLast.match(/[ˆ]/g)) return;
        
        // Set the calculateDone flag
        if (calculateDone) calculateDone = false;

        // Enter a cirumflex into the calculator
        display.innerHTML += "ˆ";
    }

    /*============================
       --- Add event listeners to div with the is "equal."
       --- The caculation involves using the Abstract Syntax Tree and Node data structures provided.
       --- Floating-point rounding errors are accounted for at the end. 
    ==============================*/
    equalsDiv.addEventListener("click", calculate);

    function calculate() {
        var displayText = display.innerHTML;
        
        // Apply styles
        divActiveStyles(equalsDiv, "active-right", "inactive-right");

        // Guard statements
        if (displayText == 0) return;
        if (!displayText.match(/\d.*[+÷×ˆ−].*\d/g)) return;
        if (displayText[displayText.length - 1].match(/[+÷×ˆ−]/)) return;

        console.log("original text:", displayText);

        // Add any missing parentheses at the end
        var displayArray = displayText.split("");

        var leftoverFront = frontParenthesisCount(displayArray);

        while (leftoverFront > 0) {
            displayArray.push(")");
            leftoverFront--;
        }

        displayText = displayArray.join("");

        // Add multiplication wherever a number is next to ) or (
        displayText = displayText.replaceAll(/[)](?=\d)/g, ")×");
        displayText = displayText.replaceAll(/(?<=\d)[(]/g, "×(");

        // Remove any parentheses that don't have anything inside
        displayText = displayText.replaceAll(/[(]{1,}(?=[)])|(?<=[(])[)]{1,}/g, "");

        // Remove parentheses around elements that only have one number inside
        displayText = displayText.replaceAll(/(?<=[(]{1}[÷+×ˆ−]*\d*[÷+×ˆ−]*)[)]|[(](?=[÷+×ˆ−]*\d*[÷+×ˆ−]*[)]{1})/g, "");

        // Print string after processing for parentheses
        console.log("final text:", displayText);

        // Process the display text getting rid of erroneous statements
        var parsedText = displayText.match(completeRegex).map(x => {
            if (x.match(/[()+÷×ˆ−]$/)) {
                return x;
            } else {
                if (x[0] === "\u2212") return parseFloat(`-${x.slice(1)}`);
                else if (!x.match(/[.]/g)) return parseInt(x);
                else return parseFloat(x);
            }
        });

        // Print string after processing for erroneous uses of operators (repetition)
        console.log("final array:", parsedText);

        // Transfer parsedText to an abstract syntax trees and call class methods 
        var tree = new AbstractSyntaxTree(parsedText);

        // Display a visual representation of the tree in the console
        tree.print();

        // Calculate the value of the arithmetic string 
        var calculation = tree.calculate();

        // Make sure rounding errors are eliminated
        calculation = Math.round(calculation * 1000000000000) / 1000000000000; 

        // Display the final calculation in the console
        console.log("final calculation:", calculation);
        
        // Uncomment if prettier formatting for negative numbers is desired
        // Check if the calculated number is negative and adjust the format if so
        /*if (calculation < 0) calculation = "−" + Math.abs(calculation);
        else calculation = calculation.toString();*/

        // Store the answer in the global variable lastVal
        lastVal = calculation; 

        // Set calculateDone flag (to be set back to false after pressing another key)
        calculateDone = true; 

        // Show the result of the calculation in the display
        display.innerHTML = calculation;
    }

    /*============================
       --- Add a style toggle functions, 
           which is called above in several functions.
    ==============================*/

    function divActiveStyles(div, activeStyle, inactiveStyle) {

        div.classList.remove(inactiveStyle);
        div.classList.add(activeStyle);

        
        setTimeout(() => {
            div.classList.add(inactiveStyle);
            div.classList.remove(activeStyle);
        }, 300);
    }

});