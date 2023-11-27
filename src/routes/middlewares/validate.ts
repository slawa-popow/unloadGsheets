import { body } from "express-validator"

/**
 * Validation field name
 */
export const nameVld = () => {
    return body('name').exists().withMessage('Не существует')
    .isString().withMessage('Не строка')
    .trim().isLength({min: 1, max: 45}).withMessage('Не корректная длина значения')
}

/**
 * Validation field email
 */
export const emaiVld = () => {
    return body('email').exists().withMessage('Не существует')
    .isString().withMessage('Не строка')
    .isEmail().withMessage('Не корректный email')
    .trim().isLength({min: 6, max: 50}).withMessage('Не корректная длина значения')
}