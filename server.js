const { solve } = require("./logic.js");
const { createServer } = require("node:http");
const port = process.env.PORT || 9999;
const server = createServer((req, res) => {
  let expression = req.url.split("?")[1];
  console.log("Exp : ", expression);
  let result = "";
  let steps = "";
  if (!expression) {
    expression = "Expression not found";
    result = "!!!";
    steps =
      "Please Enter a valid expression in the url<br>example : http://url.com/?1+1 <br>expression comes right after a ?";
  } else {
    let { result: r, steps: s } = solve(expression);
    result = r.toString().replace("NaN", "Invalid");
    steps = s.join("<br>").replaceAll("NaN", "Invalid");
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(getHTML(`${expression} = ${result}`, steps));

  res.end();
});
server.listen(port);

function getHTML(msg1, msg2) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Expression</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: monospace;
      }
      body {
        background: linear-gradient(60deg, white 60%, black 40%);
      }
      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      h1 {
        text-align: right;
        font-size: 3em;
        margin: 2em auto;
        background-color: white;
        padding-right: 6px;
      }
      pre {
        display: block;
        margin: 2em auto;
        text-align: center;
        background-color: #060407;
        color: white;
        padding: 1em;
        font-size: 2em;
        width: 90%;
        line-height: 1.2em;
        overflow: auto;
      }
      @media (max-width: 600px) {
        pre {
          font-size: 1.5em;
          text-align: left;
          width: 95%;
        }
      }
    </style>
  </head>
  <body>
    <h1>Expression</h1>
    <div id="result">
      <pre>${msg1}</pre>
      <pre>Steps<br>${msg2}</pre>
  </pre>
    </div>
  </body>
</html>

    `;
}
