var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//VARIANTS COLLECTION SCHEMA
var userschema = new Schema({


    //_id:MongoJS-ID
    name: String,     // "Width:Medium,Color:Ivory,Shoe Size:6.5",
    lname: String,        // "width:medium,color:ivory,shoe size:6.5",
    itemId: String,       // "054VA72303012P",
    altIds: {
        upc: String      // "632576103580"
    },
    assets: {
        imgs: [
            {
                color:String,
                width: String,    // "1900",
                height: String,     // "1900",
                src: String      // //"http://imageURL"
            },
            {
                color:String,
                width: String,        // "1900",
                height: String,     // "1900",
                src: String      // //"http://imageURL"
            }
        ]
    },
    variants:[
        {
    attrs: [
        {
            name: String,    // "Size",
            value: String    // "7"
        },
        {
            name: String,    // "Color",
            
            value: String    // "Ivory"
        },
        {
            name: String,    // "6.5",
            value: String        // "6.5"
        }
    ]
},
    ]




}, { versionKey: false });

module.exports = mongoose.model('variants', userschema);

