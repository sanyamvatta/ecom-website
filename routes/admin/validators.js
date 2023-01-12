import { check, validationResult } from "express-validator";
import usersRepo from "../../repositories/users.js";

export default {
  requireTitle:check('title')
    .trim()
    .isLength({min:5,max:40})
    .withMessage('Title must be between 5 and 40 characters')
  ,
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({min: 1})
    .withMessage('Price must be atleast 1 and a number')
  ,
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async email => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error('Email in use');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    }),
  requireEmailExsist : check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email address')
    .custom(async (email)=>{
      const user = await usersRepo.getOneBy({ email });
      if(!user){
        throw new Error('Email not found')
      }
      return true;
    }),
  requireValidPasswordForUser : check('password')
    .trim()
    .custom(async (password,{req})=>{
      const user = await usersRepo.getOneBy({email:req.body.email});
      if(!user){
        throw new Error('Invalid password')
      }
      const validPassword = await usersRepo.comparePassword(user.password,password)
      if(!(validPassword)){
        throw new Error('Invalid password')
      }
    }),
};
