# Kz.layedit
### 在线预览
[码云Gitee Pages](http://knifez.gitee.io/kz.layedit/)
### 虽然对移动端做了适配,但是使用体验不咋的,已经放弃治疗.以后估计只会优化界面,避免出现宽,高溢出的情况.但是操作体验上基本无法改进了...不建议移动端做富文本编辑....
#### 更新日志
- ##### V18.12.18
1. [修复] 多图上传/附件上传 路径未能正确转换问题，多图上传添加loading层 （感谢<a href="https://gitee.com//kkink">kkink</a>的反馈）
2. [优化] 空内容添加hr标签退格键back删除兼容
3. [优化] 移除粘贴内容过滤style样式，script、link代码块
4. [优化] 插入hr/a标签不再使用p标签包裹
- ##### V18.12.17
1. [修复] 上传图片上传视频弹出框点击右上角关闭报错问题 （感谢<a href="https://gitee.com//dapperfd845es64">孤独感胜多负少</a>的反馈）
2. [优化] uploadImage/video/file配置优化，uploadImage 默认 accept: 'image',acceptMime: 'image/*',exts: 'jpg|png|gif|bmp|jpeg',size: 1024 * 10,
uploadVideo默认参数 accept: 'video',acceptMime: 'video/*', exts: 'mp4|flv|avi|rm|rmvb', size: 1024 * 20, uploadFile默认参数 accept: 'file',   acceptMime: 'file/*',  size: 1024 * 30
3. [新增] 上传接口新增headers/data参数，【接口的请求头。如：headers: {token: 'sasasas'}。注：该参数为 layui 2.2.6 开始新增】可根据需要调用，详细见<a href="https://www.layui.com/doc/modules/upload.html#options" target="_blank">layuplaod基础参数</a>
- ##### V18.12.14 beta
1. [修复] 视频右键修改报错问题 （感谢<a href="https://gitee.com/flygervip">flyger</a>的反馈）
2. [优化] 视频上传提示信息修改，可选择上传视频或直接粘贴视频地址
- ##### V18.12.12
1. [修复] 多图上传点击图片删除无法按照预期进行问题，该错误为调用callDel回调时imgpath获取失败导致。
2. [优化] 图片上传、 多图上传、视频上传取消和右上角关闭按钮添加回调函数，调用callDel方法。
- ##### V18.12.10
1. [优化] Html源码模式参照ueditor直接展示，不再使用弹出层，兼容全屏。
2. [优化] enter回车插入p标签，防止出现div或其他奇怪的问题
3. [优化] 插入元素优化，光标节点为p标签时只插入选择的元素如img,a标签，如果光标节点不为p标签时自动追加一层p标签，（插入视频外部为div）
4. [修复] 插入图片时结尾多一个br标签问题，该问题为插入图片时先回车换行，再选择图片插入，如果当前节点为```<p><br></p>```时自动去除br标签并居中
5. [优化] 表格右键菜单
- ##### V18.12.08
1. [新增] videoAttr配置参数，供插入视频时的自定义属性，如 preload="none"。
- ##### V18.12.07
1. [修复] 一个页面多个编辑器时字体颜色、背景色无效问题
2. [修复] 添加超链接无法正确获取选中文本，不选rel和target属性时不添加rel和target,tartget设置为_self时不添加target,取消默认nofollow
3. [修复] Uncaught TypeError: Cannot read property 'focus' of undefined at layedit.js:8
4. [待修复] 新增fontfamily，fontSize设置文本字体和字体大小，暂时插入&nbsp;空格定位光标
- ##### V18.12.06
1. [优化] 字体颜色、背景色功能引用layui.colorpicker，可自定义选取颜色
- ##### V18.12.01
1. [新增] 上传附件功能【attachment】,配置参数【uploadFiles】,同uploadImage继承自LayUpload
2. [修复] 部分情况下（layer弹出层引用，一个页面多个编辑器时）右键触发事件定位报错问题
3. [优化] 表情地址改为网络地址，由【facePath】配置，目录指向layui文件夹
4. [待修复] 新增fontfamily暂时无法使用，无法定位光标位置到span标签内
- ##### V18.11.29
1. [优化] 视频右键菜单优化，可修改视频、封面或删除该视频
- ##### V18.11.28
1. [修复] 自定义链接宽度错误设置为3500px问题,修复合并冲突customlink.title设置无效问题
2. [优化] 锚点不再采用class控制，兼容非本编辑器编辑锚点，修改锚点展示样式为<span style="color:#01aaed">§</span>
3. [优化] 插入锚点弹窗兼容移动端
4. [新增] 简单撤销【undo】 重做【redo】功能， 仅对编辑器内文本操作有效，，插入锚点等功能无法撤销重做
- ##### V18.11.27
1. [优化] 段落格式选择样式，背景改为白色，鼠标加手;
2. [新增] 自定义样式【CustomTheme】,暂时只支持video添加时进行主题样式选择，提供三个参数，title(下拉框展示项),content（自定义class）.preview（预览图地址）
3. [优化] 修改多图上传图标
4. [新增] 插入表格功能【table】,最大支持10X10，支持右键删除行\新增行，暂不支持合并单元格
5. [新增] 插入自定义链接【customlink】,提供title（弹出层名称），href(添加链接url),onmouseup(onmouseup触发事件)三个参数，添加的链接默认target='_blank',rel='nofollow'
- ##### V18.11.25
感谢来自<a href="https://gitee.com/yhl452493373">杨黄林</a>的反馈
1. [合并优化]  图片上传时图片的宽度，高度单位为px，输入时不需输入单位；
2. [合并优化] 修改图片属性时可以初始化获取设置的图片的宽和；
3. [合并新增] 文件、视频上传/删除时增加done回调，参数为服务器返回的数据；新增field 上传时的文件参数字段名
4. [合并优化] 图片、视频地址为空时，确定给出提示，不能为空；
5. [合并修复] 批量上传时，上传失败会删除相应图片；
6. [合并优化] 超链接弹窗高度自适应；
7. [合并优化] 弹窗使用layer自带按钮
8. [新增] 上传图片视频时可在后台判断服务器是否存在该文件，如存在则返回{code:2,msg:"重复提示",data:{src:"重复文件路径"}}; 会弹窗提示是否调用重复文件，如不需要该功能返回状态码请勿使用2，正常 0，错误 1， 重复 2 、、、
9. [新增] 编辑器外置样式和js引用【quote】
- ##### V18.11.24
1. [新增]  文字背景色设置[fontBackColor]
2. [优化] uploadImage/uploadVideo可只设置url，其余均设置可读取默认值。
3. [已知问题] IE模式下插入表情图片视频等功能均不可用，仅支持少许设置。
- ##### V18.11.23
1. [新增] 多图上传功能[images],配置参数同uploadImage，删除回调同 calldel
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
1. index.html下为示例文件，可供查看演示功能
2. 将dist下文件layedit.js替换掉layui/lay/modules/layedit.js
3. 正常调用layedit即可

#### 使用说明
配置信息(具体查看示例文件)

```
     layui.use(['layedit','layer','jquery'],function() {
         var $=layui.jquery;
         var layedit = layui.layedit;
 		 layedit.set({
                //暴露layupload参数设置接口 --详细查看layupload参数说明
                uploadImage: {
                    url: '/Attachment/LayUploadFile',
                    field: 'file',//上传时的文件参数字段名
                    accept: 'image',
                    acceptMime: 'image/*',
                    exts: 'jpg|png|gif|bmp|jpeg',
                    size: 1024 * 10,
                    done: function (data) {//文件上传接口返回code为0时的回调
                    }
                }
                , uploadVideo: {
                    url: '/Attachment/LayUploadFile',
                    field: 'file',//上传时的文件参数字段名
                    accept: 'video',
                    acceptMime: 'video/*',
                    exts: 'mp4|flv|avi|rm|rmvb',
                    size: 1024 * 2 * 10,
                    done: function (data) {//文件上传接口返回code为0时的回调
                    }
                }
                //右键删除图片/视频时的回调参数，post到后台删除服务器文件等操作，
                //传递参数：
                //图片： imgpath --图片路径
                //视频： filepath --视频路径 imgpath --封面路径
                , calldel: {
                    url: '/Attachment/DeleteFile',
                    done: function (data) {//data删除文件接口返回返回的数据
                    }
                }
                //开发者模式 --默认为false
                , devmode: true
                //插入代码设置
                , codeConfig: {
                    hide: false,  //是否显示编码语言选择框
                    default: 'javascript' //hide为true时的默认语言格式
                }           
                //新增iframe外置样式和js
                , quote:{
                    style: ['/Content/Layui-KnifeZ/css/layui.css','/others'],
                    js: ['/Content/Layui-KnifeZ/lay/modules/jquery.js']
                }
                 , //fontFomatt:["p","span"]  //自定义段落格式 ，如不填，默认为 ["p", "h1", "h2", "h3", "h4", "h5", "h6", "div"]~~
                 , tool: [
                     'html','undo','redo','code'
 					, 'strong', 'italic', 'underline', 'del', 
					,'addhr' //添加水平线
					,'|', 'fontFomatt','colorpicker' //段落格式，字体颜色
 					, 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink'
 					, 'image_alt', 'altEdit', 'video' 
					,'anchors' //锚点
                     , '|'
					 , 'table'//插入表格
					 ,'customlink'//插入自定义链接
					 ,'fullScreen'
                 ]
         });
         var ieditor = layedit.build('layeditDemo');
		 layedit.setContent(ieditor,"hello layedit",false);
     })
```
