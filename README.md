# front-defender

#### 保卫前端数据类型安全，接口返回的数据类型，从一开始就确定，并且在运行时加入检查！

类似切面使用方式，promise或rxjs都能在编写请求时预先定义类型，rxjs使用例子：
```
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

- 对象类型或json类型，配置同样是对象形式，此时使用$rule定义规则
- optional标记该项可不传，也等同于不写此项
- 同时使用多项规则组合，用 | 分隔
- 当标记为json时，可以进一步使用array或checkless，标记结果parse后为数组或者不需要检查结果类型，否则会以对象的形式对结果进行检查
