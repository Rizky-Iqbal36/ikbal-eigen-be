function solutionTwo(input: string) {
  const splittedInput = input.split(' ');
  const result = splittedInput.reduce<string>((max, current) => {
    return current.length > max.length ? current : max;
  }, '');
  return `${result}: ${result.length} characters`;
}

console.log(solutionTwo('Saya sangat senang mengerjakan soal algoritma'));
