# Kz.layedit
#### 更新日志
- v18.9.29
	1. 添加HTML源码模式
	2. 图片插入添加alt属性
	3. 新增 视频插入、全屏、字体颜色设置功能
- v18.10.8
	1. 添加右键触发事件 --居中，居左，居右，删除
	2. 回车、居中居左等自动追加p标签
- v18.10.9
	1. 新增图片右键修改宽高功能
	2. 优化右键面板样式，最大化最小化功能优化
- v18.10.23
	修复取消全屏后样式错误问题（部分情况下依旧会出现高度变矮情况）
- v18.11.12
	1. 新增图片右键修改功能，可重新上传图片
	2. 修复上传视频什么也不选时也能成功添加bug，现在会提示上传视频(感谢<a href="https://gitee.com/herohill">hreohill</a>的反馈)
	3. [已知bug] 字体大小设置目前不可用
	4. 新增 添加水平线（<hr>）功能
	5. 插入代码新增自定义参数 codeConfig{hide:true|false,default:"javascript/c#/java..."} 设置hide为true时不显示代码选择框，可依据default设置默认语言格式。不设置codeConfig则为原版
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
                 uploadImage: { url: '/Attachment/LayUpload' } //图片上传方法
                 , uploadVideo: { url: '/Attachment/LayUpload' } //视频上传方法
                 , //fontFomatt:["p","span"]  //自定义段落格式 ，如不填，默认为 ["p", "h1", "h2", "h3", "h4", "h5", "h6", "div"]
                 , tool: [
                     'html'
 					, 'strong', 'italic', 'underline', 'del', '|'
 					, 'fontFomatt','colorpicker' //段落格式，字体颜色
 					, 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink'
 					, 'image_alt', 'altEdit', 'video' //
                     , '|', 'fullScreen'
                 ]
             });
             var ieditor = layedit.build('layeditDemo');
     })
```
