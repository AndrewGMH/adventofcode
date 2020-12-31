import Load from '../util/load';
import Display from '../util/display';

/**
 * Extract the card, door public keys and the decryption key
 * 
 * @param data 
 */
const extract = (data: Array<string>): Array<number> => {
  return [+data[0], +data[1], 20201227];
}

/**
 * Find the loop size of the card public key
 * 
 * @param cardPublicKey Card public key
 * @param key Decryption key
 */
const findLoopSize = (cardPublicKey: number, key: number): number => {
  let v: number = 1;

  for (let loopSize = 0; true; loopSize++) {
    v = (v * 7) % key;

    if (v === cardPublicKey) {
      return loopSize;
    }
  }
}

/**
 * Find the hand shake with the door public key and the loop size
 * 
 * @param doorPublicKey Door public key
 * @param key Decryption key
 * @param loopSize Loop size of the card
 */
const findHandShake = (doorPublicKey: number, key: number, loopSize: number): number => {
  let handShake: number = 1;

  for (let x = 0; x <= loopSize; x++) {
    handShake = (handShake * doorPublicKey) % key;
  }

  return handShake;
}

/**
 * Find the information to open the door
 * 
 * @param cardPublicKey Card public key
 * @param doorPublicKey Door public key
 * @param key Decryption key
 */
const answerOne = (cardPublicKey: number, doorPublicKey: number, key: number): number => {
  return findHandShake(doorPublicKey, key, findLoopSize(cardPublicKey, key));
}


export default () => {

  const [cardPublicKey, doorPublicKey, key]: Array<number> = Load(25, extract);

  return {
    "part-1": {
      'question': Display(25, 1),
      'answer': answerOne(cardPublicKey, doorPublicKey, key)
    },
  }
}