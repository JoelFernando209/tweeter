export const divideArrInEqualParts = (array, parts) => {
  let result = [];
  
  for(let i = 0; i < array.length; i += parts) {
    result.push(array.slice(i, i + parts));
  }
  
  return result;
}