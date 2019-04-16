require("dotenv").config();
const request = require('request');
var Users = require('../model/Users')
var mongoose = require("mongoose");
const async = require('async');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')




exports.signUpUsers = async function (req, res) {
  try {
    let email = req.body.email;
    let user = await Users.findOne({
      email: email.toLowerCase(),
    });
    console.log(user)
    if (user == null) {
      let newUser = new Users({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      })

      let savedUser = await newUser.save();
      const token = await jwt.sign({ userId: newUser._id }, process.env.jwtSecret)

      userObject = Object.assign(userpicked, {
        exp: Math.floor(moment().toDate() / 1000) + 60 * 60 * 3
      });

      if (savedUser) {
        res.json({
          isSuccess: true,
          data: token
        });
      }
    } else {
      res.json({
        isSuccess: false,
        msg: "email already exists"
      });
    }
  } catch (err) {
    console.log('err:', err)
    res.json({
      success: false,
      error: err
    })
  }

}

exports.signInUsers = async function (req, res) {
  console.log('datat', req.body)
  let data = await Users.findOne({
    email: req.body.email
  })
  console.log('data:', data)
  if (!data) {
    res.json({
      success: false,
      msg: 'error1'
    })
  }
  else {
    const valid = await bcrypt.compare(req.body.password, data.password)
    if (valid) {
      const token = await jwt.sign({ userId: data._id }, process.env.jwtSecret)
      res.json({
        success: true,
        token,
        data: data
      })
    }
    else {
      res.json({
        success: false,
        msg: 'error2'
      })
    }
  }
}
exports.getUser = async function(req, res){
  console.log('idd', req.body)
  let data = await Users.findOne({_id: mongoose.Types.ObjectId(req.body.id)})
  if(data){
    res.json({
      success: true,
      data
    })
  }
}
