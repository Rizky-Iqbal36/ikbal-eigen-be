import _ from 'lodash'

_.mixin({
  isNumeric: (n: any) => {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }
})
export default undefined
