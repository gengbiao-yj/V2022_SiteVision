// .eslintrc.js
module.exports = {
  root: true,
  // 指定代码的运行环境
  env: {
    browser: true,
    node: true
  },
  extends: [
    //继承 vue 的标准特性
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json' // 解决 vue api 全局引入报错问题
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  // 自定义eslint规则，严格按照StandardJS
  rules: {
    'vue/singleline-html-element-content-newline': 'off', // 单行 html 元素，内容前后强制换行
    'vue/multiline-html-element-content-newline': 'off', // 多行 html 元素，内容前后强制换行
    'vue/name-property-casing': ['error', 'PascalCase'], // 组件名称使用大驼峰格式
    'vue/no-v-html': 'off', // 关闭vue v-html 指令
    'vue/no-multiple-template-root': 'off', // 对于vue文件，template模板内是否指定唯一的根节点
    'vue/no-v-model-argument': 'off', // vue v-model指令允许传参
    indent: [
      2,
      2,
      {
        SwitchCase: 1
      }
    ], // 两个空格缩进
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ], // 单引号
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'after-used'
      }
    ], // 未使用的变量
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ], // 关键字前后空格
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never', // 匿名函数禁止括号前空格
        named: 'never', // 命名函数禁止括号前空格
        asyncArrow: 'always' // 异步箭头函数必须括号前空格
      }
    ], // function关键字和函数名后面的空格
    eqeqeq: ['error', 'always', { null: 'ignore' }], // 除了null,其他用===而不是==
    'space-infix-ops': 2, // 字符串拼接操作符直接用空格
    'comma-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ], // 逗号前面不用空格，逗号后面用空格
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true
      }
    ], // else必须和反花括号一行
    curly: [2, 'multi-line'], // 多行 if 语句的的括号不能省
    'no-undef': 2, // 使用浏览器全局变量时加上 window. 前缀
    'no-multiple-empty-lines': [
      2,
      {
        max: 1
      }
    ], // 不允许有连续多行空行
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ], // 换行符在运算符的位置
    'no-cond-assign': 2, // 条件语句中赋值语句
    'block-spacing': [2, 'always'], // 单行代码块两边加空格
    camelcase: [
      0,
      {
        properties: 'always'
      }
    ], // 对属性名强制使用驼峰
    'comma-dangle': [2, 'never'], // 不允许有多余的行末逗号
    'comma-style': [2, 'last'], // 始终将逗号置于行末
    'dot-location': [2, 'property'], // 点号操作符须与属性需在同一行
    'func-call-spacing': ['error', 'never'], // 函数调用时标识符与括号间不留间隔
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true
      }
    ], // 键值对当中冒号与值之间要留空白
    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false
      }
    ], // 构造函数要以大写字母开头, 但调用大写字母开头的函数不一定需要new
    'new-parens': 2, // 无参的构造函数调用时要带上括号
    'accessor-pairs': 2, // 对象中定义了存值器，一定要对应的定义取值器
    'constructor-super': 2, // 子类的构造器中一定要调用 super
    'no-array-constructor': 'error', // 使用数组字面量而不是构造器
    'no-caller': 2, // 避免使用 arguments.callee 和 arguments.caller
    'no-class-assign': 2, // 避免对类名重新赋值
    'no-const-assign': 2, // 避免修改使用 const 声明的变量
    'no-control-regex': 'error', // 正则中不要使用控制符
    'no-delete-var': 2, // 不要对变量使用 delete 操作。
    'no-dupe-args': 2, // 不要定义冗余的函数参数
    'no-dupe-class-members': 2, // 类中不要定义冗余的属性
    'no-dupe-keys': 2, // 对象字面量中不要定义重复的属性
    'no-duplicate-case': 2, // switch 语句中不要定义重复的 case 分支
    'no-duplicate-imports': 'off', // 同一模块下的内容允许多个import引入
    'no-empty-character-class': 2, // 正则中不要使用空字符
    'no-empty-pattern': 2, // 不要解构空值
    'no-eval': 2, // 禁用 eval()
    'no-ex-assign': 2, // 禁止对 catch 子句的参数重新赋值
    'no-extend-native': 2, // 禁止扩展原生类型
    'no-extra-bind': 2, // 禁止不必要的 .bind() 调用
    'no-extra-boolean-cast': 2, // 禁止不必要的布尔转换
    'no-extra-parens': [2, 'functions'], // 禁止不必要的括号
    'no-fallthrough': 2, // 禁止 case 语句落空
    'no-floating-decimal': 2, // 禁止数字字面量中使用前导和末尾小数点
    'no-func-assign': 2, // 禁止对 function 声明重新赋值
    'no-implied-eval': 2, // 禁用隐式的eval()
    'no-inner-declarations': [2, 'functions'], // 禁止在嵌套的块中出现变量声明或 function 声明
    'no-invalid-regexp': 2, // 禁止 RegExp 构造函数中存在无效的正则表达式字符串
    'no-irregular-whitespace': 2, // 禁止不规则的空白
    'no-iterator': 2, // 禁用 __iterator__ 属性
    'no-label-var': 2, // 不允许标签与变量同名
    'no-new-func': 'error', // 不允许使用Function构造函数
    'no-new-object': 2, // 不允许使用Object构造函数
    'no-new-require': 2, // 禁止调用 require 时使用 new 操作符
    'no-new-wrappers': 2, // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-obj-calls': 2, // 禁止把全局对象作为函数调用
    'no-path-concat': 2, // 禁止对 __dirname 和 __filename 进行字符串连接
    'no-proto': 2, // 禁用 __proto__ 属性。__proto__属性已从 ECMAScript 3.1 中弃用，不应在代码中使用。改为使用方法getPrototypeOf
    'no-redeclare': 2, // 禁止多次声明同一变量
    'no-regex-spaces': 2, // 禁止正则表达式字面量中出现多个空格
    'no-return-assign': [2, 'except-parens'], // 禁止在 return 语句中使用赋值语句
    'no-self-assign': 2, // 禁止自我赋值
    'no-self-compare': 2, // 禁止自身比较
    'no-sequences': 2, // 禁用逗号操作符
    'no-shadow-restricted-names': 2, // 禁止将标识符定义为受限的名字
    'no-sparse-arrays': 2, // 禁用稀疏数组
    'no-template-curly-in-string': 'error', // 常规字符串包含看起来像模板文字占位符的内容时发出警告
    'no-this-before-super': 2, // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
    'no-throw-literal': 2, // 禁止抛出异常字面量
    'no-trailing-spaces': 2, // 禁用行尾空格
    'no-unmodified-loop-condition': 2, // 该规则查找循环条件内的引用，然后检查这些引用的变量是否在循环中被修改
    'no-unsafe-finally': 2, // 禁止在 finally 语句块中出现控制流语句
    'no-unsafe-negation': 'error', // 不允许对关系运算符的左操作数求反 in / instanceof
    'no-useless-rename': 2, // 不允许将导入、导出和解构的分配重命名为相同的名称
    '@typescript-eslint/no-non-null-assertion': 'off', // 非空断言关闭  data!.id
    'semi-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ], // 强制分号之前和之后使用一致的空格
    'space-before-blocks': [2, 'always'], // 强制在块之前使用一致的空格
    'space-in-parens': [2, 'never'], // 强制在圆括号内使用一致的空格
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false
      }
    ], // 强制在一元操作符前后使用一致的空格
    'use-isnan': 2, // 要求使用 isNaN() 检查 NaN
    'wrap-iife': [2, 'any'], // 该规则要求所有立即调用的函数表达式都包含在圆括号中
    'no-unexpected-multiline': 2, // 不允许混淆多行表达式
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ], // 在箭头函数中的箭头前后强制保持一致的间距
    'jsx-quotes': [2, 'prefer-single'], // 强制在 JSX 属性中一致地使用双引号或单引号
    'no-array-constructor': 2, // 禁用 Array 构造函数
    'no-console': process.env.NODE_ENV === 'prod' ? 2 : 'off', // 禁用 console
    'no-global-assign': 2, // 不允许分配给本机对象或只读全局变量
    'no-shadow-restricted-names': 2, // 禁止将标识符定义为受限的名字
    'no-spaced-func': 2, // 要求或禁止在函数标识符和其调用之间有空格
    // 'no-useless-constructor': 2, // 禁止不必要的构造函数
    'no-debugger': process.env.NODE_ENV === 'prod' ? 2 : 0, // 禁用 debugger
    'no-async-promise-executor': 'off' // Promise 回调函数禁止使用 async
  },
  //当使用第三方的SDK时，eslint会报找不到，可以加入到globals，取消对这个的检查
  globals: {
    fengmap: true
  }
};
