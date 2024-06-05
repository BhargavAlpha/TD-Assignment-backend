const {allTasks,pendingTasks,updateTaskStatus} = require('../services/mentor');

exports.allTasks=(req,res)=>{
    allTasks(req,res)
    .then(result=>res.status(result.statuscode).json(result.response))
    .catch(err=>res.status(500).json(err))
}
exports.pendingTasks=(req,res)=>{
    pendingTasks(req,res)
    .then(result=>res.status(result.statuscode).json(result.response))
    .catch(err=>res.status(500).json(err))
}
exports.updateTaskStatus=(req,res)=>{
    updateTaskStatus(req,res)
    .then(result=>res.status(result.statuscode).json(result.response))
    .catch(err=>res.status(500).json(err))
}

