const Product = require('../models/product')


const getAllProductsStatic = async (req,res) => {
    const products = await Product.find({price: {$gt: 30}})
    .sort('price')
    .select('price') 
    // .limit(7)
    // .skip(3)

    // .skip(3)- skips first 3 elements

    // const products = await Product.find({}).select('name price') use d to select some specific fields
    // name: {$regex: search, $options: 'i'} //options i means case insensitive
    res.status(200).json({nbHits:products.length,products})
}
const getAllProducts = async (req,res) => {
    // console.log(req.query);
    const { featured,company,name, sort, fields, numericFilters } = req.query
    const queryObject = {}
    if(featured)
    {
        queryObject.featured = featured === 'true'?true:false;
    }
    if(company)
    {
        queryObject.company = company
    }
    if(name)
    {
        // console.log(name);
        queryObject.name = {$regex: name, $options: 'i'}
    }
    if(numericFilters)
    {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        } 
        const regEx = /\b(<|<=|=|>|>=)\b/g
        let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)

        const options = ['price','rating']
        filters = filters.split(',').forEach((item)=>{
            const [field,operator,value] = item.split('-')
            // console.log(filters);
            if(options.includes(field))
            {
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    console.log(queryObject);
    let result = Product.find(queryObject)
    //sort
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createAt')
        //if no value is specified then it will be sorted accordng to createdAt field
    }

    if(fields)
    {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit;
    result = result.skip(skip).limit(limit)
    const products = await result
    res.status(200).json({products, nbHits:products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}