function solutionThree(input: string[], query: string[]) {
  const result = [];
  for (const val of query) {
    const data = input.filter((i) => i === val);
    result.push(data.length);
  }
  return result;
}

const input = ['xc', 'dz', 'bbb', 'dz'];
const query = ['bbb', 'ac', 'dz'];
console.log(solutionThree(input, query));
