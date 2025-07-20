// 这是一个测试文件，有格式问题
const testVar = 'double quotes'
const obj = { a: 1, b: 2 }
function testFunc() {
  return testVar
}

// 使用变量避免 unused-vars 错误
console.log(testVar, obj, testFunc())
