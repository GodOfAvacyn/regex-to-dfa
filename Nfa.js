class Nfa {

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
     * Steps through our Nfa.
     * @param state String name of our state.
     * @param symbol String name of the symbol we read.
     * @return String value of state we move to.
     */
    transition(state, symbol) {
        return this.transitions[state][symbol];
    }

    /**
    * Reads an entire word, using our Nfa to determine if the word is accepted or not.
    * @todo Do the entire method.
    */
    accepts(s) {
    	return true;
    }

    /**
     * returns the name of each and every one of our states.
     * @return Array of state names (strings).
     */
    getStates() {
        const temp = Object.keys(this.transitions);
    	const states = Object.keys(this.transitions);

    	for (const state of temp) {
    		for (const nextStates of Object.values(this.transitions[state])) {
    			for (const nextState of nextStates) {
    				if (!states.includes(nextState)) {
    					states.push(nextState);
    				}
    			}
    		}
    	}
    	return states;
    }
}

module.exports = Nfa