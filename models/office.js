var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Dont forget Comas in the schema..
var data = new Schema({
    place: {type: String /*required: true*/},
    room: {type: Number /*required: true*/},
    floor: {type: String /*required:true*/},
    block: {type: String/*required:true*/}
});

module.exports = mongoose.model('Data', data);
