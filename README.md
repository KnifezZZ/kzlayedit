# Kz.layedit
### 在线预览
[码云Gitee Pages](http://knifez.gitee.io/kz.layedit/index.html )
#### 更新日志
- ##### V18.11.16
1. [修复] 空编辑器上传视频并删除后编辑器无法操作问题
2. [修复] 插入锚点功能
3. [移除] 字体/字体大小设置
4. [优化] 右键菜单/段落格式展示效果
5. [优化] 插入视频同时插入p标签，并在左右各加一个空格符，以处理video标签无法选中问题。
6. [新增] 图片上传和视频上传文件限制参数 file/filemine/exts --该参数引用自layupload，详细见<a href="https://www.layui.com/doc/modules/upload.html#options" target="_blank">layuplaod基础参数</a>
7. [新增] 右键删除视频图片的回调方法设置 calldel:{url:''},该设置会调用post方法传递图片(imgpath)/视频地址(filepath)
8. [新增] 开发者模式 devmode,默认为false,false时隐藏添加链接的 打开方式和rel属性
9. [新增] 图片右键添加删除功能
10. [新增] 超链接添加页面新增链接 文本字段，打开方式默认为新页面
11. [新增] 图片视频上传时可在后台检测服务器是否存在相同文件，相同可返回服务器文件地址进行调用，前台有提示，返回码为2
12. [已知问题] 粘贴或赋默认值时会过滤script和style标签，内容中存在错误时编辑器不可用，如存在该问题请检查内容是否正确
- ##### v18.11.12
1. 新增图片右键修改功能，可重新上传图片
2. 修复上传视频什么也不选时也能成功添加bug，现在会提示上传视频(感谢<a href="https://gitee.com/herohill">hreohill</a>的反馈)
3. 新增 添加水平线/hr（<i>addhr</i>）功能
4. 插入代码新增自定义参数 codeConfig{hide:true|false,default:"javascript/c#/java..."} 设置hide为true时不显示代码选择框，可依据default设置默认语言格式。不设置codeConfig则为原版

~~5. [已知bug] 字体大小设置目前不可用~~
~~6. [待完善]新增 插入锚点(<i>anchors</i>) 功能，前台展示默认为 $锚点$ ,保存和读取存在问题，暂不推荐使用~~
- ##### v18.10.23
修复取消全屏后样式错误问题（部分情况下依旧会出现高度变矮情况）
- ##### v18.10.9
1. 新增图片右键修改宽高功能
2. 优化右键面板样式，最大化最小化功能优化
- ##### v18.10.8
1. 添加右键触发事件 --居中，居左，居右，删除
2. 回车、居中居左等自动追加p标签
- ##### v18.9.29
1. 添加HTML源码模式
2. 图片插入添加alt属性
3. 新增 视频插入、全屏、字体颜色设置功能
#### 项目介绍
对layui.layedit的拓展，基于layui v2.4.3.
- 增加了HTML源码模式，
- 图片插入功能添加alt属性（layupload），
- 视频插入功能，
- 全屏功能，
- 段落格式，
- 字体颜色设置功能。
- 所有拓展功能菜单按钮图标均引用自layui自带图标
#### 软件架构
软件架构说明
1. HTML源码模式 引用第三方插件ace,优化源码展示样式。
2. 引用ace编辑器仅保留了html源码样式和tomorrow主题，如有需要可自行更换
#### 安装教程
1. demo下为示例文件，可供查看演示功能
2. 将dist下文件layedit.js替换掉layui/lay/modules/layedit.js
3. 正常调用layedit即可

#### 使用说明
配置信息

```
     layui.use(['layedit','layer','jquery'],function() {
         var $=layui.jquery;
         var layedit = layui.layedit;
 		 layedit.set({
                //暴露layupload参数设置接口 --详细查看layupload参数说明
                uploadImage: {
                    url: '/Attachment/LayUploadFile',
                    accept: 'image',
                    acceptMime: 'image/*',
                    exts: 'jpg|png|gif|bmp|jpeg',
                    size: '10240'
                }
                , uploadVideo: {
                    url: '/Attachment/LayUploadFile',
                    accept: 'video',
                    acceptMime: 'video/*',
                    exts: 'mp4|flv|avi|rm|rmvb',
                    size: '20480'
                }
                //右键删除图片/视频时的回调参数，post到后台删除服务器文件等操作，
                //传递参数：
                //图片： imgpath --图片路径
                //视频： filepath --视频路径 imgpath --封面路径
                , calldel: {
                    url: '/Attachment/DeleteFile'
                }
                //开发者模式 --默认为false
                , devmode: true
                //插入代码设置
                , codeConfig: {
                    hide: true,  //是否显示编码语言选择框
                    default: 'javascript' //hide为true时的默认语言格式
                }
                 , //fontFomatt:["p","span"]  //自定义段落格式 ，如不填，默认为 ["p", "h1", "h2", "h3", "h4", "h5", "h6", "div"]~~
                 , tool: [
                     'html','code'
 					, 'strong', 'italic', 'underline', 'del', 
					,'addhr' //添加水平线
					,'|', 'fontFomatt','colorpicker' //段落格式，字体颜色
 					, 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink'
 					, 'image_alt', 'altEdit', 'video' 
					,'anchors' //锚点
                     , '|', 'fullScreen'
                 ]
         });
         var ieditor = layedit.build('layeditDemo');
     })
```
