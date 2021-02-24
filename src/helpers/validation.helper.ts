import Validator, { ErrorMessages, Rules } from 'validatorjs';
import createError from 'http-errors';

export default async (
  dataToValidate: object,
  rulesForValidation: Rules,
  validationMessages: ErrorMessages = {}
) => {
  return new Promise((resolve, reject) => {
    const validator = new Validator(
      dataToValidate,
      rulesForValidation,
      validationMessages
    );

    validator.checkAsync(
      () => {
        resolve(true);
      },
      () => {
        const errorMessages = validator.errors.all();
        reject(
          new createError.UnprocessableEntity(JSON.stringify(errorMessages))
        );
      }
    );
  });
};
