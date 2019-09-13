exports.random = (min,max)=>{
    return Math.floor(Math.random() * (max-min+1) + min);
}

exports.sleep = async (ms) =>{
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,ms)
    })
}