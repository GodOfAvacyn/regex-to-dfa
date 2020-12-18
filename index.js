const {LAMBDA, makeNfaPiece, addCharToNames, or, concat, kleeneConcat, orLambda, nfaToDfa, minimize} = require('./utils.js');

const Nfa = require('./Nfa.js');
const Dfa = require('./Dfa.js');
const {GRAMMAR, SEMANTICS} = require('./Grammar.js');

/**
 * Creates an HTML table on the right side of the screen.
 * @param dfa Dfa object to generate the table with.
 */
const createDfaTable = (dfa) => {
	let body = document.getElementsByTagName("body")[0];

	let tbl = document.createElement("table");
	let tblBody = document.createElement("tbody");

	let header = document.createElement("tr");
	let cellNames = ["STATE:", "0:", "1:", "ACCEPTS:"];

	for (let cellName of cellNames) {
		let cell = document.createElement("th");
		let cellText = document.createTextNode(cellName);
		cell.appendChild(cellText);
		header.appendChild(cell);
	}
	tblBody.appendChild(header);

	let states = Object.keys(dfa.transitions);
	for (let state of states) {

		let row = document.createElement("tr");

			for (let i = 0; i < 4; i++) {
				let cell = document.createElement("td");
				cell.style = "min-width:40px; text-align: center";
				let cellText;

				if (i==0)      {cellText = document.createTextNode(state);}
				else if (i==1) {cellText = document.createTextNode(dfa.transitions[state][0]);}
				else if (i==2) {cellText = document.createTextNode(dfa.transitions[state][1]);}
				else           {cellText = document.createTextNode(dfa.acceptStates.includes(state));}

				cell.appendChild(cellText);
				row.appendChild(cell);
			}
		tblBody.appendChild(row);
	}
	tbl.appendChild(tblBody);
	tbl.setAttribute("border", "4");
	tbl.id = "dfaTable";
	tbl.style.position = "absolute";
	tbl.style.top = "10%";
	tbl.style.right = "15%";
	body.appendChild(tbl);
}

/**
 * Makes an input box that takes in strings.
 * @param dfa Dfa object to be later passed into checkInput.
 */
const makeInputBox = (dfa) => {
	let body = document.getElementsByTagName("body")[0];

	let div = document.createElement("div");
	let text = document.createTextNode( "Try entering some strings to see if your language accepts them:" )
	div.id = "inputBox";
	div.style = "position: relative; left: 13px; top: 198px";
	div.append(text);


	let form = document.createElement("form");
	form.id = "secondInput";
	form.action = "#";
	form.onsubmit = "return false";


	let textInput   = document.createElement("input");
	textInput.style = "position:absolute;top:61%;left:2.2%;width:15%";
	textInput.type  = "text";
	textInput.id    = "word";
	textInput.value = "";

	let submitInput   = document.createElement("input");
	submitInput.style = "position:absolute;top:61%;left:18.2%";
	submitInput.name  = "submit";
	submitInput.type  = "submit";
	submitInput.value = "submit";

	form.appendChild(textInput);
	form.appendChild(submitInput);
	form.addEventListener( "submit", function() {checkInput(dfa)} )

	body.appendChild(div);
	body.appendChild(form);

}

/**
 * Checks user input to see if a given DFA will accept it.
 * @param dfa Dfa object to check.
 */
const checkInput = (dfa) => {
	let previous = document.getElementById("acceptOrNot");
	if (previous != null) {previous.remove();}

	let body = document.getElementsByTagName("body")[0];
	let word = document.getElementById("word").value;

	let div = document.createElement("div");
	div.id = "acceptOrNot";

	console.log(word);

	let accepted = dfa.accepts(word);
	let message;
	
	if (accepted) { 
		message = document.createTextNode("Accepted!");
		div.style = "position:relative;top:250px;left:13px;width:65px";
	} else { 
		message = document.createTextNode("Not Accepted!");
		div.style = "position:relative;top:250px;left:13px;width:100px";
	}

	div.appendChild(message);
	body.appendChild(div);
}

/**
 * Creates an error text box at the bottom of the screen, should anything go wrong.
 */
const throwError = () => {
	let body = document.getElementsByTagName("body")[0];
	let div = document.createElement("div");
	div.id = "error";
	div.style = "position: relative; left: 13px; top: 198px";
	let text = document.createTextNode("Oops! Looks like you didn't enter a valid regular expression. Try again.");
	div.appendChild(text);
	body.appendChild(div);
}

/**
 * Main method of the whole thing, where the magic happens.
 */
const main = () => {
	table    = document.getElementById("dfaTable");
	inputBox = document.getElementById("inputBox");
	input2   = document.getElementById("secondInput");
	error    = document.getElementById("error");
	accept   = document.getElementById("acceptOrNot");
	word     = document.getElementById("word");

	if (table    != null) {table.remove();}
	if (inputBox != null) {inputBox.remove();}
	if (input2   != null) {input2.remove();}
	if (error    != null) {error.remove();}
	if (accept   != null) {accept.remove();}
	if (word     != null) {word.remove();}

	const regExp = document.getElementById("regExp");
	const parsed = GRAMMAR.match(regExp.value);

	let nfa;
	let dfa;

	if ( parsed.succeeded() ) {
		nfa = SEMANTICS(parsed).interpret();
		dfa = minimize( nfaToDfa(nfa) );

		createDfaTable(dfa);
		makeInputBox(dfa);
	} else {
		throwError();
	}
	return false;
}

// This line starts the program, by reading the first input from the user.
document.getElementById("firstInput").addEventListener("submit", function() { main() });



