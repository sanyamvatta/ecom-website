import usersRepo from '../../repositories/users.js'
import express from 'express'
import middlewares from './middlewares.js'
import {check,validationResult} from 'express-validator'
import signupTemplate from '../../views/admin/auth/signup.js'
import signinTemplate from '../../views/admin/auth/signin.js'
import validator from './validators.js'

const router = express.Router()
router.get('/signup', (req, res) => {
  res.send(signupTemplate({req}))
});

router.post('/signup',[validator.requireEmail,validator.requirePassword,validator.requirePasswordConfirmation],
  middlewares.handleErrors(signupTemplate), 
  async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.redirect('/admin/products');
}
);

router.get('/signout',(req,res)=>{
  req.session=null;
  res.send('Signed out!!!');
})

router.get('/signin',(req,res)=>{
  res.send(signinTemplate({}))
})

router.post('/signin',[
  validator.requireEmailExsist,
  validator.requireValidPasswordForUser
],
 middlewares.handleErrors(signinTemplate),
 async (req, res) => {
  const {email}= req.body
  const user = await usersRepo.getOneBy({email});
  req.session.userId = user.id
  res.redirect('/admin/products')
})

export default router