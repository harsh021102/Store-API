const Product = require('../models/product')


const getAllProductsStatic = async (req,res) => {
    const products = await Product.find({
        name: '2',
    })
    res.status(200).json({products, nbHits:products.length})
}
const getAllProducts = async (req,res) => {
    // console.log(req.query);
    const { featured,company,search } = req.query
    const queryObject = {}
    if(featured)
    {
        queryObject.featured = featured === 'true'?true:false;
    }
    if(company)
    {
        queryObject.featured = company
    }
    if(search)
        queryObject.featured = search

    console.log(queryObject);
    const products = await Product.find(req.query)
    res.status(200).json({products, nbHits:products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}