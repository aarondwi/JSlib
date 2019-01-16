'use strict'
class endpoint{
    constructor(){
        this.urls={}
        this.method=['GET','POST','PUT','DELETE','HEAD','OPTIONS','TRACE','CONNECT','PATCH']

        this.method.forEach(element=>{
            //creating an empty array for each method
            this.urls[element]=[]
            //function to put callback according to url passed
            this[element.toLowerCase()]=(tpl,callback)=>{
                this.urls[element].push(this.makeLayer(tpl,callback))
                return this
            }
        })
    }
    makeLayer(tpl,callback){
        /*
         *rgx:the regexp used to compare with req.url
         *data:the position of params
         *callback:function to be executed when the rgx match
         */
        let newarr={
            data:[],
            rgx:null,
            callback
        }
        //replace all <data>, with RegExp,then save each 'data'
        let newTpl=tpl.toString().replace(new RegExp('<(.+?)>','g'),(data)=>{
            newarr.data.push({
                name:data.slice(1,-1).trim(),
                pos:-1
            })
            return '(.+?)'
        })
        newarr.rgx=new RegExp(newTpl)
        //save the pos of each params
        let byslash=newTpl.split('/')
        for(let i=0,cnt=0;i<byslash.length;i++){
            if(byslash[i]==='(.+?)')
                newarr['data'][cnt++]['pos']=i
        }
        
        return newarr
    }
    handle(req,res,num=0){
        //reach the end of arr,return result to client
        if(num>=this.urls[req.method].length){
            res.end()
            return
        }
        req.params=req.params || {}

        for(let i=num;i<this.urls[req.method].length;i++){
            let current=this.urls[req.method][i]

            if(req.url.match(current.rgx)){
                //save the data to corresponding params' position
                let byslash=req.url.split('/')
                for(let d of current.data)
                    req.params[d.name]=byslash[d.pos]

                //++i for next(),as it has to start right after this path
                current.callback(req,res,this.handle.bind(this,req,res,++i))
                return//don't continue this traversal
            }
        }
    }
}
module.exports=endpoint