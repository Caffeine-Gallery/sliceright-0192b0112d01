import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Time "mo:base/Time";

actor {
  type Fraction = {
    numerator: Nat;
    denominator: Nat;
  };

  type Score = {
    value: Nat;
    fraction: Fraction;
    guess: Float;
  };

  stable var highScores : [Score] = [];

  public func generateFraction() : async Fraction {
    let seed = Int.abs(Time.now());
    let denominator = 2 + (seed % 10); // Range: 2 to 11
    let numerator = 1 + (seed % (denominator - 1)); // Range: 1 to denominator-1
    { numerator = Nat.fromInt(numerator); denominator = Nat.fromInt(denominator) }
  };

  public func calculateScore(fraction: Fraction, guess: Float) : async Nat {
    let actualValue : Float = Float.fromInt(fraction.numerator) / Float.fromInt(fraction.denominator);
    let difference : Float = Float.abs(actualValue - guess);
    let penaltyPoints = Int.abs(Float.toInt(difference * 1000.0));
    Nat.sub(100, Nat.min(100, Nat.fromInt(penaltyPoints)))
  };

  public func addScore(score: Nat, fraction: Fraction, guess: Float) : async () {
    let newScore : Score = { value = score; fraction = fraction; guess = guess };
    highScores := Array.sort<Score>(Array.append<Score>(highScores, [newScore]), func(a, b) { Nat.compare(b.value, a.value) });
    if (Array.size<Score>(highScores) > 10) {
      highScores := Array.tabulate<Score>(10, func(i) { highScores[i] });
    };
  };

  public query func getHighScores() : async [Score] {
    highScores
  };
}
