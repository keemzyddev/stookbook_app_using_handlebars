const express = require('express')
const passport = require('passport')
const router = express.Router()

//auth with Google
//Get /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'], prompt: 'select_account', }))

// google auth callback
// Get /auth/google/callback
router.get('/google/callback',
 passport.authenticate('google', {failureRedirect: '/', }),
 (req, res) =>{
    res.redirect('/dashboard')
} 
)
//logout user
///auth/logout
router.get('/logout', (req, res)=>{
    req.logout()
    res.redirect('/')
})

module.exports = router