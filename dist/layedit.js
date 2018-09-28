/**

 @Name：layui.layedit 富文本编辑器
 @Author：贤心
 @editor:KnifeZ
 @License：MIT
    
 */

layui.define(['layer', 'form'], function (exports) {
    "use strict";

    var $ = layui.$
        , layer = layui.layer
        , form = layui.form
        , hint = layui.hint()
        , device = layui.device()

        , MOD_NAME = 'layedit', THIS = 'layui-this', SHOW = 'layui-show', ABLED = 'layui-disabled'

        , Edit = function () {
            var that = this;
            that.index = 0;

            //全局配置
            that.config = {
                //默认工具bar
                tool: [
                    'strong', 'italic', 'underline', 'del'
                    , '|'
                    , 'left', 'center', 'right'
                    , '|'
                    , 'link', 'unlink', 'face', 'image'
                ]
                , hideTool: []
                , height: 280 //默认高
            };
        };

    //全局设置
    Edit.prototype.set = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    };

    //事件监听
    Edit.prototype.on = function (events, callback) {
        return layui.onevent(MOD_NAME, events, callback);
    };

    //建立编辑器
    Edit.prototype.build = function (id, settings) {
        settings = settings || {};

        var that = this
            , config = that.config
            , ELEM = 'layui-layedit', textArea = $(typeof (id) == 'string' ? '#' + id : id)
            , name = 'LAY_layedit_' + (++that.index)
            , haveBuild = textArea.next('.' + ELEM)

            , set = $.extend({}, config, settings)

            , tool = function () {
                var node = [], hideTools = {};
                layui.each(set.hideTool, function (_, item) {
                    hideTools[item] = true;
                });
                layui.each(set.tool, function (_, item) {
                    if (tools[item] && !hideTools[item]) {
                        node.push(tools[item]);
                    }
                });
                return node.join('');
            }()


            , editor = $(['<div class="' + ELEM + '">'
                , '<div class="layui-unselect layui-layedit-tool">' + tool + '</div>'
                , '<div class="layui-layedit-iframe">'
                , '<iframe id="' + name + '" name="' + name + '" textarea="' + id + '" frameborder="0"></iframe>'
                , '</div>'
                , '</div>'].join(''))

        //编辑器不兼容ie8以下
        if (device.ie && device.ie < 8) {
            return textArea.removeClass('layui-hide').addClass(SHOW);
        }

        haveBuild[0] && (haveBuild.remove());

        setIframe.call(that, editor, textArea[0], set)
        textArea.addClass('layui-hide').after(editor);

        return that.index;
    };

    //获得编辑器中内容
    Edit.prototype.getContent = function (index) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        return toLower(iframeWin[0].document.body.innerHTML);
    };

    //获得编辑器中纯文本内容
    Edit.prototype.getText = function (index) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        return $(iframeWin[0].document.body).text();
    };
    /**
     * 设置编辑器内容
     * @param {[type]} index   编辑器索引
     * @param {[type]} content 要设置的内容
     * @param {[type]} flag    是否追加模式
     */
    Edit.prototype.setContent = function (index, content, flag) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        if (flag) {
            $(iframeWin[0].document.body).append(content)
        } else {
            $(iframeWin[0].document.body).html(content)
        };
        this.sync(index)
    };
    //将编辑器内容同步到textarea（一般用于异步提交时）
    Edit.prototype.sync = function (index) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        var textarea = $('#' + iframeWin[1].attr('textarea'));
        textarea.val(toLower(iframeWin[0].document.body.innerHTML));
    };

    //获取编辑器选中内容
    Edit.prototype.getSelection = function (index) {
        var iframeWin = getWin(index);
        if (!iframeWin[0]) return;
        var range = Range(iframeWin[0].document);
        return document.selection ? range.text : range.toString();
    };

    //iframe初始化
    var setIframe = function (editor, textArea, set) {
        var that = this, iframe = editor.find('iframe');

        iframe.css({
            height: set.height
        }).on('load', function () {
            var conts = iframe.contents()
                , iframeWin = iframe.prop('contentWindow')
                , head = conts.find('head')
                , style = $(['<style>'
                    , '*{margin: 0; padding: 0;}'
                    , 'body{padding: 10px; line-height: 20px; overflow-x: hidden; word-wrap: break-word; font: 14px Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Tahoma,Arial,sans-serif; -webkit-box-sizing: border-box !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important;}'
                    , 'a{color:#01AAED; text-decoration:none;}a:hover{color:#c00}'
                    , 'p{margin-bottom: 10px;}'
                    , 'img{display: inline-block; border: none; vertical-align: middle;}'
                    , 'pre{margin: 10px 0; padding: 10px; line-height: 20px; border: 1px solid #ddd; border-left-width: 6px; background-color: #F2F2F2; color: #333; font-family: Courier New; font-size: 12px;}'
                    , '</style>'].join(''))
                , body = conts.find('body');

            head.append(style);
            body.attr('contenteditable', 'true').css({
                'min-height': set.height
            }).html(textArea.value || '');

            hotkey.apply(that, [iframeWin, iframe, textArea, set]); //快捷键处理
            toolActive.call(that, iframeWin, editor, set); //触发工具

        });
    }

        //获得iframe窗口对象
        , getWin = function (index) {
            var iframe = $('#LAY_layedit_' + index)
                , iframeWin = iframe.prop('contentWindow');
            return [iframeWin, iframe];
        }

        //IE8下将标签处理成小写
        , toLower = function (html) {
            if (device.ie == 8) {
                html = html.replace(/<.+>/g, function (str) {
                    return str.toLowerCase();
                });
            }
            return html;
        }

        //快捷键处理
        , hotkey = function (iframeWin, iframe, textArea, set) {
            var iframeDOM = iframeWin.document, body = $(iframeDOM.body);
            body.on('keydown', function (e) {
                var keycode = e.keyCode;
                //处理回车
                if (keycode === 13) {
                    var range = Range(iframeDOM);
                    var container = getContainer(range)
                        , parentNode = container.parentNode;

                    if (parentNode.tagName.toLowerCase() === 'pre') {
                        if (e.shiftKey) return
                        layer.msg('请暂时用shift+enter');
                        return false;
                    }
                    //iframeDOM.execCommand('formatBlock', false, '<p>');
                }
            });

            //给textarea同步内容
            $(textArea).parents('form').on('submit', function () {
                var html = body.html();
                //IE8下将标签处理成小写
                if (device.ie == 8) {
                    html = html.replace(/<.+>/g, function (str) {
                        return str.toLowerCase();
                    });
                }
                textArea.value = html;
            });

            //处理粘贴
            body.on('paste', function (e) {
                iframeDOM.execCommand('formatBlock', false, '<p>');
                setTimeout(function () {
                    filter.call(iframeWin, body);
                    textArea.value = body.html();
                }, 100);
            });
        }

        //标签过滤
        , filter = function (body) {
            var iframeWin = this
                , iframeDOM = iframeWin.document;

            //清除影响版面的css属性
            body.find('*[style]').each(function () {
                var textAlign = this.style.textAlign;
                this.removeAttribute('style');
                $(this).css({
                    'text-align': textAlign || ''
                })
            });

            //修饰表格
            body.find('table').addClass('layui-table');

            //移除不安全的标签
            body.find('script,link').remove();
        }

        //Range对象兼容性处理
        , Range = function (iframeDOM) {
            return iframeDOM.selection
                ? iframeDOM.selection.createRange()
                : iframeDOM.getSelection().getRangeAt(0);
        }

        //当前Range对象的endContainer兼容性处理
        , getContainer = function (range) {
            return range.endContainer || range.parentElement().childNodes[0]
        }

        //在选区插入内联元素
        , insertInline = function (tagName, attr, range) {
            var iframeDOM = this.document
                , elem = document.createElement(tagName)
            for (var key in attr) {
                elem.setAttribute(key, attr[key]);
            }
            elem.removeAttribute('text');

            if (iframeDOM.selection) { //IE
                var text = range.text || attr.text;
                if (tagName === 'a' && !text) return;
                if (text) {
                    elem.innerHTML = text;
                }
                range.pasteHTML($(elem).prop('outerHTML'));
                range.select();
            } else { //非IE
                var text = range.toString() || attr.text;
                if (tagName === 'a' && !text) return;
                if (text) {
                    elem.innerHTML = text;
                }
                range.deleteContents();
                range.insertNode(elem);
            }
        }

        //工具选中
        , toolCheck = function (tools, othis) {
            var iframeDOM = this.document
                , CHECK = 'layedit-tool-active'
                , container = getContainer(Range(iframeDOM))
                , item = function (type) {
                    return tools.find('.layedit-tool-' + type)
                }

            if (othis) {
                //if (othis[0].className.indexOf("layedit-tool-html")>-1) {
                //    if (othis.hasClass(CHECK)) {
                //        tools.find('>i').removeClass(ABLED);
                //        item('html').removeClass(CHECK);
                //    } else {
                //        tools.find('>i').addClass(ABLED);
                //        item('html').removeClass(ABLED);
                //        item('html').addClass(CHECK);
                //    }
                //} else {
                //    othis[othis.hasClass(CHECK) ? 'removeClass' : 'addClass'](CHECK);
                //}
                othis[othis.hasClass(CHECK) ? 'removeClass' : 'addClass'](CHECK);

            }
            tools.find('>i').removeClass(CHECK);
            item('unlink').addClass(ABLED);

            $(container).parents().each(function () {
                var tagName = this.tagName.toLowerCase()
                    , textAlign = this.style.textAlign;
                //文字
                //if (tagName === 'b' || tagName === 'strong') {
                //    item('b').addClass(CHECK)
                //}
                //if (tagName === 'i' || tagName === 'em') {
                //    item('i').addClass(CHECK)
                //}
                //if (tagName === 'u') {
                //    item('u').addClass(CHECK)
                //}
                //if (tagName === 'strike') {
                //    item('d').addClass(CHECK)
                //}
                //对齐
                if (tagName === 'p') {
                    if (textAlign === 'center') {
                        item('center').addClass(CHECK);
                    } else if (textAlign === 'right') {
                        item('right').addClass(CHECK);
                    } else {
                        item('left').addClass(CHECK);
                    }
                }
                //超链接
                if (tagName === 'a') {
                    item('link').addClass(CHECK);
                    item('unlink').removeClass(ABLED);
                }
            });
        }

        //触发工具
        , toolActive = function (iframeWin, editor, set) {
            var iframeDOM = iframeWin.document
                , body = $(iframeDOM.body)
                , toolEvent = {
                    //超链接
                    link: function (range) {
                        var container = getContainer(range)
                            , parentNode = $(container).parent();

                        link.call(body, {
                            href: parentNode.attr('href')
                            , target: parentNode.attr('target')
                        }, function (field) {
                            var parent = parentNode[0];
                            if (parent.tagName === 'A') {
                                parent.href = field.url;
                            } else {
                                insertInline.call(iframeWin, 'a', {
                                    target: field.target
                                    , href: field.url
                                    , text: field.url
                                }, range);
                            }
                        });
                    }
                    //清除超链接
                    , unlink: function (range) {
                        iframeDOM.execCommand('unlink');
                    }
                    //表情
                    , face: function (range) {
                        face.call(this, function (img) {
                            insertInline.call(iframeWin, 'img', {
                                src: img.src
                                , alt: img.alt
                            }, range);
                        });
                    }
                    //图片
                    , image: function (range) {
                        var that = this;
                        layui.use('upload', function (upload) {
                            var uploadImage = set.uploadImage || {};
                            upload.render({
                                url: uploadImage.url
                                , method: uploadImage.type
                                , elem: $(that).find('input')[0]
                                , done: function (res) {
                                    if (res.code == 0) {
                                        res.data = res.data || {};
                                        insertInline.call(iframeWin, 'img', {
                                            src: res.data.src
                                            , alt: res.data.title
                                        }, range);
                                    } else {
                                        layer.msg(res.msg || '上传失败');
                                    }
                                }
                            });
                        });
                    }
                    //插入代码
                    , code: function (range) {
                        code.call(body, function (pre) {
                            insertInline.call(iframeWin, 'pre', {
                                text: pre.code
                                , 'lay-lang': pre.lang
                            }, range);
                        });
                    }
                    /*#Extens#*/
                    //图片alt标签修改
                    , altEdit: function (range) {
                        layer.msg("待开发")
                    }
                    //图片2
                    , image_alt: function (range) {
                        var that = this;
                        layer.open({
                            type: 1
                            , id: 'fly-jie-image-upload'
                            , title: '图片管理'
                            , shade: false
                            , area: '485px'
                            , offset: '100px'
                            , skin: 'layui-layer-border'
                            , content: ['<ul class="layui-form layui-form-pane" style="margin: 20px;">'
                                , '<li class="layui-form-item">'
                                , '<label class="layui-form-label">图片</label>'
                                , '<button type="button" class="layui-btn" id="LayEdit_InsertImage"> <i class="layui-icon"></i>上传图片</button>'
                                , '<input type="text" name="Imgsrc" placeholder="请选择文件" style="width: 49%;position: relative;float: right;" class="layui-input">'
                                , '</li>'
                                , '<li class="layui-form-item">'
                                , '<label class="layui-form-label">描述</label>'
                                , '<input type="text" required name="altStr" placeholder="alt属性" style="width: 75%;" value="" class="layui-input">'
                                , '</li>'
                                , '<li class="layui-form-item" style="text-align: center;">'
                                , '<button type="button" lay-submit  class="layui-btn layedit-btn-yes"> 确定 </button>'
                                , '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>'
                                , '</li>'
                                , '</ul>'].join('')
                            , success: function (layero, index) {
                                layui.use('upload', function (upload) {
                                    var upload = layui.upload;
                                    var loding, altStr = layero.find('input[name="altStr"]'), Imgsrc = layero.find('input[name="Imgsrc"]');
                                    var uploadImage = set.uploadImage || {};
                                    //执行实例
                                    upload.render({
                                        elem: '#LayEdit_InsertImage'
                                        , url: uploadImage.url
                                        , method: uploadImage.type
                                        , before: function (obj) { loding = layer.msg('文件上传中,请稍等哦', { icon: 16, shade: 0.3, time: 0 }); }
                                        , done: function (res, input, upload) {
                                            layer.close(loding);
                                            if (res.code == 0) {
                                                res.data = res.data || {};
                                                Imgsrc.val(res.data.src);
                                                altStr.val(res.data.name);
                                            } else {
                                                var curIndex = layer.open({
                                                    type: 1
                                                    , anim: 2
                                                    , icon: 5
                                                    , title: '提示'
                                                    , area: ['390px', '260px']
                                                    , offset: 't'
                                                    , content: res.msg + "<div><img src='" + res.data.src + "' style='max-height:80px'/></div><label class='layui-form - label'>确定使用该文件吗？</label>"
                                                    , btn: ['确定', '取消']
                                                    , yes: function () {
                                                        res.data = res.data || {};
                                                        Imgsrc.val(res.data.src);
                                                        altStr.val(res.data.name);
                                                        layer.close(curIndex);
                                                    }
                                                    , btn2: function () {
                                                        layer.close(curIndex);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    layero.find('.layui-btn-primary').on('click', function () {
                                        layer.close(index);
                                    });
                                    layero.find('.layedit-btn-yes').on('click', function () {
                                        insertInline.call(iframeWin, 'img', {
                                            src: Imgsrc.val()
                                            , alt: altStr.val()
                                        }, range);
                                        layer.close(index);
                                    });
                                })

                            }
                        });
                    }
                    //插入视频
                    , video: function (range) {
                        var body = this;
                        layer.open({
                            type: 1
                            , id: 'fly-jie-video-upload'
                            , title: '视频'
                            , shade: false
                            , area: '600px'
                            , offset: '100px'
                            , skin: 'layui-layer-border'
                            , content: ['<ul class="layui-form layui-form-pane" style="margin: 20px;">'
                                , '<li class="layui-form-item">'
                                , '<button type="button" class="layui-btn" id="LayEdit_InsertVideo"> <i class="layui-icon"></i>上传视频</button>'
                                , '<input type="text" name="video" placeholder="请选择文件" style="width: 79%;position: relative;float: right;" class="layui-input">'
                                , '</li>'
                                , '<li class="layui-form-item">'
                                , '<button type="button" class="layui-btn" id="LayEdit_InsertImage"> <i class="layui-icon"></i>上传封面</button>'
                                , '<input type="text" name="cover" placeholder="请选择文件" style="width: 79%;position: relative;float: right;" class="layui-input">'
                                , '</li>'
                                , '<li class="layui-form-item" style="text-align: center;">'
                                , '<button type="button" lay-submit  class="layui-btn layedit-btn-yes"> 确定 </button>'
                                , '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>'
                                , '</li>'
                                , '</ul>'].join('')
                            , success: function (layero, index) {
                                
                                layui.use('upload', function (upload) {
                                    var loding, video = layero.find('input[name="video"]'), cover = layero.find('input[name="cover"]');
                                    var upload = layui.upload;
                                    var uploadImage = set.uploadImage || {};
                                    var uploadfileurl = set.uploadVideo || {};
                                    //执行实例
                                    upload.render({
                                        elem: '#LayEdit_InsertImage'
                                        , url: uploadImage.url
                                        , method: uploadImage.type
                                        , before: function (obj) { loding = layer.msg('文件上传中,请稍等哦', { icon: 16, shade: 0.3, time: 0 }); }
                                        , done: function (res, input, upload) {
                                            layer.close(loding);
                                            if (res.code == 0) {
                                                res.data = res.data || {};
                                                cover.val(res.data.src);
                                            } else {
                                                var curIndex = layer.open({
                                                    type: 1
                                                    , anim: 2
                                                    , icon: 5
                                                    , title: '提示'
                                                    , area: ['390px', '260px']
                                                    , offset: 't'
                                                    , content: res.msg + "<div><img src='" + res.data.src + "' style='max-height:100px'/></div><label class='layui-form-label'>确定使用该文件吗？</label>"
                                                    , btn: ['确定', '取消']
                                                    , yes: function () {
                                                        res.data = res.data || {};
                                                        cover.val(res.data.src);
                                                        layer.close(curIndex);
                                                    }
                                                    , btn2: function () {
                                                        layer.close(curIndex);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    upload.render({
                                        elem: '#LayEdit_InsertVideo'
                                        , url: uploadfileurl.url
                                        , accept: 'file'
                                        , method: 'POST'
                                        , before: function (obj) { loding = layer.msg('文件上传中,请稍等哦', { icon: 16, shade: 0.3, time: 0 }); }
                                        , done: function (res, input, upload) {
                                            layer.close(loding);
                                            if (res.code == 0) {
                                                res.data = res.data || {};
                                                video.val(res.data.src);
                                            } else {
                                                var curIndex = layer.open({
                                                    type: 1
                                                    , anim: 2
                                                    , icon: 5
                                                    , title: '提示'
                                                    , area: ['390px', '260px']
                                                    , offset: 't'
                                                    , content: res.msg + "<div><video src='" + res.data.src + "' style='max-height:100px' controls='controls'/></div>确定使用该文件吗？"
                                                    , btn: ['确定', '取消']
                                                    , yes: function () {
                                                        res.data = res.data || {};
                                                        video.val(res.data.src);
                                                        layer.close(curIndex);
                                                    }
                                                    , btn2: function () {
                                                        layer.close(curIndex);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    layero.find('.layui-btn-primary').on('click', function () {
                                        layer.close(index);
                                    });
                                    layero.find('.layedit-btn-yes').on('click', function () {
                                        insertInline.call(iframeWin, 'video', {
                                            src: video.val()
                                            , controls: 'controls'
                                        }, range);
                                        layer.close(index);
                                    });
                                })

                            }
                        });
                    }
                    //源码模式
                    , html: function (range) {
                        var that = this;
                        var docs = that.parentElement.nextElementSibling.firstElementChild.contentDocument.body.innerHTML;
                        layer.open({
                            type: 1
                            , id: 'knife-z-html'
                            , title: '源码模式'
                            , shade: 0.3
                            //, maxmin: true
                            , area: ['900px', '600px']
                            , offset: '100px'
                            , content: ['<div id ="aceHtmleditor" style="width:100%;height:80%">'
                                , '</div>'
                                , '<div style="text-align:center">'
                                , '<button type="button" class="layui-btn layedit-btn-yes"> 确定 </button>'
                                , '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>'
                                , '</div>'
                            ].join('')
                            , success: function (layero, index) {
                                var editor = ace.edit('aceHtmleditor');
                                editor.setFontSize(14);
                                editor.session.setMode("ace/mode/html");
                                editor.setTheme("ace/theme/tomorrow");
                                editor.setOption("wrap", "free")
                                editor.setValue(docs);
                                layero.find('.layui-btn-primary').on('click', function () {
                                    layer.close(index);
                                });
                                layero.find('.layedit-btn-yes').on('click', function () {
                                    iframeWin.document.body.innerHTML = editor.getValue();
                                    layer.close(index);
                                });
                            }
                        });
                    }
                    //全屏
                    , fullScreen: function (range) {
                        if (this.parentElement.parentElement.getAttribute("style") == null || this.parentElement.parentElement.getAttribute("style") == "") {
                            this.parentElement.parentElement.setAttribute("style", "position: fixed;top: 0;left: 0;height: 100%;width: 100%;background-color: antiquewhite;z-index: 9999;");
                            this.parentElement.nextElementSibling.firstElementChild.allowFullscreen = true;
                        } else {
                            this.parentElement.parentElement.removeAttribute("style");
                            this.parentElement.nextElementSibling.firstElementChild.allowFullscreen = false;
                        }
                    }
                    //字体颜色选择
                    , colorpicker: function (range) {
                        colorpicker.call(this, function (color) {
                            iframeDOM.execCommand('forecolor', false, color);
                            setTimeout(function () {
                                body.focus();
                            }, 10);
                        });
                    }
                    , fontFomatt: function (range) {
                        fontFomatt.call(this, function (value) {
                            iframeDOM.execCommand('formatBlock', false, "<"+value+">");
                            setTimeout(function () {
                                body.focus();
                            }, 10);
                        });
                    }
                    , fontSize: function (range) {
                        var fontSize = function () {
                            var alt = ["8", "10", "12", "14", "16", "18", "20", "22","24","26"], arr = {};
                            layui.each(alt, function (index, item) {
                                arr[item] = item;
                            });
                            return arr;
                        }();

                        fontSize.hide = fontSize.hide || function (e) {
                            if ($(e.target).attr('layedit-event') !== 'fontSize') {
                                layer.close(fontSize.index);
                            }
                        }
                        return fontSize.index = layer.tips(function () {
                            var content = [];
                            layui.each(fontSize, function (key, item) {
                                content.push('<li title="' + key + '">' + item + '</li>');
                            });
                            return '<ul class="layui-clear">' + content.join('') + '</ul>';
                        }(), this, {
                                tips: 1
                                , time: 0
                                , skin: 'layui-box layui-util-face'
                                //, maxWidth: 200
                                , success: function (layero, index) {
                                    layero.css({
                                        marginTop: -4
                                        , marginLeft: -10
                                    }).find('.layui-clear>li').on('click', function () {
                                        iframeDOM.execCommand('fontSize', false, this.title);
                                        setTimeout(function () {
                                            body.focus();
                                        }, 10);
                                        layer.close(index);
                                    });
                                    $(document).off('click', fontSize.hide).on('click', fontSize.hide);
                                }
                            });
                    }
                    /*End*/
                    //帮助
                    , help: function () {
                        layer.open({
                            type: 2
                            , title: '帮助'
                            , area: ['600px', '380px']
                            , shadeClose: true
                            , shade: 0.1
                            , offset: '100px'
                            , skin: 'layui-layer-msg'
                            , content: ['http://www.layui.com/about/layedit/help.html', 'no']
                        });
                    }
                }
                , tools = editor.find('.layui-layedit-tool')

                , click = function () {
                    var othis = $(this)
                        , events = othis.attr('layedit-event')
                        , command = othis.attr('lay-command');

                    if (othis.hasClass(ABLED)) return;

                    body.focus();

                    var range = Range(iframeDOM)
                        , container = range.commonAncestorContainer

                    if (command) {
                        iframeDOM.execCommand(command);
                        if (/justifyLeft|justifyCenter|justifyRight/.test(command)) {
                            iframeDOM.execCommand('formatBlock', false, '<p>');
                        }
                        setTimeout(function () {
                            body.focus();
                        }, 10);
                    } else {
                        toolEvent[events] && toolEvent[events].call(this, range, iframeDOM);
                    }
                    toolCheck.call(iframeWin, tools, othis);
                }

                , isClick = /image/

            tools.find('>i').on('mousedown', function () {
                var othis = $(this)
                    , events = othis.attr('layedit-event');
                if (isClick.test(events)) return;
                click.call(this)
            }).on('click', function () {
                var othis = $(this)
                    , events = othis.attr('layedit-event');
                if (!isClick.test(events)) return;
                click.call(this)
            });

            //触发内容区域
            body.on('click', function () {
                toolCheck.call(iframeWin, tools);
                layer.close(face.index);
                layer.close(colorpicker.index);
                layer.close(fontFomatt.index);
            });
        }

        //超链接面板
        , link = function (options, callback) {
            var body = this, index = layer.open({
                type: 1
                , id: 'LAY_layedit_link'
                , area: '350px'
                , offset: '100px'
                , shade: 0.05
                , shadeClose: true
                , moveType: 1
                , title: '超链接'
                , skin: 'layui-layer-msg'
                , content: ['<ul class="layui-form" style="margin: 15px;">'
                    , '<li class="layui-form-item">'
                    , '<label class="layui-form-label" style="width: 60px;">URL</label>'
                    , '<div class="layui-input-block" style="margin-left: 90px">'
                    , '<input name="url" lay-verify="url" value="' + (options.href || '') + '" autofocus="true" autocomplete="off" class="layui-input">'
                    , '</div>'
                    , '</li>'
                    , '<li class="layui-form-item">'
                    , '<label class="layui-form-label" style="width: 60px;">打开方式</label>'
                    , '<div class="layui-input-block" style="margin-left: 90px">'
                    , '<input type="radio" name="target" value="_self" class="layui-input" title="当前窗口"'
                    + ((options.target === '_self' || !options.target) ? 'checked' : '') + '>'
                    , '<input type="radio" name="target" value="_blank" class="layui-input" title="新窗口" '
                    + (options.target === '_blank' ? 'checked' : '') + '>'
                    , '</div>'
                    , '</li>'
                    , '<li class="layui-form-item" style="text-align: center;">'
                    , '<button type="button" lay-submit lay-filter="layedit-link-yes" class="layui-btn"> 确定 </button>'
                    , '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>'
                    , '</li>'
                    , '</ul>'].join('')
                , success: function (layero, index) {
                    var eventFilter = 'submit(layedit-link-yes)';
                    form.render('radio');
                    layero.find('.layui-btn-primary').on('click', function () {
                        layer.close(index);
                        body.focus();
                    });
                    form.on(eventFilter, function (data) {
                        layer.close(link.index);
                        callback && callback(data.field);
                    });
                }
            });
            link.index = index;
        }

        //表情面板
        , face = function (callback) {
            //表情库
            var faces = function () {
                var alt = ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]"], arr = {};
                layui.each(alt, function (index, item) {
                    arr[item] = layui.cache.dir + 'images/face/' + index + '.gif';
                });
                return arr;
            }();
            face.hide = face.hide || function (e) {
                if ($(e.target).attr('layedit-event') !== 'face') {
                    layer.close(face.index);
                }
            }
            return face.index = layer.tips(function () {
                var content = [];
                layui.each(faces, function (key, item) {
                    content.push('<li title="' + key + '"><img src="' + item + '" alt="' + key + '"/></li>');
                });
                return '<ul class="layui-clear">' + content.join('') + '</ul>';
            }(), this, {
                    tips: 1
                    , time: 0
                    , skin: 'layui-box layui-util-face'
                    , maxWidth: 500
                    , success: function (layero, index) {
                        layero.css({
                            marginTop: -4
                            , marginLeft: -10
                        }).find('.layui-clear>li').on('click', function () {
                            callback && callback({
                                src: faces[this.title]
                                , alt: this.title
                            });
                            layer.close(index);
                        });
                        $(document).off('click', face.hide).on('click', face.hide);
                    }
                });
        }
        , colorpicker = function (callback) {
            var colors = function () {
                var alt = ["#fff", "#000", "#800000", "#ffb800", "#1e9fff", "#5fb878", "#ff5722", "#999999", "#01aaed", "#cc0000", "#ff8c00", "#ffd700", "#90ee90", "#00ced1", "#1e90ff",
                    "#c71585", "#00babd", "#ff7800"], arr = {};
                layui.each(alt, function (index, item) {
                    arr[item] = item;
                });
                return arr;
            }();
            colorpicker.hide = colorpicker.hide || function (e) {
                if ($(e.target).attr('layedit-event') !== 'colorpicker') {
                    layer.close(colorpicker.index);
                }
            }
            return colorpicker.index = layer.tips(function () {
                var content = [];
                layui.each(colors, function (key, item) {
                    content.push('<li title="' + item + '" style="background-color:' + item + '"><span style="background-' + item + '" alt="' + key + '"/></li>');
                });
                return '<ul class="layui-clear">' + content.join('') + '</ul>';
            }(), this, {
                    tips: 1
                    , time: 0
                    , skin: 'layui-box layui-util-face'
                    //, maxWidth: 300
                    , success: function (layero, index) {
                        layero.css({
                            marginTop: -4
                            , marginLeft: -10
                        }).find('.layui-clear>li').on('click', function () {
                            callback && callback(this.title);
                            layer.close(index);
                        });
                        $(document).off('click', colorpicker.hide).on('click', colorpicker.hide);
                    }
                });
        }
        , fontFomatt = function (callback) {
            var faces = function () {
                var alt = ["p","h1", "h2","h3","h4","h5","h6","div"], arr = {};
                layui.each(alt, function (index, item) {
                    arr[item] = item;
                });
                return arr;
            }();
            fontFomatt.hide = fontFomatt.hide || function (e) {
                if ($(e.target).attr('layedit-event') !== 'fontFomatt') {
                    layer.close(fontFomatt.index);
                }
            }
            return fontFomatt.index = layer.tips(function () {
                var content = [];
                layui.each(faces, function (key, item) {
                    content.push('<li title="' + key + '">' + item + '</li>');
                });
                return '<ul class="layui-clear">' + content.join('') + '</ul>';
            }(), this, {
                    tips: 1
                    , time: 0
                    , skin: 'layui-box layui-util-face'
                    //, maxWidth: 200
                    , success: function (layero, index) {
                        layero.css({
                            marginTop: -4
                            , marginLeft: -10
                        }).find('.layui-clear>li').on('click', function () {
                            callback && callback(this.title);
                            layer.close(index);
                        });
                        $(document).off('click', fontFomatt.hide).on('click', fontFomatt.hide);
                    }
                });
        }
        //插入代码面板
        , code = function (callback) {
            var body = this, index = layer.open({
                type: 1
                , id: 'LAY_layedit_code'
                , area: '550px'
                , shade: 0.05
                , shadeClose: true
                , offset: '100px'
                , moveType: 1
                , title: '插入代码'
                , skin: 'layui-layer-msg'
                , content: ['<ul class="layui-form layui-form-pane" style="margin: 15px;">'
                    , '<li class="layui-form-item">'
                    , '<label class="layui-form-label">请选择语言</label>'
                    , '<div class="layui-input-block">'
                    , '<select name="lang">'
                    , '<option value="JavaScript">JavaScript</option>'
                    , '<option value="HTML">HTML</option>'
                    , '<option value="CSS">CSS</option>'
                    , '<option value="Java">Java</option>'
                    , '<option value="PHP">PHP</option>'
                    , '<option value="C#">C#</option>'
                    , '<option value="Python">Python</option>'
                    , '<option value="Ruby">Ruby</option>'
                    , '<option value="Go">Go</option>'
                    , '</select>'
                    , '</div>'
                    , '</li>'
                    , '<li class="layui-form-item layui-form-text">'
                    , '<label class="layui-form-label">代码</label>'
                    , '<div class="layui-input-block">'
                    , '<textarea name="code" lay-verify="required" autofocus="true" class="layui-textarea" style="height: 200px;"></textarea>'
                    , '</div>'
                    , '</li>'
                    , '<li class="layui-form-item" style="text-align: center;">'
                    , '<button type="button" lay-submit lay-filter="layedit-code-yes" class="layui-btn"> 确定 </button>'
                    , '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>'
                    , '</li>'
                    , '</ul>'].join('')
                , success: function (layero, index) {
                    var eventFilter = 'submit(layedit-code-yes)';
                    form.render('select');
                    layero.find('.layui-btn-primary').on('click', function () {
                        layer.close(index);
                        body.focus();
                    });
                    form.on(eventFilter, function (data) {
                        layer.close(code.index);
                        callback && callback(data.field);
                    });
                }
            });
            code.index = index;
        }
        //全部工具
        , tools = {
            html: '<i class="layui-icon layedit-tool-html" title="HTML源代码"  layedit-event="html"">&#xe64b;</i><span class="layedit-tool-mid"></span>'
            , strong: '<i class="layui-icon layedit-tool-b" title="加粗" lay-command="Bold" layedit-event="b"">&#xe62b;</i>'
            , italic: '<i class="layui-icon layedit-tool-i" title="斜体" lay-command="italic" layedit-event="i"">&#xe644;</i>'
            , underline: '<i class="layui-icon layedit-tool-u" title="下划线" lay-command="underline" layedit-event="u"">&#xe646;</i>'
            , del: '<i class="layui-icon layedit-tool-d" title="删除线" lay-command="strikeThrough" layedit-event="d"">&#xe64f;</i>'

            , '|': '<span class="layedit-tool-mid"></span>'

            , left: '<i class="layui-icon layedit-tool-left" title="左对齐" lay-command="justifyLeft" layedit-event="left"">&#xe649;</i>'
            , center: '<i class="layui-icon layedit-tool-center" title="居中对齐" lay-command="justifyCenter" layedit-event="center"">&#xe647;</i>'
            , right: '<i class="layui-icon layedit-tool-right" title="右对齐" lay-command="justifyRight" layedit-event="right"">&#xe648;</i>'
            , link: '<i class="layui-icon layedit-tool-link" title="插入链接" layedit-event="link"">&#xe64c;</i>'
            , unlink: '<i class="layui-icon layedit-tool-unlink layui-disabled" title="清除链接" lay-command="unlink" layedit-event="unlink"" style="font-size:18px">&#xe64d;</i>'
            , face: '<i class="layui-icon layedit-tool-face" title="表情" layedit-event="face"" style="font-size:18px">&#xe650;</i>'
            , image: '<i class="layui-icon layedit-tool-image" title="图片" layedit-event="image" style="font-size:18px">&#xe64a;<input type="file" name="file"></i>'
            , code: '<i class="layui-icon layedit-tool-code" title="插入代码" layedit-event="code" style="font-size:18px">&#xe64e;</i>'

            , image_alt: '<i class="layui-icon layedit-tool-image_alt" title="图片" layedit-event="image_alt" style="font-size:18px">&#xe64a;</i>'
            , altEdit: '<i class="layui-icon layedit-tool-altEdit" title="图片属性" layedit-event="altEdit" style="font-size:18px">&#xe66e;</i>'
            , video: '<i class="layui-icon layedit-tool-video" title="插入视频" layedit-event="video" style="font-size:18px">&#xe6ed;</i>'
            , fullScreen: '<i class="layui-icon layedit-tool-fullScreen" title="全屏" layedit-event="fullScreen"style="font-size:18px">&#xe638;</i>'
            , colorpicker: '<i class="layui-icon layedit-tool-colorpicker" title="字体颜色选择" layedit-event="colorpicker" style="font-size:18px">&#xe66a;</i>'
            , fontFomatt: '<i class="layui-icon layedit-tool-fontFomatt" title="段落格式" layedit-event="fontFomatt" style="font-size:18px">&#xe639;</i>'
            , fontFamily: '<i class="layui-icon layedit-tool-fontFamily" title="字体" layedit-event="fontFamily" style="font-size:18px">&#xe702;</i>'
            , fontSize: '<i class="layui-icon layedit-tool-fontSize" title="字体大小" layedit-event="fontSize" style="font-size:18px">&#xe60b;</i>'


            , help: '<i class="layui-icon layedit-tool-help" title="帮助" layedit-event="help">&#xe607;</i>'
        }
        , edit = new Edit();
    form.render();
    exports(MOD_NAME, edit);
});
