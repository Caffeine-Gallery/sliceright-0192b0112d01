import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Fraction { 'numerator' : bigint, 'denominator' : bigint }
export interface Score {
  'value' : bigint,
  'fraction' : Fraction,
  'guess' : number,
}
export interface _SERVICE {
  'addScore' : ActorMethod<[bigint, Fraction, number], undefined>,
  'calculateScore' : ActorMethod<[Fraction, number], bigint>,
  'generateFraction' : ActorMethod<[], Fraction>,
  'getHighScores' : ActorMethod<[], Array<Score>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
