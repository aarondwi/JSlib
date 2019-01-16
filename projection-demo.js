const http = require('http')
const fs = require('fs')
const qs=require('querystring')
const Project=require('./projection')
const zlib=require('zlib')

const template = `
<p style='color:red'>Hello, my name is <# name #>. I\'m <# age #> years old. Hate <# haiz #></p>
My skills:
<# if (showSkills) { #>
    <# for (let x of skills) {#>
        <# for (let y of x) { #>
            <a href="#"><#y#></a>
        <# } #>
    <# } #>
<#} else {#>
    <p>none</p>
<#}#>
`
//404 response
function sendErr(res) {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.write("Error 404: Page not found")
    res.end()
}

http.createServer((req, res) => {
    let acceptEncoding = req.headers['accept-encoding'];
    if (req.method == 'GET' && req.url=='/') {
        if (/\bdeflate\b/.test(acceptEncoding)) {
            console.log('@ deflate')
            res.writeHead(200, { 'Content-Encoding': 'deflate' });
            zlib.deflate(Project(template,{
                name: "<script>alert('hacked!')</script>",
                age: 29,
                haiz:'aloha',
                skills: [
                    [10,`<script>alert('hacked!')</script>`],
                    [30,40]
                ],
                showSkills: true
            }),(err,buff)=>{
                res.write(buff)
                res.end()
            })
        }
        else if (/\bgzip\b/.test(acceptEncoding)) {
            console.log('@ gzip')
            res.writeHead(200, { 'Content-Encoding': 'gzip' });
            zlib.gzip(Project(template,{
                name: "<script>alert('hacked!')</script>",
                age: 29,
                haiz:'aloha',
                skills: [
                    [10,`<script>alert('hacked!')</script>`],
                    [30,40]
                ],
                showSkills: true
            }),(err,buff)=>{
                res.write(buff)
                res.end()
            })
        }
        else{
            res.writeHead(200, { "Content-Type": "text/html"})
            res.write(Project(template,{
                name: "<script>alert('hacked!')</script>",
                age: 29,
                haiz:'aloha',
                skills: [
                    [10,`<script>alert('hacked!')</script>`],
                    [30,40]
                ],
                showSkills: true
            }))
            res.end()
        }
    }
    else sendErr(res)
}).listen(15026,()=>console.log('running at port 15026'))