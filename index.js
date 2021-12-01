// Data structures to be used for calculations with formula logic

// Node data structure for operators and operands
function Node(start, left = null, right = null) {
    if (typeof start === "number") {
        this.value = start;
        this.operation = null;
    } else {
        this.value = null;
        this.operation = start; 
    }
    this.left = left;
    this.right = right;
};

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

        var leftElem, rightElem, operator;
        var lastOperatorMD = false;
        var reducedArray1 = [];

        // Iterate through the elements and create leaves for multiplication and division
        for (let i = 1; i < elements.length; i += 2) {
            //console.log(elements[i]);
            if (elements[i].match(/[+÷×−]/)) {
                if (elements[i] == "×" || elements[i] == "÷") {
                    leftElem = typeof reducedArray1[reducedArray1.length - 1] !== "object" ? new Node(elements[i - 1]) : reducedArray1.pop();
                    rightElem = new Node(elements[i + 1]);
                    operator = new Node(elements[i], leftElem, rightElem);
                    reducedArray1.push(operator);
                    lastOperatorMD = true; 
                } else {
                    //console.log(lastOperatorMD);
                    if (!lastOperatorMD) reducedArray1 = reducedArray1.concat(elements.slice(i - 1, i + 1));
                    else reducedArray1.push(elements[i]);

                    if (i === elements.length - 2) reducedArray1.push(elements[i + 1]);

                    lastOperatorMD = false; 
                }
            }
        }

        //console.log(reducedArray1);
        
        // Initialize variable to store the last node created in iterations of the loop below
        var lastNode = null;

        // Iterate throuh the elements and create leaves for addition and subtraction
        for (let i = 0; i < reducedArray1.length; i++) {
            //console.log(reducedArray1[i]);
            if (typeof reducedArray1[i] !== "object" && (reducedArray1[i] === "+" || reducedArray1[i] === "−")) {
                //leftElem = typeof reducedArray1[i - 1] === "number" ? new Node(reducedArray1[i - 1]) : lastNode ? lastNode : reducedArray1[i - 1];
                leftElem = lastNode ? lastNode : typeof reducedArray1[i - 1] === "number" ? new Node(reducedArray1[i - 1]) : reducedArray1[i - 1];
                rightElem = typeof reducedArray1[i + 1] === "number" ? new Node(reducedArray1[i + 1]) : reducedArray1[i + 1];
                lastNode = new Node(reducedArray1[i], leftElem, rightElem);
                //console.log("left:", leftElem);
                //console.log("right:", rightElem);
                //console.log("sum:", lastNode);
                //console.log("last node:", lastNode);
            }        
        }

        if (lastNode) this.root = lastNode;
        else this.root = reducedArray1[0];
        console.log(this.root);
    }

    // This method evaluates the result of the arithmetic operations stored 
    // in the abstract syntax tree. 
    calculate(node = this.root) {
        //console.log(this.root.operation, this.root.value)
        if (node === null) {
            return 0;
        }

        if (node.value) {
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
        }
    }
}

