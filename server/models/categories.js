


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userschema = new Schema({

  name:String,   // "electronics"
  parent:String ,  // "/"
  category:String   //"/electronics"
  
}, { versionKey: false });

module.exports = mongoose.model('items', userschema);
  
/*
MONGO-DB QUERY FORMAT FOR CATEGORIES
db.categories.insert([{
    "name": "electronics"
  , "parent": "/"
  , "category": "/electronics"
}, {
    "name": "mobiles"
  , "parent": "/electronics"
  , "category": "/electronics/mobiles"
}, 
{
    "name": "laptops"
  , "parent": "/electronics"
  , "category": "/electronics/laptops"
},
{
    "name": "mens"
  , "parent": "/"
  , "category": "/mens"
}, {
    "name": "footwear"
  , "parent": "/mens"
  , "category": "/mens/footwear"
},
{
    "name": "women"
  , "parent": "/"
  , "category": "/women"
},
{
    "name": "footwear"
  , "parent": "/"
  , "category": "/women/footwear"
}]);
*/