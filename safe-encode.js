let HTMLEncode=(unsafe)=>{
    return unsafe.toString().replace(/./gm,e=>{
        return '&#'+e.charCodeAt(0)+';'
    })
}
let HTMLDecode=(str)=>{
    return (str+"").toString().replace(/&#\d+;/gm,s=>{
        return String.fromCharCode(s.match(/\d+/gm)[0])
    })
}
let HexEncode=(unsafe)=>{
    return unsafe.toString().replace(/./gm,e=>{
        return '\\x'+e.charCodeAt(0).toString(16)
    })
}
let HexDecode=(str)=>{
    return (str+"").toString().replace(/\\x([0-9a-zA-Z]{2})/gm,function(){
        return String.fromCharCode(parseInt(arguments[1],16))
    })
}
module.exports.HTMLEncode=HTMLEncode
module.exports.HTMLDecode=HTMLDecode
module.exports.HexEncode=HexEncode
module.exports.HexDecode=HexDecode