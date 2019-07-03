var express = require('express');
var router = express.Router();
var products = require('../models/products.js');
var register = require('../models/register');


router.get('/products/:id', function (req, res) {

    console.log("Products get one called");
    products.find({ _id: req.params.id }, function (err, result) {

        if (err) console.log(err);


        console.log(result);

        res.send(JSON.stringify(result));
    });
});

router.post('/products', function (req, res) {
    console.log("save called");
    console.log(req.query.id);
    register.findOne({ $and: [{ _id: req.query.id }, { token: req.query.token }] }, function (err, result) {
        if (err)
            res.status(500).send(err);
        if (!result) {
            return res.status(403).send({ message: 'Token Not Applicable' });
        }


        if (req.body.data == undefined || req.body.data == null) {
            res.status(400).send("Bad Request");
        }
        else {
            var data = new products({

                "description": req.body.data.description,
                "name": req.body.data.item_name,
                "lname": req.body.data.item_name.toLowerCase(),
                "category": req.body.data.category,
                "price": req.body.data.price,
                "brand_id": req.body.data.brand_id,
                "brand_name": req.body.data.brand_name.toLowerCase(),
                "assets": {
                    "imgs":
                        req.body.data.imgs      //array object
                },
                "shipping": {
                    "dimensions": {
                        "height": req.body.data.item_height,
                        "length": req.body.data.item_length,
                        "width": req.body.data.width
                    },
                    "weight": req.body.data.item_weight
                },
                "specs":

                    req.body.data.specs,        //array object
                "attributes":

                    req.body.data.attributes    //arrayobject
                ,
                "price": req.body.data.price,

                "variants": req.body.data.variants,      //arrayobject

                "color": req.body.data.color.toLowerCase(),

                "lastUpdated": new Date()

            });

            data.save(function (err, result) {
                console.log('Executing Save Query');
                if (err) console.log(err);

                console.log(result);
                res.status(200).send({ message: "Success" });
            });
        }
    });

});

router.get('/products', function (req, res) {

    console.log('req.query is:');
    console.log(req.query);

    if (req.query.token != 'null' && req.query.id != 'null') {
        register.findOne({ $and: [{ _id: req.query.id }, { token: req.query.token }] }, function (err, result) {

            if (err && req.query.token == null && req.query.id == null)
                return res.status(403).send({ message: 'Not Authorized to access data' });
            console.log(result);
            if (!result) {
                return res.status(403).send({ message: 'Token Not Applicable' });
            }

            if (req.query.filter) {


                var filters = JSON.parse(req.query.filter);     //to be used only where there is no range
                //     for(let i=0;i<filters.length;i++){
                //         console.log("LOOp Running");
                //         if(filters[i].category){
                //         console.log("CATEGORY IS HERE");
                //         console.log(filters[i].category);
                //     }
                // }


            }
            if (req.query.range) {
                let range_str = req.query.range;
                var range1 = range_str.substr(1, range_str.length - 2);
                range1 = JSON.parse(range1);                    //Range without [],to be used with FILTER AND RANGE

                var range = JSON.parse(req.query.range);    //to be used where no filter used

            }

            if (req.query.page) {
                var pageNumber = req.query.page;
            }
            if (req.query.limit) {

                var limit = req.query.limit;
            }
            var query;
            if (req.query.sort) {
                var sort = JSON.parse(req.query.sort);
            }
            var page = (pageNumber > 0 ? ((pageNumber - 1) * limit) : 0);


            if (!filters && !sort && !range) {
                console.log('Filter: NO, Sort: NO, Get All');
                query = products.find({}).skip(page).limit(limit);
            }
            else if (filters && sort && !range) {
                console.log('Filter: Yes, Sort: Yes, Range: No');

                query = products.find({ $and: filters }).sort(sort).skip(page).limit(limit);
            }
            else if (!filters && sort && !range) {
                console.log("Sort: YES, Filter: NO, Range:NO");
                console.log(sort);
                query = products.find({}).sort(sort).skip(page).limit(limit);
            }
            else if (filters && !sort && !range) {
                console.log("Sort: NO, Filter: Yes,Range: No");
                console.log(filters);
                query = products.find({ $and: filters }).skip(page).limit(limit);

            }
            else if (!filters && range && !sort) {
                console.log("No Filter, No Sort, Range: Yes")
                query = products.find({ $and: range }).skip(page).limit(limit);
            }
            else if (filters && range && !sort) {
                console.log("Filter: YES, Range: Yes, Sort: No")
                let filters_str = req.query.filter;
                let filters1 = filters_str.substr(1, filters_str.length - 2);
                filters1 = JSON.parse(filters1);  //FILTER without [],to be used with FILTER AND RANGE


                /*
                FORMAT FOR USING AND:
                find({ $and: [{"color":"Black"} ,  { price: { '$gt': 55000 } } ]});  */

                query = products.find({ $and: [filters1, range1] }).skip(page).limit(limit);
            }
            else if (range && sort && !filters) {

                console.log("Sort: YES, Filter: NO, Range:Yes");
                console.log(sort);
                query = products.find({ $and: range }).sort(sort).skip(page).limit(limit);
            }
            else if (sort && filters && range) {
                console.log("Sort: YES, Filter: YES, Range:Yes");
                let filters_str = req.query.filter;
                let filters1 = filters_str.substr(1, filters_str.length - 2);
                filters1 = JSON.parse(filters1);        //FILTER without [],to be used with FILTER AND RANGE

                query = products.find({ $and: [filters1, range1] }).sort(sort).skip(page).limit(limit);
            }

            query.exec(function (err, docs) {
                console.log(err);
                if (err) {
                    console.log(err);
                    res.status(500).send({ error: err });
                }
                // console.log(query);
                if (!docs) {
                    return res.send(404, 'No data was found');
                }
                // console.log("Here are Docs_____")
                // console.log(docs);
                return res.status(200).send({products:docs});
            });

        });
    }
    else if (req.query.token == 'null' && req.query.id == 'null') {
        return res.status(403).send({ message: 'Not Authorized to access data' });
    }
    else {
        return res.status(403).send({ message: 'Not Authorized to access data' });
    }
});

