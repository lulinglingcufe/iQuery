const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const leaves = ['k', 's', 'g','s'].map(x => SHA256(x));
const tree = new MerkleTree(leaves, SHA256);

const root = tree.getRoot()
console.log("This is root hex！");
console.log(root.toString('hex'))
console.log("This is Layers！");
console.log(tree.getLayers())
MerkleTree.print(tree)
var myLayers = tree.getLayers();
console.log(myLayers.length)

const leaves2 = ['a', 'b', 'c','d'].map(x => SHA256(x));
const tree2 = new MerkleTree(leaves2, SHA256);

const root2 = tree.getRoot()
console.log("This is root hex！");
console.log(root2.toString('hex'))
console.log("This is Layers！");
console.log(tree2.getLayers())
var myLayers2 = tree2.getLayers();


//下面这个函数用不上
function find_child_node(node_floor,node_po) {
    //node_floor 是在数组中的层数
    //node_po 是在该层的位置
    //要首先确保有子节点存在，不是叶子节点
    var child_num;
    child_num = myLayers[node_floor-1].length - node_po*2;

    //一个孩子，还是两个孩子呢？
    if (child_num <2){
        //一个孩子
        var child_po = node_po*2;
        return child_po

    }{
        //两个孩子
        var child_po = node_po*2;
        var child_po_list = [];
        child_po_list.push(child_po);
        child_po_list.push(child_po+1);
        return child_po_list
    }


}


const myLayers_len = myLayers.length;
//初始化两个参数
var node_floor = myLayers_len-1;
var node_po = 0;
console.log("##########################:")
console.time('maketree');
find_diff_nodes(node_floor,node_po);

console.timeEnd('maketree');
//已经是不同的节点了，再继续找下去
function find_diff_nodes(node_floor,node_po) {
    //node_floor 是在数组中的层数
    //node_po 是在该层的位置
    //如果是叶子节点，直接打印

    //测试

    console.log("This is node_floor:")
    console.log(node_floor)
    console.log("This is node_po:")
    console.log(node_po)

    if(node_floor == 0){
        console.log("different po: d%",node_po);
    }else{
        //不是叶子节点
        if(Is_two_child(node_floor,node_po)){
            //如果有两个孩子
            if(!If_same_nodes(node_floor-1,node_po*2)){
                console.log("如果有两个孩子 node_floor-1:")
                console.log(node_floor-1)
                console.log(node_po*2)
                find_diff_nodes(node_floor-1,node_po*2);
            }
            if(!If_same_nodes(node_floor-1,node_po*2+1)){
                console.log("如果有两个孩子2 node_floor-1:")
                console.log(node_floor-1)
                console.log(node_po*2+1)
                find_diff_nodes(node_floor-1,node_po*2+1);
            }
        }else{
            //如果有1个孩子
            if(!If_same_nodes(node_floor-1,node_po*2)){
                console.log("如果有1个孩子 node_floor-1:")
                console.log(node_floor-1)
                find_diff_nodes(node_floor-1,node_po*2);
            }
        }
    }
}

//两个节点是否相同
function If_same_nodes(node_floor,node_po) {
    //node_floor 是在数组中的层数
    //node_po 是在该层的位置
    if(myLayers[node_floor][node_po].compare(myLayers2[node_floor][node_po]) == 0){
        return true;
    }else{
        return false;
    }
}


//节点是否有两个子节点
function Is_two_child(node_floor,node_po) {
    //node_floor 是在数组中的层数
    //node_po 是在该层的位置
    //要首先确保有子节点存在，不是叶子节点

    //测试
    console.log("This is myLayers[node_floor-1] :")
    console.log(node_floor-1);
    console.log(myLayers[node_floor-1])

    var child_num;
    child_num = myLayers[node_floor-1].length - node_po*2;

    //一个孩子，还是两个孩子呢？
    if (child_num <2){
        //一个孩子
        return false;
    }{
        //两个孩子
        return true;
    }

}
