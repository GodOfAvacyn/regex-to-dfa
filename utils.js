const Nfa = require('./Nfa.js');
const Dfa = require('./Dfa.js');
const LAMBDA = '';
const DEAD = 'DEAD';

/**
 * Helper function; the simplest Nfa; one that only accepts 1 character.
 * @param c Character value of the accepted string.
 * @return Nfa object.
 */
const makeNfaPiece = (c) => {
    let nfa = new Nfa({
        start: 'x',
        transitions: {
            x: {
            },
        },
        acceptStates: ['y'],
    });
    nfa.transitions.x[c] = ['y'];
    return nfa;
}

/**
 * Helper function; adds a specific character to the end of every single state name.
 * @return new NFA with added chars
 */
const addCharToNames = (nfa, c) => {
    let newStart = nfa.start + c;
    let newAccepts = nfa.acceptStates.map(n => n+c);
    let newTransitions = nfa.transitions;
    for ( const state of Object.keys(newTransitions) ) {
        for ( const move of Object.keys(newTransitions[state]) ) {
            newTransitions[state][move] = newTransitions[state][move].map(n => n+c);
        }
        newTransitions[state + c] = newTransitions[state];
        delete newTransitions[state];
    }

    return new Nfa({
        start: newStart,
        transitions: newTransitions,
        acceptStates: newAccepts,
    });
}

/**
 * Helper function; creates a new Nfa which applies the "or" operation to two NFAs.
 * @param nfa1 Nfa object.
 * @param nfa2 Nfa object.
 * @return Nfa object, the or'd operation of the above parameters.
 */
const or = (nfa1, nfa2) => {
    let top = addCharToNames(nfa1, 't');
    let bot = addCharToNames(nfa2, 'b');

    return new Nfa({
        start: 'x',
        transitions: {
            'x': {
                '': [top.start, bot.start]
            },
            ...top.transitions,
            ...bot.transitions,
        },
        acceptStates: top.acceptStates.concat(bot.acceptStates),
    });
}

/**
 * Helper function; creates a new Nfa which concatonates two other NFAs.
 * @param nfa1 Nfa object.
 * @param nfa2 Nfa object.
 * @return Nfa object, the concatonation of the above parameters.
 */
const concat = (nfa1, nfa2) => {
    let left  = addCharToNames(nfa1, 'l');
    let right = addCharToNames(nfa2, 'r');
 
    for (const s of left.acceptStates) {
        if (left.transitions[s] == undefined) {
            left.transitions[s] = {};
        }
        if ( left.transitions[s].hasOwnProperty(LAMBDA) ) {
            left.transitions[s][LAMBDA].push(right.start);
        } else {
            left.transitions[s][LAMBDA] = [right.start];
        }
    }

    return new Nfa({
        start: left.start,
        transitions: {
            ...left.transitions,
            ...right.transitions,
        },
        acceptStates: right.acceptStates
    });
}

/**
 * Helper function; produces the kleene concatenation of a given Nfa.
 * @param nfa1 Nfa object to be kleene concatonated.
 * @param includeStart Boolean value; whether or not to accept start state.
 * @return A new Kleene'd Nfa.
 */
const kleeneConcat = (nfa1, includeStart=true) => {
    let unstarred = addCharToNames(nfa1, 's');

    let newStart = 'x'
    let newTransitions = unstarred.transitions;
    for (const s of unstarred.acceptStates) {
        if (newTransitions[s] == undefined) {
            newTransitions[s] = {};
        }
        if (newTransitions.hasOwnProperty(LAMBDA)) {
            newTransitions[s][LAMBDA].push(newStart);
        } else {
            newTransitions[s][LAMBDA] = [newStart];
        }
    }
    let newAccepts = unstarred.acceptStates;
    if (includeStart) {
        newAccepts.push('x');
    }

    return new Nfa({
        start: 'x',
        transitions: {
            x: {
                '': [ unstarred.start ],
            },
            ...unstarred.transitions,
        },
        acceptStates: unstarred.acceptStates,
    });
}

/**
 * Helper function; makes an Nfa accept its start state.
 * @param Nfa object to be altered.
 * @return Nfa, including nfa's start state.
 */
