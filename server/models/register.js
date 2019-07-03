var mongoose = require('mongoose');
var Schema = mongoose.Schema;
bcrypt = require('bcryptjs');

var userschema = new Schema({
    username: String,
    email: String,
    token:String,
    mobile_number:String,
    otp:Number,
    url:String,
    status:String,
    created: { type: Date },
    updated: { type: Date },
    username: { type: String, unique: true },
    password: { type: String, select: false },
}, { versionKey: false });

userschema.pre('save', function (next) {
    now = new Date();
    this.updated = now;
    if (!this.created) {
        this.created = now;
    }
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function (err, Salt) {
        bcrypt.hash(user.password, Salt, function (err, hash) {
            user.password = hash;

            next();
        });

    });

});

userschema.methods.comparepassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        //Password:-> string pass, this.password-> saved password
        done(err, isMatch);
    });
}


module.exports = mongoose.model('auth', userschema);