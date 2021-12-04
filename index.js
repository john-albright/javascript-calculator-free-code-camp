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
        return this.isEmpty() ? null : this.elements[this.length() - 1];
    }

    length() {
        return this.elements.length;
    }

    isEmpty() {
        return this.elements.length === 0;
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
        return this.elements.length === 0;
    }

    toArray() {
        return this.elements;
    }
}

// Abstract syntax tree for strings of arithmetic
class AbstractSyntaxTree {
    constructor() {
        this.root = null;
    }

    // This method builds the abstract syntax tree for arithmetic strings containing 
    // multiplication, division, subtraction, and addition. 
    // It starts by creating the leaves with the greatest depth and working up to the root. 
    // The parameter elements must be an array of odd length
    // - even-numbered indices (e.g. 0, 2, 4) must contain values of type number (parsed as floats or ints)
    //   which will serve as the operands
    // - odd-numbered indices (e.g. 1, 3, 5) must contain an operator from the following list: +, ÷, ×, or −
    // example: [ 8.8, "−", 5.5, "×", 9, "÷", 50, "+", 3 ]
    build(elements) {

        var reducedForExponents = processForOperation("ˆ", elements);
        //console.log(reducedForExponents);

        var reducedForMultDiv = processForOperation("×÷", reducedForExponents);
        //console.log(reducedForMultDiv);

        var reducedForAddSub = processForOperation("+−", reducedForMultDiv);
        //console.log(reducedForAddSub);

        this.root = reducedForAddSub[0];

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
    const fourOperatorsRegex = /[+÷×−]/;

    // Define regex expressions for parsing complex strings 
    const numberRegex = /(((?<=\D)−)?|(^[−-]))[.]?\d+[.]?\d*/g;
    const operatorRegex = /[+÷×ˆ](?=[−]?\d?[.]?\d+)|[−](?=[−][.]?\d)|(?<=\d)[−](?=[.]?\d)/g;
    const numAndOpRegex = /((((?<=\D)−)?|(^[−]))[.]?\d+[.]?\d*)|([+÷×](?=[−]?\d?[.]?\d+)|[−](?=[−]\d)|(?<=\d)[−](?=[.]?\d))/g;

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

    // Add keydown events to document
    document.addEventListener('keydown', (e) => {
        //console.log(e);
        if (e.key.match(/\d/)) addNumber(e);
        else if (e.key.match(/[*+/-]/)) addOperator(e);
        else if (e.key == "=" || e.key == "Enter") calculate(); 
        else if (e.key == ".") addDecimal();
        else if (e.key == "ArrowLeft" || e.key == "Backspace") deleteLast();
        else if (e.key == "c") clearAll();
        else if (e.key == "a") showLastAnswer();
        else if (e.key == "^") addExponent();
        else if (e.key == "(" || e.key == ")") addParenthesis(e);
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

        // Guard statements
        var numbers = display.innerHTML.split(fourOperatorsRegex);
        const displayLastParsed = numbers[numbers.length - 1];
        const displayLast = display.innerHTML[display.innerHTML.length - 1];
        //console.log(numbers, displayLast, displayLastParsed);

        if (display.innerHTML !== "0" && displayLastParsed == 0 && !displayLastParsed.match(/[.]/g) && !displayLast.match(fourOperatorsRegex)) return;

        // Determine value to add
        var valueToAdd = e.type === "keydown" ? e.key : this.innerHTML;
        //console.log(valueToAdd);


        if (display.innerHTML == lastVal && valueToAdd == lastVal) display.innerHTML = valueToAdd;
        else if (display.innerHTML === "0") display.innerHTML = valueToAdd;
        //else if (display.innerHTML[displayLen - 1] == 0) display.innerHTML = display.innerHTML.slice(0, displayLen - 1) + valueToAdd;
        else display.innerHTML += valueToAdd;

    }

    /*============================
       --- Add event listeners to the div with the id "decimal"
       --- Don't add a decimal if the last number has a decimal in it already. 
    ==============================*/
    decimalDiv.addEventListener("click", addDecimal);

    function addDecimal() {    
        // Apply styles
        divActiveStyles(decimalDiv, "active-main", "inactive-main");
        
        // Guard statements
        var numbers = display.innerHTML.split(fourOperatorsRegex);
        const displayLast = numbers[numbers.length - 1];
        const decimalMatch = displayLast.match(/[.]/g);
        //console.log(numbers, displayLast);
        //console.log("decimal match:", decimalMatch)

        if (decimalMatch) return;

        // Add the decimal point if passes tests
        display.innerHTML += "."; // change display text
    }
    
    /*============================
       --- Add event listeners to divs with ids "clear," "delete," "answer," and "parenthesis."
       --- The default "empty" display value is 0.
    ==============================*/
    clearDiv.addEventListener("click", clearAll);
    
    function clearAll() {
        divActiveStyles(clearDiv, "active-top", "inactive-top"); // apply styles

        display.innerHTML = 0; // change display text
    }

    deleteDiv.addEventListener("click", deleteLast);
    
    function deleteLast() {
        divActiveStyles(deleteDiv, "active-top", "inactive-top"); // apply styles

        const displayLen = display.innerHTML.length;
        if (displayLen > 1) display.innerHTML = display.innerHTML.slice(0, displayLen - 1)
        else display.innerHTML = 0; 
    }

    answerDiv.addEventListener("click", showLastAnswer);

    function showLastAnswer() {
        divActiveStyles(answerDiv, "active-top", "inactive-top"); // apply styles
        
        if (lastVal) {
            if (display.innerHTML == 0) display.innerHTML = lastVal; 
            else display.innerHTML += lastVal;
        }
    }

    parenthesesDivs.forEach(x => x.addEventListener("click", addParenthesis));

    function addParenthesis(e) {
        // Apply styles
        var divToStyle = e.type === "click" ? this : e.key === "(" ? parenthesisFrontDiv : parenthesisBackDiv;
        divActiveStyles(divToStyle, "active-top", "inactive-top");
        
        // Guard statements
        var numbers = display.innerHTML.split(fourOperatorsRegex);
        const displayLastParsed = numbers[numbers.length - 1];
        const displayLast = display.innerHTML[display.innerHTML.length - 1];
        console.log(numbers, displayLast);
        
        if (!displayLast.match(fourOperatorsRegex) && displayLastParsed == 0 && numbers.length != 1) return;

        // Determine how to add the parenthesis
        var valueToAdd; 
        if (this.id === "front-parenthesis" || e.key === "(") valueToAdd = "(";
        else if (this.id === "back-parenthesis" || e.key === ")") valueToAdd = ")";
        else valueToAdd = "";

        // Add the parenthesis 
        if (display.innerHTML == 0) display.innerHTML = valueToAdd;
        else display.innerHTML += valueToAdd;

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
        if (display.innerHTML == 0 && valueToAdd !== "−") return;
        if (display.innerHTML == "−") return;
        
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
        
        // Guard statements
        var numbers = display.innerHTML.split(fourOperatorsRegex);
        const displayLastParsed = numbers[numbers.length - 1];
        const displayLast = display.innerHTML[display.innerHTML.length - 1];
        console.log(numbers, displayLast);

        if (displayLast.match(fourOperatorsRegex)) return;
        if (displayLastParsed == 0 && displayLastParsed.match(/./g)) return;
        
        display.innerHTML += "ˆ";
    }

    /*============================
       --- Add event listeners to div with the is "equal."
       --- The caculation involves using the Abstract Syntax Tree and Node data structures provided.
       --- Floating-point rounding errors are accounted for at the end. 
    ==============================*/
    equalsDiv.addEventListener("click", calculate);

    function calculate() {
        divActiveStyles(equalsDiv, "active-right", "inactive-right"); // apply styles

        if (display.innerHTML == 0) return;
        if (!display.innerHTML.match(/[+÷×−ˆ]/g)) return;
        if (operatorsToChooseFrom.includes(display.innerHTML[display.innerHTML.length - 1])) return;

        var numbers = display.innerHTML.match(numberRegex).map((x) => {
            if (x[0] === "\u2212") return parseFloat(`-${x.slice(1)}`);
            else if (!x.match(/[.]/)) return parseInt(x);
            else return parseFloat(x);
        });

        var operators = display.innerHTML.match(operatorRegex);

        console.log(numbers, operators);

        var parsedText = [];
        const totalLen = operators.length + numbers.length;

        for (let i = 0; i < totalLen; i++) {
            if (i % 2 === 0) parsedText.push(numbers.shift());
            else parsedText.push(operators.shift());
        }

        console.log(parsedText);

        // Transfer parsedText to an abstract syntax trees and call class methods 
        var tree = new AbstractSyntaxTree();
        tree.build(parsedText);

        var calculation = tree.calculate();

        console.log("final calculation:", calculation);

        // Make sure rounding errors are eliminated
        calculation = Math.round(calculation * 1000000000000) / 1000000000000; 
        
        // Check if the calculated number is negative and adjust the format if so
        /*if (calculation < 0) calculation = "−" + Math.abs(calculation);
        else calculation = calculation.toString();*/

        // Store the answer in the global variable lastVal
        lastVal = calculation; 

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
            div.classList.remove(activeStyle);
            div.classList.add(inactiveStyle);
        }, 500);
    }

});