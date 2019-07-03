router.get('/products', function (req, res) {

    console.log('req.query is:');
    console.log(req.query);

    /*  FOR AUTHENTICATION
    if (req.query.token!='null' && req.query.id!='null') {
    register.findOne({ $and: [{ _id: req.query.id }, { token: req.query.token }] },function (err, result) {

    if (err && req.query.token==null && req.query.id==null)
    return res.status(403).send({ message: 'Not Authorized to access data' });
    if (!result) {
        return res.status(403).send({ message: 'Token Not Applicable' });
    }   
     */

    if (req.query.filter) {

        var filters = JSON.parse(req.query.filter);     //to be used only where there is no range


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
        return res.status(200).send(JSON.stringify(docs));
    });
});