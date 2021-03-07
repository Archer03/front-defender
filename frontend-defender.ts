class FrontDefender {
    static loadConfig(config) {
        return (apiData) => {
            try {
                if (apiData == null) {
                    console.error(`api data is null`);
                    return;
                }

                const checkFn = (config, data, aboveKeys: string[]) => {
                    Object.entries(config).forEach(([key, rules]: [string, any]) => {
                        const levelKeys = [...aboveKeys, key];
                        let rulesArr = (rules.$rule ?? rules).split('|').map(rule => rule.trim());
                        if (rulesArr.includes('optional') && data[key] == null ||
                            key === '$rule') {
                            // optional means null or undefined is allowed
                            return;
                        }
                        rulesArr = rulesArr.filter(rule => rule !== 'optional');
                        if (typeof rules === 'string') {
                            rulesArr.forEach(rule => {
                                FrontDefender[rule](levelKeys, data[key]);
                            });
                        } else {
                            // If optional not set, and rule set as object means neccessary.
                            if (!FrontDefender.notnull(levelKeys, data[key])) return;
                            if (rulesArr.includes('json')) {
                                let toCheckObject;
                                [data[key], toCheckObject] = FrontDefender.json(levelKeys, data[key], rulesArr);
                                if (!toCheckObject) return;
                            }
                            if (Object.prototype.toString.call(data[key]) !== '[object Object]') {
                                console.error(`api not correct: ${levelKeys.join('-')} is not object-data`);
                                return;
                            }
                            checkFn(rules, data[key], levelKeys);
                        }
                    })
                };

                checkFn(config, JSON.parse(JSON.stringify(apiData)), []);

            } catch (error) {
                console.error(error);
            }
        }
    }

    static notnull(levelKeys: string[], value: any) {
        if (value == null) {
            // undefined or null
            console.error(`api not correct: ${levelKeys.join('-')} is null`);
            return false;
        }
        return true;

    }

    static notempty(levelKeys: string[], value: any) {
        if (value == null || value === '') {
            // undefined and null or ''
            console.error(`api not correct: ${levelKeys.join('-')} is empty`);
            return false;
        }
        return true;
    }

    static array(levelKeys: string[], value: any) {
        if (!(value instanceof Array)) {
            console.error(`api not correct: ${levelKeys.join('-')} is not array`);
            return false;
        }
        return true;
    }

    static number(levelKeys: string[], value: any) {
        if (typeof value !== 'number') {
            console.error(`api not correct: ${levelKeys.join('-')} is not number`);
            return false;
        }
        return true;
    }

    static boolean(levelKeys: string[], value: any) {
        if (typeof value !== 'boolean') {
            console.error(`api not correct: ${levelKeys.join('-')} is not boolean`);
            return false;
        }
        return true;
    }

    static json(levelKeys: string[], value: any, rulesArr: string[]) {
        let toCheckObject = true;
        try {
            value = JSON.parse(value);
        } catch (error) {
            console.error(`api not correct: ${levelKeys.join('-')} json parsed with error`);
            toCheckObject = false;
        }

        if (rulesArr.includes('checkless')) {
            toCheckObject = false;
            return [value, false]
        }

        if (rulesArr.includes('array')) {
            toCheckObject = false;
            if (!(value instanceof Array)) {
                console.error(`api not correct: ${levelKeys.join('-')} json parsed result is not Array`);
            }
        }

        return [value, toCheckObject];
    }
}
