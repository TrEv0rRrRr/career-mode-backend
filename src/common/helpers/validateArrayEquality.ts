/**
 * Helper function that checks whether two arrays have exactly the same contents
 * @author Trevor
 *
 * @param {number[]} arr1 Array number one
 * @param {number[]} arr2 Array number two
 * @returns {boolean} A boolean value. True, if both arrays are the same, false if not
 */
export const validateArrayEquality = (arr1: number[], arr2: number[]) => {
  if (arr1.length !== arr2.length) return false;

  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();

  return sorted1.every((valor, indice) => valor === sorted2[indice]);
};
