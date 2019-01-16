'use strict'
const OPTIONAL=0
const REQUIRED=1
const UNLIMITED=-1

class ArgParse{
    constructor(){
        this.innerArgs=[]
        this.innerOpts=[]
        this.args=[]
        this.opts=[]
    }
    /*
     *Argument is those without identifier
     *Put before any option when using
     *Example: 127.0.0.1
     *NO argument IS optional
     */
    addArgument(name,dsc){
        this.innerArgs.push({name,dsc})
        return this
    }
    /*
     *Option is those with identifier
     *Example: add 'android'
     */
    addOption(name,dsc,num=1,req=OPTIONAL){
        if(num==0 || num<-1){
            console.log('Error when creating options: '+name)
            console.log('num should be more than or equal to 1 or UNLIMITED')
            process.exit(0)
        }
        this.innerOpts.push({name,dsc,num,req})
        return this
    }
    /*
     *parse all data
     *from innerArgs => args
     *from innerOpts => opts
     *Opts are checked for its requirement(OPTIONAL/REQUIRED)
     */
    parse(arr){
        //for help command
        if(arr.indexOf('help')!=-1){
            this.showHelp()
            process.exit(0)
        }

        //removing 'node' and filename
        arr=process.argv.slice(2)

        let pos=0

        //getting all ARGUMENTS
        //doesn't have to be in order when calling the program
        for(let arg of this.innerArgs)
            this.args[arg.name]=arr[pos++]
        arr.splice(0,this.innerArgs.length)
        
        //getting all OPTIONS
        for(let opt of this.innerOpts){
            pos=arr.indexOf(opt.name)

            //REQUIRED option should exist
            if(pos==-1 && opt.req==REQUIRED){
                console.log("Required Option ["+opt.name+"] Not Found")
                process.exit(0)
            }
            //not REQUIRED and not passed
            else if(pos==-1) continue

            //if exists, save it into this.opts
            //UNLIMITED opts, should be used as the last option
            if(opt.num==-1) this.opts[opt.name]=Object.assign([],arr.slice(1))
            else{
                ///////////////////////////////////////////////////////
                // code below still need lot of checking
                // if num is 1 -> just add the data
                // more than 1 -> create array to hold all of it
                // insufficient parameter passed checking need to be better than this code below
                ///////////////////////////////////////////////////////
                // bound checking the given input array
                if(pos + opt.num < arr.length){
                    if(opt.num==1){
                        this.opts[opt.name]=arr[pos+1]
                        arr.splice(pos,2)
                    }
                    else{
                        //create array to hold multi value data
                        this.opts[opt.name]=[]
                        for(let i=1;i<=opt.num;i++)
                            this.opts[opt.name].push(arr[pos+i])
                        
                        arr.splice(pos,opt.num+1)
                    }
                }
                //even though optional, should be passed with correct number of argument
                else{
                    console.log('Parameter passed to Option \''+opt.name+'\' not sufficient')
                    process.exit(0)
                }
                ///////////////////////////////////////////////////////
            }
        }
        return this
    }
    showHelp(cmd=''){
        console.log("Usage:")
        console.log("    help: Show this message and exit ")

        console.log("\nArguments: ")
        for(let arg of this.innerArgs)
            console.log("    "+arg.name+": "+arg.dsc)
            
        console.log("\nOptions: ")
        for(let opt of this.innerOpts){
            let tobeprinted="    "+opt.name
            if(opt.num==-1)
                tobeprinted+='  [UNLIMITED]  '
            else if(opt.num>1)
                tobeprinted+='  ['+opt.num+']  '
            tobeprinted+=": "+opt.dsc
            if(opt.req===REQUIRED)
                tobeprinted+="   [REQUIRED]"
            console.log(tobeprinted)
        }
    }
}

module.exports.ArgParse=ArgParse
module.exports.OPTIONAL=OPTIONAL
module.exports.REQUIRED=REQUIRED
module.exports.UNLIMITED=UNLIMITED