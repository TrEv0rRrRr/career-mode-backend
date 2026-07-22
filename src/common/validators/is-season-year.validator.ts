import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isSeasonYear', async: false })
export class IsSeasonYearConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value) return false;

    const regex = /^20\d{2}\/20\d{2}$/;

    if (!regex.test(value)) return false;

    const [start, end] = value.split('/').map(Number);

    return end === start + 1;
  }

  defaultMessage(): string {
    return 'Season must be in the format YYYY/YYYY and the second year must be the following year.';
  }
}

export function IsSeasonYear(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsSeasonYearConstraint,
    });
  };
}
