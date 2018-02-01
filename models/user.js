var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    user_id: {type: Number},
    first_name: { type: String },
    last_name: { type: String },
    user_name: { type: String },
    user_email: { type: String, required: true },
    user_password: { type: String, required: true },
    date_created: { type: Date, default: Date.now },
    start_date: { type: Date, default: Date.now },
    expiration_date: { type: Date, default: Date.now },
    subscription_level: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);