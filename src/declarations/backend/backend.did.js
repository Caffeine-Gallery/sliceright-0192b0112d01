export const idlFactory = ({ IDL }) => {
  const Fraction = IDL.Record({
    'numerator' : IDL.Nat,
    'denominator' : IDL.Nat,
  });
  const Score = IDL.Record({
    'value' : IDL.Nat,
    'fraction' : Fraction,
    'guess' : IDL.Float64,
  });
  return IDL.Service({
    'addScore' : IDL.Func([IDL.Nat, Fraction, IDL.Float64], [], []),
    'calculateScore' : IDL.Func([Fraction, IDL.Float64], [IDL.Nat], []),
    'generateFraction' : IDL.Func([], [Fraction], []),
    'getHighScores' : IDL.Func([], [IDL.Vec(Score)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
