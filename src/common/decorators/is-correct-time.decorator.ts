import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  
  export function IsCorrectTime(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
      registerDecorator({
        name: 'isCorrectTime',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: string, _args: ValidationArguments) {
            if (typeof value !== 'string') {
              return false;
            }
  
            const regex = /^([1-9]\d*)([hdmy])$/; 
            if (!regex.test(value)) {
              return false;
            }
  
            const unit = value.slice(-1);
            return ['h', 'd', 'm', 'y'].includes(unit);
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} must be a valid time string (e.g. 3h, 4d, 6m, 5y)`;
          },
        },
      });
    };
}
