const beneFiciaries = require("../model/beneficiary.model")
const Sheets = require("../model/sheet.model")
const User = require("../model/user.model");
module.exports = (express) => {
  api = express.Router();

  api.get("/", async (req, res) => {

    //Summary
    let userCount = await User.find().count()
    let SheetsCount = await Sheets.find().count()
    let beneTotal = await beneFiciaries.find().count()
    let benePaid = await beneFiciaries.find({ status: "paid" }).count()
    let beneVerified = await beneFiciaries.find({ status: "awaiting payment" }).count()
    let beneMale = await beneFiciaries.find({ gender: "Male" }).count()
    let beneFemale = await beneFiciaries.find({ gender: "Female" }).count()
    let single = await beneFiciaries.find({ maritalStatus: "single" }).count()
    let married = await beneFiciaries.find({ maritalStatus: "married" }).count()
    let widowed = await beneFiciaries.find({ maritalStatus: "widowed" }).count()
    let divorced = await beneFiciaries.find({ maritalStatus: "divorced" }).count()
    let states = await beneFiciaries.find().distinct('state')

    //geo politacal zones summary
    let northEast = await beneFiciaries.find({
      $or: [{ state: "adamawa" }, { state: "bauchi" }, { state: "borno" }, { state: "gombe" }, { state: "taraba" }, { state: "yobe" }]
    }).count()
    let northWest = await beneFiciaries.find({
      $or: [{ state: "jigawa" }, { state: "kaduna" }, { state: "kano" }, { state: "katsina" }, { state: "Kebbi" }, { state: "sokoto" }, { state: "zamfara" }]
    }).count()
    let northCentral = await beneFiciaries.find({
      $or: [{ state: "benue" }, { state: "kogi" }, { state: "kwara" }, { state: "nasarawa" }, { state: "niger" }, { state: "plateau" }, { state: "abuja" }]
    }).count()
    let southWest = await beneFiciaries.find({
      $or: [{ state: "ekiti" }, { state: "lagos" }, { state: "ogun" }, { state: "ondo" }, { state: "osun" }, { state: "oyo" },]
    }).count()
    let southEast = await beneFiciaries.find({
      $or: [{ state: "abia" }, { state: "anambra" }, { state: "ebonyi" }, { state: "enugu" }, { state: "imo" },]
    }).count()
    let southSouth = await beneFiciaries.find({
      $or: [{ state: "akwa-ibom" }, { state: "bayelsa" }, { state: "cross-river" }, { state: "delta" }, { state: "edo" }, { state: "rivers" }]
    }).count()


    let northEastPaid = await beneFiciaries.find({
      $or: [{ state: "adamawa" }, { state: "bauchi" }, { state: "borno" }, { state: "gombe" }, { state: "taraba" }, { state: "yobe" }]
      , $and: [{ status: "paid" }]
    }).count()
    let northWestPaid = await beneFiciaries.find({
      $or: [{ state: "jigawa" }, { state: "kaduna" }, { state: "kano" }, { state: "katsina" }, { state: "Kebbi" }, { state: "sokoto" }, { state: "zamfara" }]
      , $and: [{ status: "paid" }]
    }).count()
    let northCentralPaid = await beneFiciaries.find({
      $or: [{ state: "benue" }, { state: "kogi" }, { state: "kwara" }, { state: "nasarawa" }, { state: "niger" }, { state: "plateau" }, { state: "abuja" }]
      , $and: [{ status: "paid" }]
    }).count()
    let southWestPaid = await beneFiciaries.find({
      $or: [{ state: "ekiti" }, { state: "lagos" }, { state: "ogun" }, { state: "ondo" }, { state: "osun" }, { state: "oyo" },]
      , $and: [{ status: "paid" }]
    }).count()
    let southEastPaid = await beneFiciaries.find({
      $or: [{ state: "abia" }, { state: "anambra" }, { state: "ebonyi" }, { state: "enugu" }, { state: "imo" },]
      , $and: [{ status: "paid" }]
    }).count()
    let southSouthPaid = await beneFiciaries.find({
      $or: [{ state: "akwa-ibom" }, { state: "bayelsa" }, { state: "cross-river" }, { state: "delta" }, { state: "edo" }, { state: "rivers" }]
      , $and: [{ status: "paid" }]
    }).count()


    async function getStates () {
      const statesStats = []
      console.log(states)
      for (const state of states) {
        let total = await beneFiciaries.find({state:state}).count()
        const totalPaid = await beneFiciaries.find({status:"paid"},{state:state}).count()
        statesStats.push({
          [state]:{
            totalPaid,
            total
          }
        })
      }
      return statesStats
    }
    getStates().
    then(res=>{
      console.log(res)
    })
    
    let stats = {
      total: beneTotal,
      paid: benePaid,
      verified: beneVerified,
      perTotal: Math.floor((100 / beneTotal) * benePaid),
      perVerified: (100 / beneTotal) * beneVerified,
      male: beneMale,
      female: beneFemale,
      userCount,
      SheetsCount,
      zones: {
        northEast,
        northWest,
        northCentral,
        southWest,
        southEast,
        southSouth
      },
      maritalStatus: {
        single,
        married,
        widowed,
        divorced
      },
      psp: {
        unified: {
          total: northEast + southEast,
          paid: southEastPaid + northEastPaid
        },
        visualICT: {
          total: northWest + southEast,
          paid: southSouthPaid + northEastPaid
        },
        upperLink: {
          total: northCentral + southEast,
          paid: southWestPaid + northEastPaid
        }
      },
      zonesPaid: {
        northEastPaid,
        northWestPaid,
        northCentralPaid,
        southWestPaid,
        southEastPaid,
        southSouthPaid
      },
      ageGroup: {
        18: "hh"
      }

    }
    return res.status(200).json(stats);
  })
  api.get("/psp", async (req, res) => {
    let beneTotal = await beneFiciaries.find({ company: req.user.company }).count()
    let benePaid = await beneFiciaries.find({ company: req.user.company }, { status: "paid" }).count()
    let userCount = await User.find({ company: req.user.company }).count()


    let stats = {
      beneTotal,
      userCount,
      benePaid
    }

    return res.status(200).json(stats);
  })
  return api
}