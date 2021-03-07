# front-defender

#### 保卫前端数据类型安全，接口返回的数据类型，从一开始就确定，并且在运行时加入检查。有bug可以找后端✔
##### To defend frontend data security, response data types from api need to be checked, and we can check at runtime. Call backend bug occurs😜

类似切面使用方式，promise或rxjs都能在编写请求方法的同时定义返回数据类型，使用例子：
```javascript
getJson() {
    return this.http.get('assets/hello.json')
      .pipe(tap(FrontDefender.loadConfig({
        hello: 'notnull',
        child: {
          $rule: 'optional',
          name: 'notnull',
          age: 'number|optional'
        },
        group: 'array',
        testEmp: 'notempty',
        flag: 'boolean',
        jsonData: {
          $rule: 'optional|json|array',
        },
        jsonData2: {
          $rule: 'json|checkless',
        },
        jsonData3: {
          $rule: 'json',
          name: 'notnull'
        }
      })));
}
```

- 对象类型或json类型，使用$rule定义规则
- optional标记该项可不传，一般为组合其他规则使用或在$rule中使用，单独使用没有意义
- 同时使用多项规则组合，用 | 分隔
- 标记为json，可以进一步使用array或checkless，标记parse后结果为数组或者不需要检查类型，否则以对象的形式进行内部检查
