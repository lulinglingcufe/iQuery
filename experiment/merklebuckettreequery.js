// const buf = Buffer.from('runoob', 'ascii');
//
// const buf2 = Buffer.from('abc', 'ascii');
// // 输出 72756e6f6f62
// console.log(buf);
// console.log(buf2);
//
// console.log(buf.compare(buf2)); //返回一个数字，表示 buf 在 otherBuffer 之前，之后或相同。
//

var buckets = require('buckets-js');
var a = new buckets.Set();
var b = new buckets.Set();
// a.add("sdsd");
// a.add("asdsd");
// b.add("sdsd");
// b.add("asdsd");

console.log("This is a！:"+ a.equals(b));
var sizeof = require('object-sizeof');
console.log(sizeof(a));

const stringRandom = require('string-random');

console.log(sizeof(stringRandom(100)));
console.log(stringRandom(100));
var buf1 = new Buffer.from(stringRandom(100))
console.log('randomString byte: '+buf1.length) //输出字节数

var testdata1 = [];
const records_num = 10000;
for(var i=0;i<records_num;i++){
    testdata1.push(stringRandom(300));
}



console.time('maketree');
for(var i=0;i<records_num;i++){
a.add(testdata1[i]);
}
console.timeEnd('maketree');

console.log(sizeof(a));

console.time('maketreeT');
console.log("This is a！:"+ a.equals(b));
console.timeEnd('maketreeT');