// Event listener assignments of the HTML document
document.addEventListener("DOMContentLoaded", function() {

    var lastVal; // to keep track a previously calculated value
    
    const operatorsToChooseFrom = "+÷×−"; // the subtraction symbol used in the calculator is slightly longer than -
    const fourOperatorsRegex = /[+÷×−]/;

    // Define regex expressions for parsing complex strings 
    const numberRegex = /(((?<=\D)−)?|(^[−]))[.]?\d+[.]?\d*/g;
    const operatorRegex = /[+÷×](?=[−]?\d?[.]?\d+)|[−](?=[−][.]?\d)|(?<=\d)[−](?=[.]?\d)/g;
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

    // Add keydown events to document
    document.addEventListener('keydown', (e) => {
        //console.log(e);
        if (e.key.match(/\d/)) enterNumber(e);
        else if (e.key.match(/[*+/-]/)) addOperator(e);
        else if (e.key == "=" || e.key == "Enter") calculate(); 
        else if (e.key == ".") enterDecimal();
        else if (e.key == "ArrowLeft" || e.key == "Delete") deleteLast();
        else if (e.key == "c") clearAll();
        else if (e.key == "a") showLastAnswer();
    });

    /*============================
       --- Add event listeners to divs with the class "number."
       --- Don't allow the user to add 0's before a number.
    ==============================*/
    numberDivs.forEach(x => x.addEventListener("click", enterNumber));

    function enterNumber(e) {
        var valueToAdd = e.type === "keydown" ? e.key : this.innerHTML;
        //console.log(valueToAdd);

        //var parsedText = display.innerHTML.match(numAndOpRegex);
        //console.log(parsedText);
        const displayLen = display.innerHTML.length;
        //console.log(lastVal);

        if (display.innerHTML == lastVal) display.innerHTML = valueToAdd;
        else if (display.innerHTML[displayLen - 1] == 0) display.innerHTML = display.innerHTML.slice(0, displayLen - 1) + valueToAdd;
        else display.innerHTML += valueToAdd;
    }

    /*============================
       --- Add event listeners to the div with the id "decimal"
       --- Don't add a decimal if the last number has a decimal in it already. 
    ==============================*/
    decimalDiv.addEventListener("click", enterDecimal);

    function enterDecimal() {        
        var numbers = display.innerHTML.split(fourOperatorsRegex);
        const displayLast = numbers[numbers.length - 1];
        const decimalMatch = displayLast.match(/[.]/g);

        //console.log(numbers, displayLast);
        //console.log("decimal match:", decimalMatch)

        if (decimalMatch) return;

        display.innerHTML += ".";
    }
    
    /*============================
       --- Add event listeners to divs with ids "clear," "delete," and "answer."
       --- The default display value is 0.
    ==============================*/
    clearDiv.addEventListener("click", clearAll);
    
    function clearAll() {
        display.innerHTML = 0;
    }

    deleteDiv.addEventListener("click", deleteLast);
    
    function deleteLast() {
        const displayLen = display.innerHTML.length;
        if (displayLen > 1) display.innerHTML = display.innerHTML.slice(0, displayLen - 1)
        else display.innerHTML = 0; 
    }

    answerDiv.addEventListener("click", showLastAnswer);

    function showLastAnswer() {
        if (lastVal) {
            if (display.innerHTML == 0) display.innerHTML = lastVal; 
            else display.innerHTML += lastVal;
        }
    }

    /*============================
       --- Add event listeners to divs with the class "operator."
       --- Only the subtraction symbol can be added first.
       --- (It's treated as a negative sign when in the first position.)
    ==============================*/
    operationDivs.forEach(x => x.addEventListener("click", addOperator));

    function addOperator(e) {
        
        const displayLen = display.innerHTML.length;
        const displayLast = display.innerHTML[displayLen - 1]; 
        const displaySecondToLast = display.innerHTML[displayLen - 2];
        var valueToAdd;

        if (this.id === "add" || e.key === "+") valueToAdd = "+";
        else if (this.id === "subtract" || e.key === "-") valueToAdd = "−";
        else if (this.id === "multiply" || e.key === "*") valueToAdd = "×";
        else if (this.id === "divide" || e.key === "/") valueToAdd = "÷";

        // Guard statements
        if (displayLast === "." && displaySecondToLast.match(fourOperatorsRegex)) return;
        if (display.innerHTML == 0 && valueToAdd !== "−") return;
        if (display.innerHTML == "−") return;

        //if (lastVal) display.innerHTML = lastVal;

        if (display.innerHTML == 0) display.innerHTML = valueToAdd;
        else display.innerHTML += valueToAdd; 
    }

    /*============================
       --- Add event listeners to div with the is "equal."
       --- The caculation involves using the Abstract Syntax Tree and Node data structures provided.
       --- Floating-point rounding errors are accounted for at the end. 
    ==============================*/
    equalsDiv.addEventListener("click", calculate);

    function calculate() {
        if (operatorsToChooseFrom.includes(display.innerHTML[display.innerHTML.length - 1])) {
            return;
        }

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

        console.log(calculation);

        // Make sure rounding errors are eliminated
        calculation = Math.round(calculation * 1000000000000) / 1000000000000; 
        
        // Check if the calculated number is negative and adjust the format if so
        if (calculation < 0) calculation = "−" + Math.abs(calculation);
        else calculation = calculation.toString();

        // Store the answer in the global variable lastVal
        lastVal = calculation; 

        // Show the result of the calculation in the display
        display.innerHTML = calculation;
    }

});