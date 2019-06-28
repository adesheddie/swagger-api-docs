var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userschema = new Schema({

    // "_id": "SPM8824542513_1234",
    itm_id: String,        //Item ID
    variants: [
        {
            name: String,    // "Heel Height",
            value: String,   //"High (2-1/2 to 4 in.)"
            itm_price: String,   // 69.99,
            sale: {
                salePrice: String,   // 42.72,
                saleEndDate: String  // "2050-12-31 23:59:59"
            },
            lastUpdated: Date    // 1374647707394
        }
    ]

}, { versionKey: false });

module.exports = mongoose.model('price', userschema);