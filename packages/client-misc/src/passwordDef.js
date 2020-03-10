import PasswordValidator from 'password-validator'

export const PASSWORD_MAX_LENGTH = 100
export const PASSWORD_MIN_LENGTH = 8

export const validatePassword = (value) => {
  const schema = new PasswordValidator()
  schema
    .is()
    .min(PASSWORD_MIN_LENGTH)
    .is()
    .max(PASSWORD_MAX_LENGTH)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .symbols()
    .has()
    .not()
    .spaces()
  return schema.validate(value, { list: true })
}
