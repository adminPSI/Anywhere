function checkMomentUpgrade() {
  const a = moment('2024/01/27').format('MM/DD/YYYY')
  const b = moment('2024/01/27').format('M/D/YYYY')
  const c = moment('2024/01/27').format('YYYY-MM-DD')
  const d = moment('2024/01/27').format('YYYY-M-D')

  console.log(a, b, c, d)
}