router.put('/products', function (req, res) {
    console.log('Update Api for Products Called');
    console.log(req.query);

    register.findOne({ $and: [{ _id: req.query.id }, { token: req.query.token }] }, function (err, result) {
        if (err)
            res.status(500).send(err);
        if (!result) {
            return res.status(403).send({ message: 'Token Not Applicable' });
        }

        if (req.body.data == undefined || req.body.data == null) {
            return res.status(400).send('No Body received');
        }
        products.findById(req.body.data._id, function (err, result) {
            if (err)
                res.status(500).send(err);
            if (!result) {
                return res.status(404).send('record not found');
            }

            if (req.body.data.item_name) { result.name = req.body.data.item_name }
            if (req.body.data.item_name) { result.lname = req.body.data.item_name.toLowerCase() }
            if (req.body.data.category) { result.category = req.body.data.category.toLowerCase() }
            if (req.body.data.description) { result.description = req.body.data.description }
            if (req.body.data.price) { result.price = req.body.data.price }
            if (req.body.data.brand_id) { result.brand_id = req.body.data.brand_id }
            if (req.body.data.brand_name) { result.brand_name = req.body.data.brand_name.toLowerCase() }
            if (req.body.data.imgs) { result.assets = req.body.data.imgs }
            if (req.body.data.item_height) { result.height = req.body.data.item_height }
            if (req.body.data.item_length) { result.length = req.body.data.item_length }
            if (req.body.data.item_width) { result.width = req.body.data.item_width }
            if (req.body.data.item_weight) { result.weight = req.body.data.item_weight }
            if (req.body.data.specs) { result.specs = req.body.data.specs }
            if (req.body.data.attributes) { result.attributes = req.body.data.attributes }
            if (req.body.data.price) { result.color = req.body.data.price }
            if (req.body.data.color) { result.color = req.body.data.color.toLowerCase() }
            if (req.body.data.variants) { result.variants = req.body.data.variants }
            result.lastUpdated = new Date();
            result.save(function (err, result1) {
                console.log('Executing Update Query');

                if (err) res.status(500).send(err);

                return res.status(200).send(result1);
            });
        });
    });

});
router.delete('/products/:id', function (req, res) {

    console.log('Delete Api for Items Called');
    console.log(req.query);
    if (req.query.token && req.query.id) {
        register.findOne({ $and: [{ _id: req.query.id }, { token: req.query.token }] }, function (err, result) {
            if (err)
                res.status(500).send(err);
            if (!result) {
                return res.status(403).send({ message: 'Token Not Applicable' });
            }

            if (req.params.id == undefined || null) {
                res.status(400).send("Bad Request");

            }
            else {
                products.findOne({_id:req.params.id},function(err,result){
                    if(!result)
                    res.status(404).send({ success: false });
                    else
                    products.deleteOne({ _id: req.params.id }, function (err, result) {

                        if (err) console.log(err);
                        console.log(result);
                      
                        res.status(200).send({ success: true });
                    });
                })
              
            }
        });
    }
    else {
        return res.status(400).send({ message: 'Bad Token' });
    }

});

module.exports = router;
