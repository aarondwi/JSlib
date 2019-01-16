//Based on: 
//1. https://johnresig.com/blog/javascript-micro-templating/
//2. http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
const { HTMLEncode } = require('./safe-encode')
let Project = (tpl, data)=> {
    let re = /<#(.+?)#>/g,code = 'let r=[];',cursor = 0, match,
        reExp = /^\s?(if|for|else|switch|case|break|{|})(.)*/g
    let add=(line,js=false)=>{
        //true means js is passed, not normal-string
        if(js){
            /*
             *Adding 'data.' to all variable
             *This is intended to abstract
             *the implementation from outside user
             */
            for(let key of Object.keys(data))
                line=line.replace(new RegExp(key, 'g'), 'data.'+key)
            
            //Put the line directly if it is a control-statement
            //else add line to string wrapped in HTMLEncode function, preventing XSS
            code += line.match(reExp)? line : 'r.push(HTMLEncode(' + line.toString() + '));'
        }
        else code += 'r.push("' + line.replace(/"/g, '\\"').replace(/\'/g, '\\\'') + '");'
    }
    while(match = re.exec(tpl)) {
        /*
         *The first add call to put the string-only data
         *The second call to add js part
         */
        add(tpl.slice(cursor, match.index))
        add(match[1], true)
        cursor = match.index + match[0].length
    }
    add(tpl.substr(cursor, tpl.length - cursor))
    code += 'return r.join("");'
	return new Function(['data','HTMLEncode'],code.replace(/[\r\t\n]/g, ''))(data,HTMLEncode)
}
module.exports=Project