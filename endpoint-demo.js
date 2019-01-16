const http=require('http')
const endpoint=require('./endpoint')
const cluster=require('cluster')
const numCPUs = require('os').cpus().length

let app=new endpoint()
app
    .get('/api/food/<aloha>',(req,res,next)=>{
        res.write(`aloha:${req.params['aloha']}`)
        res.end('')
    })
    .get('/api/food',(req,res,next)=>{
        res.write('ya')
        res.end('')
    })
    .get('/',(req,res,next)=>{
        res.write('tidak')
        res.end('')
    })
http.createServer((req,res)=>app.handle(req,res)).listen(15026)
    /*.get('/api/food/<aloha2>/<id>',(req,res,next)=>{
        res.write(req.params['aloha']+'   '+req.params['aloha2']+'   '+req.params['id']+'<br/>')
        res.end('@ testing 2')
    })
    .get('\/?.*',(req,res,next)=>res.end('end @ testing 4<br/>'))*/

// if (cluster.isMaster){
//     console.log("hello")
//     for(let i=0;i<numCPUs;i++){
//         console.log('forking: '+(i+1))
//         cluster.fork()
//     }
//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} died`);
//     })
// }
// else{

//     let app=new endpoint()
//     app
//         .get('/api/food/<aloha>',(req,res,next)=>{
//             res.write(`aloha:${req.params['aloha']}`)
//             res.end('')
//         })
//         .get('/api/food',(req,res,next)=>{
//             res.write('ya')
//             res.end('')
//         })
//         .get('/',(req,res,next)=>{
//             res.write('tidak')
//             res.end('')
//         })
//     http.createServer((req,res)=>app.handle(req,res)).listen(15026)
// }
