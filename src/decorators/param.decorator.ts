import "reflect-metadata";

const KEY = Symbol("TRANSFORM_KEY");

export function pValue(name: string) {
    console.log(name)
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        console.log(target, propertyKey, parameterIndex);
        const params = Reflect.getOwnMetadata(KEY, target, propertyKey) || [];
        params.push({ index: parameterIndex, name });
        Reflect.defineMetadata(KEY, params, target, propertyKey);
    };
}

export function ProcessorExecute(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const metodoOriginal = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const configs = Reflect.getOwnMetadata(KEY, target, propertyKey);

        if (configs) {
            for (const config of configs) {
                const valorOriginal = args[config.index];

                args[config.index] = {
                    name: config.name,
                    value: valorOriginal
                };

                console.log(args);
            }
        }

        return metodoOriginal.apply(this, args);
    };
}