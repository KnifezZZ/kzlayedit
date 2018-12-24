# Kz.layedit
### 在线预览
[码云Gitee Pages](http://knifez.gitee.io/kz.layedit/index.html)

### 项目配置说明

[Kz.layedit使用说明](https://knifez.gitee.io/2018/12/22/kz.layedit/)

### 虽然对移动端做了适配,但是使用体验不咋的,已经放弃治疗.以后估计只会优化界面,避免出现宽,高溢出的情况.但是操作体验上基本无法改进了...不建议移动端做富文本编辑....
#### 更新日志
- ##### V18.12.24 beta
1. [修复] 上传附件报uploadImage错误，done回调方法错误调用uploadImage.done，已修改为uplaodFile.done。（感谢<a href="https://gitee.com/dengkai1992">三十年的老咸菜</a>的反馈）
2. [新增] 右键菜单自定义设置rightBtn。有type和customEvent两个属性，type=default|layBtn|custom，浏览器默认/layedit右键面板/自定义菜单 default和layBtn无需配置customEvent，customEvent为自定义右键方法，默认为layBtn
- ##### V18.12.21
1. [新增] ctrl+v粘贴图片时调用后台方法上传至服务器，配置地址为uploadImage的src地址,不支持从word复制的图片
- ##### V18.12.20
1. [修复] 代码冲突导致字体设置和字体大小设置一样（感谢<a href="https://gitee.com/flash127">あ读鈊茚ケ</a>的反馈）
2. [新增] 弹窗预览功能，预览样式配合quote {style}使用
3. [新增] 自动同步到textarea参数autoSync:true|false,true则内容改动实时同步到textarea,false与原版一致，默认false
4. [新增] 内容改变监听方法onchange:function(content){};content为获取的编辑器内容，用法查看示例文件
- ##### V18.12.19
1. [修复] 编辑器高度设置为百分比时源码模式不展示问题
 - ##### V18.12.18
1. [修复] 多图上传/附件上传 路径未能正确转换问题，多图上传添加loading层 （感谢<a href="https://gitee.com/kkink">kkink</a>的反馈）
2. [优化] 空内容添加hr标签退格键back删除兼容
3. [优化] 移除粘贴内容过滤style样式，script、link代码块
4. [优化] 插入hr/a标签不再使用p标签包裹

####  <a href="http://knifez.gitee.io/kz.layedit/UpgradeInfo.html">历史日志</a>

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
