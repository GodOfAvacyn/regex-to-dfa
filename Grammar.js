const {LAMBDA, makeNfaPiece, addCharToNames, simplifyNames, or, concat, kleeneConcat, orLambda, nfaToDfa} = require('./utils.js');
const ohm = require('ohm-js');

const GRAMMAR = ohm.grammar(`
	Arithmetic {
	  	Exp
	    	= AltExp

	  	AltExp
		  	= AltExp "|" ConExp   --or
		  	| ConExp

		ConExp
			= ConExp DupExp       --and
			| DupExp

		DupExp
			= GrpExp "*"          --star 
			| GrpExp "?"          --orlamb
			| GrpExp "+"          --aastar
			| GrpExp

		GrpExp
			= "(" Exp ")"         --parens
			| terminal

		terminal (a terminal)
			= "0"
			| "1"

    }
`);

const SEMANTICS = GRAMMAR.createSemantics();

SEMANTICS.addOperation(
	'interpret',
	{
		Exp:           (exp)            => exp.interpret(),

		AltExp:        (exp)            => exp.interpret(),
		AltExp_or:     (top, line, bot) => or( top.interpret(), bot.interpret() ),

		ConExp_and:    (left, right)    => concat( left.interpret(), right.interpret() ),
		ConExp:        (exp)            => exp.interpret(),

		DupExp:        (exp)            => exp.interpret(),
		DupExp_star:   (exp, star)      => kleeneConcat( exp.interpret(), true ),
		DupExp_orlamb: (exp, question)  => orLambda( exp.interpret() ),
		DupExp_aastar: (exp, plus)      => kleeneConcat( exp.interpret(), false ),

		GrpExp:        (exp)            => exp.interpret(),
		GrpExp_parens: (x, exp, y)      => exp.interpret(),

		terminal: function(term) {
			return makeNfaPiece(this.sourceString);
		}
	}
);

module.exports = {SEMANTICS, GRAMMAR}