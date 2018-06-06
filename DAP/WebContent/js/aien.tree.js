/*
AienTree-艾恩JS无限级菜单树
作者:Anlige
Email:iihome@qq.com
Homepage:http://www.ii-home.cn
本程序为作者原创，转载请注明出处和作者
*/
var cssIsLoaded=false;
var icon_path="/guosenbj/images/ico/";
function AienTree(title,url,target,fn,opend,nohref){
  this.title=title!=""?title:"NoValue";
  this.url=url!=""?url:"";
  this.target=target!=""?target:"_blank";
  this.childs=[];
  this.index=1;
  this.start_open=typeof opend=="boolean"?opend:false;
  this.hasChildNoHref=typeof nohref=="boolean"?nohref:true;
  this.fn=typeof fn=="function"?fn:null;
}

AienTree.prototype.addChild=function(title,url,target,fn,opend,nohref){
  var _child=new AienTree(title,url,target,fn,opend,nohref);
  _child.index=this.index+1;
  this.childs.push(_child);
  return _child;
};

AienTree.prototype.createMenu=function(obj,index){
  var _this=this;
  var _obj=$(obj);
  var _index=index?index:0;
  if(!cssIsLoaded){
    addStyle(_obj);
    cssIsLoaded=true;
  }
  var _node=document.createElement("a");
  setHtml(_node,getImg("normal") + this.title);
  _node.href=this.url;
  _node.target=this.target;
  var closes=document.createElement("div");
  closes.style.cssText="margin:1px auto 1px auto;";
  closes.appendChild(_node);
  _obj.appendChild(closes);
  if(this.childs.length>0){
    var outer=document.createElement("div");
    outer.id="AienTree_" + this.index + "_" + _index;
    outer.style.cssText="margin-left:" + this.index * 10 + "px;";
    if(this.start_open){
      outer.style.display="block";
      setHtml(_node,getImg("open") + _this.title);
    }else{
      outer.style.display="none";
      setHtml(_node,getImg("close") + _this.title);
    }
    
    _node.onclick=function(){
      if(outer.style.display=="none"){
        outer.style.display="block";
        setHtml(_node,getImg("open") + _this.title);
      }else{
        outer.style.display="none";
        setHtml(_node,getImg("close") + _this.title);
      }
      if(_this.fn){_this.fn();}
      return !_this.hasChildNoHref;
    };
    for(var i=0;i<this.childs.length;i++){
      this.childs[i].createMenu(outer,i+1);
    } 
    _obj.appendChild(outer);
  }else{
	if(this.fn){
		_node.onclick=fn;
	}
  }
  return _obj;
};
function $(id){
  return typeof id=="string"?document.getElementById(id):id;
}

function setText(obj,text){
  if(isIE()){
    obj.innerText=text;
  }else{
    obj.textContent=text;
  }
}

function setHtml(obj,text){
  obj.innerHTML=text;
}

function getImg(imgStr){
  return "<img style=\"margin-right:2px;border:0px;vertical-align:middle;\" src=\"" + icon_path + imgStr + ".png\" alt=\"\" />"
}

function isIE(){
  return navigator.userAgent.toLowerCase().indexOf("msie")>=0;
}

function addStyle(o){
  var cT="";
  cT+="#" + o.id + " A:link {TEXT-DECORATION: none;font-size:13px;color:#222;}";
  cT+="#" + o.id + " A:visited{TEXT-DECORATION: none;font-size:13px;color:#222;}";
  cT+="#" + o.id + " A:hover{TEXT-DECORATION: none;font-size:13px;color:#ccc;}";
  var STYLE=document.createElement('style');
  STYLE.setAttribute("type","text/css");
  STYLE.styleSheet&&(STYLE.styleSheet.cssText=cT)||STYLE.appendChild(document.createTextNode(cT));
  document.getElementsByTagName('head')[0].appendChild(STYLE);
}

var cookie={
    setCookie	: function(name, value, days) {var expires = "";if (days) {var d = new Date();d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);expires = "; expires=" + d.toGMTString();}document.cookie = name + "=" + value + expires + "; path=/";},
	getCookie	: function (name) {var re = new RegExp("(\;|^)[^;]*(" + name + ")\=([^;]*)(;|$)");var res = re.exec(document.cookie);return res != null ? res[3] : null;}
};