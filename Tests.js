const {LAMBDA, makeNfaPiece, addCharToNames, or, concat, kleeneConcat, orLambda, nfaToDfa, minimize} = require('./utils.js');


const Nfa = require('./Nfa.js');
const Dfa = require('./Dfa.js');
const {GRAMMAR, SEMANTICS} = require('./Grammar.js');


console.log('================================================================================================\n');

let myRegEx = '(1+)0*'
let myNfa = SEMANTICS( GRAMMAR.match(myRegEx) ).interpret();
let myDfa = minimize( nfaToDfa(myNfa) );

console.log('Binary strings made of at least one 1\'s, then any number of 0\'s\n');
console.log('Language given by the following regular expression:', myRegEx);
console.log('\nModeled by the following minimized DFA:\n');
console.log(myDfa);


console.log('\nAccepted strings:\n');
for (const s of ['1111100', '1', '110000000000']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}
console.log('\nRejected strings:\n');
for (const s of ['', '0', '0101010', '11111000001']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}

console.log('\n================================================================================================\n');

myRegEx = '(0|1(01*0)*1)*'
myNfa = SEMANTICS( GRAMMAR.match(myRegEx) ).interpret();
myDfa = minimize( nfaToDfa(myNfa) );

console.log('Binary strings divisible by 3\n');
console.log('Language given by the following regular expression:', myRegEx);
console.log('\nModeled by the following minimized DFA:\n');
console.log(myDfa);

console.log('\nAccepted strings:\n');
for (const s of ['110', '1111', '1100000', '00', '101001101', '11110100001000111111']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}
console.log('\nRejected strings:\n');
for (const s of ['100', '10011101', '11111', '10', '11110100000010101111']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}

console.log('\n================================================================================================\n');

myRegEx = '(0|1(10)*(0|11)(01*01|01*00(10)*(0|11))*1)*'
myNfa = SEMANTICS( GRAMMAR.match(myRegEx) ).interpret();
myDfa = minimize( nfaToDfa(myNfa) );

console.log('Binary strings divisible by 5\n');
console.log('Language given by the following regular expression:', myRegEx);
console.log('\nModeled by the following minimized DFA:\n');
console.log(myDfa);

console.log('\nAccepted strings:\n');
for (const s of ['110111', '1000101011', '0', '1010', '11001101', '11111011010']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}
console.log('\nRejected strings:\n');
console.log('\nBinary strings NOT divisible by 5:\n');
for (const s of ['101010101011', '10011101', '11111011011110', '10001', '1000000000000']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}

console.log('\n================================================================================================\n');

myRegEx = '(0|1)*11111(0|1)*'
myNfa = SEMANTICS( GRAMMAR.match(myRegEx) ).interpret();
myDfa = minimize( nfaToDfa(myNfa) );

console.log('Binary strings containing five 1\'s in a row:\n');
console.log('Language given by the following regular expression:', myRegEx);
console.log('\nModeled by the following minimized DFA:\n');
console.log(myDfa);

console.log('\nAccepted strings:\n');
for (const s of ['0111110', '11111', '01010101111011111001011', '111111111', '11111000000']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}
console.log('\nRejected strings:\n');
for (const s of ['1111', '00000000', '11001100111101111', '101010101']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}

console.log('\n================================================================================================\n');

myRegEx = '(1*0)|1'
myNfa = SEMANTICS( GRAMMAR.match(myRegEx) ).interpret();
myDfa = minimize( nfaToDfa(myNfa) );

console.log('Any number of 1\'s followed by a zero, or just one 1\n');
console.log('Language given by the following regular expression:', myRegEx);
console.log('\nModeled by the following minimized DFA:\n');
console.log(myDfa);

console.log('\nAccepted strings:\n');
for (const s of ['1', '1111110', '0', '110']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}
console.log('\nRejected strings:\n');
for (const s of ['11', '11111111', '00001010110', '01']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}

console.log('\n================================================================================================\n');

myRegEx = '(0*1)|(1*0)'
myNfa = SEMANTICS( GRAMMAR.match(myRegEx) ).interpret();
myDfa = minimize( nfaToDfa(myNfa) );

console.log('Strings ending with a character that did NOT appear previously\n');
console.log('Language given by the following regular expression:', myRegEx);
console.log('\nModeled by the following minimized DFA:\n');
console.log(myDfa);

console.log('\nAccepted strings:\n');
for (const s of ['1', '01', '00000001', '0', '1110', '111111111111110']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}
console.log('\nRejected strings:\n');
for (const s of ['000000', '1010101000111', '000000000011', '01111111110']) {
    console.log( `${s}: ${myDfa.accepts(s)}` );
}

