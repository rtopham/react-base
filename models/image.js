var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    path = require('path');

var ImageSchema = new Schema({
    user_id:        { type: ObjectId },
    title:          { type: String },
    description:    { type: String },
    filename:       { type: String },
    views:          { type: Number, 'default': 0 },
    likes:          { type: Number, 'default': 0 },
    timestamp:      { type: Date, 'default': Date.now }
});

ImageSchema.virtual('uniqueId')
    .get(function() {
        return this.filename.replace(path.extname(this.filename), '');
    });

module.exports = mongoose.model('Image', ImageSchema);
