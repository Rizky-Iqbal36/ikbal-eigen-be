function solutionOne(input: string) {
  let storeString = '';

  for (const char of input) {
    if (/[A-Za-z]/.test(char)) storeString = char + storeString;
    else storeString += char;
  }
  return storeString;
}

console.log(solutionOne('NEGIE1'));