const orLambda = (nfa) => {
    if ( !(nfa.acceptStates.includes(nfa.start)) ) {
        nfa.acceptStates.push(nfa.start);
    }
    return nfa;
}

/**
 * Helper function; clumps together all states connected
 * by lambda moves.
 * @param nfa Nfa object to compare values to.
 * @param statelist array of state names.
 */
const dealWithLambda = (nfa, stateList) => {
    for (let state of stateList) {
        if ( nfa.transitions.hasOwnProperty(state) ) {
            if ( nfa.transitions[state].hasOwnProperty(LAMBDA) ) {
                for (let lambdaState of nfa.transitions[state][LAMBDA]) {
                    if ( !stateList.includes(lambdaState) ) {
                        stateList.push(lambdaState);
                    }
                }
            }
        }
    }
}

/**
 * Helper function; Takes in a Dfa-friendly table, an old Nfa, and 
 * a set of states. It then adds the states to our table.
 * @param table Object literal to be altered.
 * @param nfa Nfa to compare everything to
 * @param states String value of the form 'x,y,z'
 * @return String of the name of the added State
 */
const addToTable = (table, nfa, states) => {
    let stateList   = states.split(',');
    let zeroStates  = [];
    let oneStates   = [];

    dealWithLambda(nfa, stateList);
    stateList.sort();
    for (let state of stateList) {
        if ( !nfa.transitions.hasOwnProperty(state) ) {
            break;
        }
        if (nfa.transitions[state].hasOwnProperty('0')) {              // If it contains a zero...
            for (let zeroState of nfa.transitions[state]['0']) {       // add it to our zero states...
                if ( !zeroStates.includes(zeroState) ) {               // if it doesn't already have it.
                    zeroStates.push(zeroState);
                }
            }
        }
        if (nfa.transitions[state].hasOwnProperty('1')) {              // If it contains a one...
            for (let oneState of nfa.transitions[state]['1']) {        // add it to our one states...
                if ( !oneStates.includes(oneState) ) {                 // if it doesn't already have it.
                    oneStates.push(oneState);
                }
            }
        }
    }

    dealWithLambda(nfa, zeroStates); zeroStates.sort();
    dealWithLambda(nfa, oneStates);  oneStates.sort();

    zeroStates = zeroStates.toString();
    oneStates  = oneStates.toString();
    states     = stateList.toString();

    if (oneStates  == '') { oneStates  = DEAD; }
    if (zeroStates == '') { zeroStates = DEAD; }

    if ( table.hasOwnProperty(states) ) {
        return 'NO_CHANGE'
    }
    table[states] = {
        0: zeroStates,
        1: oneStates,
    }
    return states;
}

/**
 * Converts an NFA to a DFA.
 * @param nfa Nfa object to be converted.
 * @return Dfa object.
 */
const nfaToDfa = (nfa) => {
    let newTransitions = {};
    let newStart       = addToTable(newTransitions, nfa, nfa.start);
    let newAccepts     = [];

    let finished = false;
    let objectKeys = Object.keys(newTransitions);
    while (!finished) {
        for (let state of objectKeys) {
            let newState = addToTable(newTransitions, nfa, newTransitions[state]['0']);
            if (newState == 'NO_CHANGE') {
                finished = true;
            } else {
                finished = false;
                objectKeys.push(newState);
            }
            newState = addToTable(newTransitions, nfa, newTransitions[state]['1']);
            if (newState == 'NO_CHANGE') {
                finished = true;
            } else {
                finished = false;
                objectKeys.push(newState);
            }
        }
    }

    for ( let state of Object.keys(newTransitions) ) {
        for (let accept of state.split(',')) {
            if (nfa.acceptStates.includes(accept)) {
                newAccepts.push(state);
                break;
            }
        }
    }

    let dfa = new Dfa({
        start: newStart,
        transitions: newTransitions,
        acceptStates: newAccepts,
    });

    return dfa;
}

/**
 * Minimizes a Dfa.
 * @param dfa Dfa object to be minimized.
 * @return New minimized Dfa object.
 */
