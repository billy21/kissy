KISSY.add(function(S){
    var module=this;
    cjs_test.push(2);
    var b=module.require('./b');
    cjs_test.push(4);
    var c=module.require(1>2?'./c':'');
    cjs_test.push(6);
    module.exports=b+1;
});