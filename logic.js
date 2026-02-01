const operators = ["+", "-", "*", "/", "%", "^"]; // in increasing order of precedence
const debug = false;
let DividedByZero = false;
// Helpers :
function isOperator(c) {
  for (let o of operators) {
    if (c == o) return true;
  }
  return false;
}
function calculate(op1, op2, op) {
  switch (op) {
    case "+":
      return op1 + op2;
    case "-":
      return op1 - op2;
    case "*":
      return op1 * op2;
    case "/":
      if (op2 === 0) {
        DividedByZero = true;
        return 0;
      }
      return op1 / op2;
    case "%":
      return parseInt(op1) % parseInt(op2);
    case "^":
      return Math.pow(op1, op2);
    default:
      return 0;
  }
}

// Parser :
function parse(expression) {
  const parsedList = [];
  let operand = "";
  for (let c of expression) {
    if (c === " ") {
      continue;
    }
    if (isOperator(c)) {
      const firstSymbol = parsedList.length === 0;
      const operatorAfterOperator = operand.length === 0;

      if ((firstSymbol && operatorAfterOperator) || operatorAfterOperator) {
        operand += c;
        continue;
      }

      parsedList.push(Number(operand));
      parsedList.push(c);
      operand = "";
    } else {
      operand += c;
    }
  }
  parsedList.push(Number(operand));
  return parsedList;
}

// Solver:
function compute(parsedList, steps) {
  steps.splice(0);
  steps.push(parsedList.join(""));
  if (debug) console.log(parsedList);
  const precedence = operators.length - 1;
  for (let p = precedence; p >= 0; p--) {
    for (let i = 0; i < parsedList.length; i++) {
      const op = parsedList[i];
      if (op.length === 1 && op === operators[p]) {
        const op1 = parsedList[i - 1];
        const op2 = parsedList[i + 1];
        const result = calculate(op1, op2, op);
        parsedList[i - 1] = result;
        parsedList.splice(i, 2);
        i--;
        if (debug) console.log(parsedList);
        steps.push(
          `[${parsedList.join(" ")}],(${op1} ${op} ${op2} => ${result})`,
        );
      }
    }
  }
  return parseFloat(parsedList[0]);
}

function solve(expression = "") {
  if (debug) console.log("Expresssion :", expression);
  const steps = [];
  const parsedList = parse(expression);
  let data = { result: compute(parsedList, steps), steps: steps };
  if (steps.length === 0) steps.push(parsedList.join(""));
  if (DividedByZero) {
    data.result = "Invalid : Division By Zero";
    data.steps = ["Cannot divide by zero"];
  }
  return data;
}

module.exports = { solve };
