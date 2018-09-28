var GloablLayerindex = 0;
layui.config({
    base: '/Content/Layui-KnifeZ/extends/'
}).extend({
    dialog: 'formSelects/dialog'
    ,formSelects: 'formSelects/formSelects-v4' //下拉框增强
    //, dltable: 'treeGrid/dltable'//树形表格拓展
    //, treeGrid: 'treeGrid/treeGrid' //树形表格拓展

});
/**
 *将数据转换为标准树结构
*Code PCode Name
 **/
function Convert2TreeData(rows) {
    function exists(rows, PCode) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].Code == PCode) return true;
        }
        return false;
    }
    var nodes = [];
    // get the top level nodes
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!exists(rows, row.PCode)) {
            nodes.push({
                value: row.Code,
                name: row.Name
            });
        }
    }
    var toDo = [];
    for (var i = 0; i < nodes.length; i++) {
        toDo.push(nodes[i]);
    }
    while (toDo.length) {
        var node = toDo.shift();
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.PCode == node.value) {
                var child = { value: row.Code, name: row.Name };
                if (node.children) {
                    node.children.push(child);
                } else {
                    node.children = [child];
                }
                toDo.push(child);
            }
        }
    }
    return nodes;
}
function Convert2SelectData(rows) {
    var nodes = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        nodes.push({
            value: row.Code,
            name: row.Name
        });
    }
}
/**
 *获取layer弹出动画
 **/
function GetLayamin() {
    return Math.floor(Math.random() * 7);
}
/**
 *layer弹出层封装
 * by zhw 
 * 2018-9-27
 */
function LayMsg(content, options, end){
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.msg(content, options, end);
    });
}
function LayAlert(content, options, yes) {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.alert(content, options, yes);
    });
}
function LayOpen(options) {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.open(options);
    });
}
function LayTips(options) {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.tips(options);
    });
}
function LayClose(options) {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.close(options);
    });
}
function LayCloseAll(options) {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.closeAll(options);
    });
}
function LayLoad(icon, options) {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.load(icon,options);
    });
}