const minimize = (dfa) => {

    let reachableStates = [dfa.start];
    let newStates = [dfa.start];

    // Removing unreachable States
    while (newStates.length != 0) {
        let temp = [];
        for (let state of newStates) {
            temp.push(dfa.transitions[state][0]);
            temp.push(dfa.transitions[state][1]);
        }
        newStates = temp.filter(n => !reachableStates.includes(n));
        reachableStates = reachableStates.concat(newStates);
    }

    // Removing non-distinguishable states
    P = [reachableStates.filter(n => dfa.acceptStates.includes(n)),   reachableStates.filter(n => !dfa.acceptStates.includes(n))];
    W = [reachableStates.filter(n => dfa.acceptStates.includes(n)),   reachableStates.filter(n => !dfa.acceptStates.includes(n))];
    while (W.length != 0) {
        let A = W.shift();
        for (let c of [0,1]) {
            let X = [];
            for (let state of reachableStates) {
                if ( !X.includes(state) && A.includes(dfa.transitions[state][c])) {
                    X.push(state);
                }
            }
            for (let idx = 0; idx < P.length; idx++) {
                let Y = P[idx]
                let YandX = Y.filter(n =>  X.includes(n));
                let YnotX = Y.filter(n => !X.includes(n));
                if ( (YandX.length != 0) && (YnotX.length != 0) ) {
                    P.splice(idx, 1, YandX, YnotX);
                    if (W.includes(Y)) {
                        W.splice(idx, 1, YandX, YnotX);
                    } else {
                        if (YandX.length >= YnotX.length) {
                            W.push(YandX);
                        } else {
                            W.push(YnotX);
                        }
                    }
                }
            }
        }
    }

    // This is not neccesary, it just ensures that the start state will get labeled 'q0'
    for (let idx=0; idx < P.length; idx++) {
        if ( P[idx].includes(dfa.start) ) {
            startSet = P.splice(idx, 1);
            P.unshift(startSet[0]);
        }
    }


    // Creating the DFA
    let newStart = '';
    for (let set of P) {
        if ( set.includes(dfa.start) ) {
            newStart = set.toString();
        }
    }

    let newTransitions = {};
    for (let set of P) {
        let tempState = set[0];
        let tempZero  = dfa.transitions[tempState]['0'];
        let tempOne   = dfa.transitions[tempState]['1'];
        let zeroState = ''; let oneState = '';
        for (let nextSet of P) {
            if ( nextSet.includes(tempZero) ) {
                zeroState = nextSet.toString();
            }
            if ( nextSet.includes(tempOne) ) {
                oneState = nextSet.toString();
            }
        }
        newTransitions[set.toString()] = {
            0: zeroState,
            1: oneState,
        }
    }

    let newAccepts = [];
    for (let set of P) {
        if ( dfa.acceptStates.includes(set[0]) ) {
            newAccepts.push(set.toString());
        }
    }

    let newDfa = new Dfa ({
        start: newStart,
        transitions: newTransitions,
        acceptStates: newAccepts,
    })
    return simplifyNames(newDfa);

}


/**
 * Helper function: renames all states in a Dfa.
 * @param dfa object to be renamed.
 * @return new dfa object with fresh names. 
 */
const simplifyNames = (dfa) => {

    let oldStates = Object.keys(dfa.transitions);
    let newStates = [];
    let idx = 0;
    for (state of oldStates) {
        newStates.push('q'+idx);
        idx++;
    }
    // Now each old state now mapped to a new state of the form 'qn', where n is a unique integer.
    let stateMapping = {};
    for (let i=0; i<oldStates.length; i++) {
        stateMapping[oldStates[i]] = newStates[i];
    }

    // creating new Dfa pieces
    let newStart = stateMapping[dfa.start];
    let newTransitions = dfa.transitions;
    for ( const state of Object.keys(newTransitions) ) {
        for ( const move of Object.keys(newTransitions[state]) ) {
            newTransitions[state][move] = stateMapping[newTransitions[state][move]];
        }
        newTransitions[stateMapping[state]] = newTransitions[state];
        delete newTransitions[state];
    }
    let newAccepts = dfa.acceptStates;
    for (let i=0; i<newAccepts.length; i++) {
        newAccepts[i] = stateMapping[newAccepts[i]];
    }

    // Creating new Dfa
    return new Dfa ({
        start: newStart,
        transitions: newTransitions,
        acceptStates: newAccepts,
    })
}

module.exports = {LAMBDA, makeNfaPiece, addCharToNames, or, concat, kleeneConcat, orLambda, nfaToDfa, minimize};