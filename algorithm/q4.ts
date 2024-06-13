function solutionFour(m: number[][]) {
  const mItemLength = m[0].length;
  let d1 = 0;
  let d2 = 0;

  for (let i = 0; i < mItemLength; i++) {
    d1 += m[i][i];
    const d2h = mItemLength - 1 - i;
    d2 += m[d2h][i];
  }
  return d1 - d2;
}

const m = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(solutionFour(m));
