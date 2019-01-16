//Example of using Order.js
const { ArgParse, REQUIRED, OPTIONAL, UNLIMITED}=require('./argparse')
let ord=new ArgParse()
ord
    .addArgument('fr1','friend1')
    .addArgument('fr2','friend2')
    //.addOption('name','the file name',4,REQUIRED)
    .addOption('age','your age')
    .addOption('weight','your weight',2,OPTIONAL)
    //UNLIMITED OPTION should be used as the last one
    //as it takes all the remaining data
    .addOption('many','unlimited argument here',UNLIMITED)
    .parse(process.argv)
console.log(ord.opts)
console.log(ord.args)

/*
node .\argparse-demo.js aloha 'eaea' age 10 name 'aaron dwi' 'bama bil' name1 name2 many opt1 opt2 opt3 opt4 opt5 opt6 weight 10 20

//prints:
[ name: [ 'aaron dwi', 'bama bil', 'name1', 'name2' ],
  age: '10',
  weight: [ '10', '20' ],
  many: [ 'opt1', 'opt2', 'opt3', 'opt4', 'opt5', 'opt6' ] ]
[ fr1: 'aloha', fr2: 'eaea' ]
*/