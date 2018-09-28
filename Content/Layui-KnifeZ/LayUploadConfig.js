
bindUpload(optId, btnId,actionId, url){

    layui.use(['form', 'layer', 'upload', 'laydate', 'formSelects'], function () {
        var demoListView = $('#demoList'),
            uploadListIns = upload.render({
                elem: '#testList'
                , url: '/Attachment/LayUploadFile'
                , accept: 'file'
                , multiple: true
                , auto: false
                , bindAction: '#UploadImg'
                , choose: function (obj) {
                    var files = this.files = obj.pushFile();
                    obj.preview(function (index, file, result) {
                        var imgType = $("#ImgType").val();
                        if (imgType.indexOf('Img') > -1) {
                            var tr = $(['<tr id="upload-' + index + '">'
                                , '<td>' + file.name + '</td>'
                                , '<td><img src="' + result + '" alt = "' + file.name + '" class= "layui-upload-img"></td>'
                                , '<td><div class="layui-form"><select name="Selist" id="ImgType-' + index + '" xm-select-radio="" xm-select="ImgType-' + index + '" ><option value = ""> 请选择</option></select></div></td>'
                                , '<td>等待上传</td>'
                                , '<td>'
                                , '<input type="button" class="layui-btn layui-btn-mini demo-reload layui-hide" value="重传">'
                                , '<input type="button" class="layui-btn layui-btn-mini layui-btn-danger demo-delete" value="删除">'
                                , '</td>'
                                , '</tr>'].join(''));
                        } else {
                            var tr = $(['<tr id="upload-' + index + '">'
                                , '<td>' + file.name + '</td>'
                                , '<td>Video</td>'
                                , '<td><div class="layui-form"><select name="Selist" id="ImgType-' + index + '" xm-select-radio="" xm-select="ImgType-' + index + '" ><option value = ""> 请选择</option></select></div></td>'
                                , '<td>等待上传</td>'
                                , '<td>'
                                , '<input type="button"  class="layui-btn layui-btn-mini demo-reload layui-hide" value="重传">'
                                , '<input type="button" class="layui-btn layui-btn-mini layui-btn-danger demo-delete" value="删除">'
                                , '</td>'
                                , '</tr>'].join(''));
                        }
                        tr.find('.demo-reload').on('click', function () {
                            obj.upload(index, file);
                        });
                        tr.find('.demo-delete').on('click', function () {
                            delete files[index]; //删除对应的文件
                            tr.remove();
                            uploadListIns.config.elem.next()[0].value = '';
                        });
                        demoListView.append(tr);
                        GetLaySelect("ImgType-" + index, "/Base/GetSelectTree?Action=AttachType");
                        if (imgType != "") {
                            $("#ImgType-" + index).val(imgType);
                        }
                        form.render();
                    });
                }
                , done: function (res, index, upload) {
                    if (res.code == 0) {
                        var mData = {
                            BillCode: $("#Code").val(),
                            BillType: $("#OptionType").val(),
                            FileType: $("#ImgType-" + index).val(),
                            FileSize: res.data.Size,
                            FileName: res.data.name,
                            FilePath: res.data.src
                        }
                        var tr = demoListView.find('tr#upload-' + index)
                            , tds = tr.children();
                        tds.eq(3).html('<span style="color: #5FB878;">上传成功</span>');
                        $.post("/Attachment/AddDataToDb", mData, function (r) {
                            tr.attr('id', 'Attach-' + r);
                            tds.eq(4).html('<input type="button"  class="layui-btn layui-btn-mini layui-btn-danger demo-dbDel" onClick="DelAttach("' + r + '")" value="删除">');
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                        })
                    } else {
                        delete this.files[index];
                        layer.open({
                            type: 1
                            , title: '提示'
                            , area: ['390px', '260px']
                            , offset: 't'
                            , shade: 0
                            , content: res.msg + "<div><img src='" + res.data.src + "' style='max-height:80px'/></div><label class='layui-form - label'>确定使用该文件吗？</label>"
                            , btn: ['确定', '取消']
                            , yes: function () {
                                var mData = {
                                    BillCode: $("#Code").val(),
                                    BillType: $("#OptionType").val(),
                                    FileType: $("#ImgType-" + index).val(),
                                    FileSize: res.data.Size,
                                    FileName: res.data.name,
                                    FilePath: res.data.src
                                }
                                var tr = demoListView.find('tr#upload-' + index), tds = tr.children();
                                $.post("/Attachment/AddDataToDb", mData, function (r) {
                                    tr.attr('id', 'Attach-' + r);
                                    tds.eq(3).html('<span style="color: #5FB878;">调用成功</span>');
                                    tds.eq(4).html('<input type="button"  class="layui-btn layui-btn-mini layui-btn-danger demo-dbDel" onClick=DelAttach("' + r + '") value="删除">');
                                    layer.close(layer.index);
                                });
                                layer.close(layer.index);
                            }
                            , btn2: function () {
                                var tr = demoListView.find('tr#upload-' + index);
                                tr.remove();
                                layer.close(layer.index);
                            }
                            , zIndex: layer.zIndex
                        });
                    }
                }
                , error: function (index, upload) {
                    var tr = demoListView.find('tr#upload-' + index)
                        , tds = tr.children();
                    tds.eq(3).html('<span style="color: #FF5722;">上传失败</span>');
                    tds.eq(4).find('.demo-reload').removeClass('layui-hide'); //显示重传
                }
            });
    })
}