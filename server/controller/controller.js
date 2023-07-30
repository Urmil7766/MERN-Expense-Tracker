const model = require('../model/model');

//post:http://localhost:8080/api/categories
async function create_Categories(req, res){
    const Create = new model.Categories({
        type: "Investment",
        color: "#FCBE44",   

    })

    Create.save()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return res.status(400).json({ message: `Error while creating categories ${err}` });
    });
}


//get:http://localhost:8080/api/categories
async function  get_Categories(req, res){
  let data = await model.Categories.find({})

  let filter = await data.map(v => Object.assign({}, { type: v.type, color: v.color}));
    return res.json(filter);
}

//  post: http://localhost:8080/api/transaction
async function create_Transaction(req, res) {
  if (!req.body) return res.status(400).json("Post HTTP Data not Provided");
  let { name, type, amount } = req.body;

  try {
    const create = new model.Transaction({
      name,
      type,
      amount,
      date: new Date(),
    });

    await create.save();
    return res.json(create);
  } catch (err) {
    return res.status(400).json({ message: `Error while creating transaction ${err}` });
  }
}


  //  get:http://localhost:8080/api/transaction
  async function get_Transaction(req, res){
    let data = await model.Transaction.find({});
    return res.json(data);
}

//  delete: http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
  if (!req.body) return res.status(400).json({ message: "Request body not Found" });

  try {
    await model.Transaction.deleteOne(req.body);
    res.json("Record Deleted...!");
  } catch (err) {
    res.json("Error while deleting Transaction Record");
  }
}

// get:http://localhost:8080/api/labels
async function get_Labels(req, res){

  model.Transaction.aggregate([
      {
          $lookup : {
              from: "categories",
              localField: 'type',
              foreignField: "type",
              as: "categories_info"
          }
      },
      {
          $unwind: "$categories_info"
      }
    ]).then(result => {
      let data = result.map(v => Object.assign({}, { _id: v._id, name: v.name, type: v.type, amount: v.amount, color: v.categories_info['color']}));
      res.json(data);
    }).catch(error => {
      res.status(400).json("Looup Collection Error");
    });



  }












module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
}