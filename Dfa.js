class Dfa {

    /**
     * The constructor for the Nfa class.
     * @param start String name of our start state
     * @param transitions Object literal value. Each state contains another object literal, mapping
     * a character to an array of state names (strings)
     * @param acceptStates Array of state names (strings) that are accept states.
     */
    constructor({ start, transitions, acceptStates }) {
        this.start = start;
        this.transitions = transitions;
        this.acceptStates = acceptStates;
    }

    /**
     * Steps through our Dfa.
     * @param state String name of our state.
     * @param symbol String name of the symbol we read.
     * @return String value of state we move to.
     */
    transition(state, symbol) {
        return this.transitions[state][symbol];
    }

    /**
    * Reads an entire word, using our Dfa to determine if the word is accepted or not.
    * @todo Do the entire method.
    */
    accepts(s) {
        let current = this.start;
        for (let symbol of s) {
            if ( !(symbol == 0 || symbol == 1) ) {
                return false;
            }
            current = this.transition(current, symbol);
        }
        return this.acceptStates.includes(current);
    }
}

module.exports = Dfa;