# Kz.layedit

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
-     layui.use(['layedit','layer','jquery'],function() {
-         var $=layui.jquery;
-         var layedit = layui.layedit;
- 	layedit.set({
-                 uploadImage: { url: '/Attachment/LayUpload' } //图片上传方法
-                 , uploadVideo: { url: '/Attachment/LayUpload' } //视频上传方法
-                 , //fontFomatt:["p","span"]  //自定义段落格式 ，如不填，默认为 ["p", "h1", "h2", "h3", "h4", "h5", "h6", "div"]
-                 , tool: [
-                     'html'
- 					, 'strong', 'italic', 'underline', 'del', '|'
- 					, 'fontFomatt','colorpicker' //段落格式，字体颜色
- 					, 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink'
- 					, 'image_alt', 'altEdit', 'video' //
-                     , '|', 'fullScreen'
-                 ]
-             });
-             var ieditor = layedit.build('layeditDemo');
-     })