const jwt=require('jwt-simple')
const config=require('./config')
let checkToken=(req,res,next)=>{
    let token=req.headers['authorization']
    
}