// JavaScript Document
var treedata	= new Array();
var path		= "";
function treemenu(tree_path,tree_name,tree_ico)
{
	path	= tree_path;
	name	= tree_name;
	ico	= tree_ico;
	
	document.write("<div style='font-size:15px;font-weight:bold'><img src='"+path+ico+"' align=top border=0>"+name+"</div>");

}//end function treemenu
//                 0 id      1 父id      2  名称    3  地址   4  关闭图标    5 打开图标     6 指向窗口
function add_item(tree_id,tree_prarent,tree_name,tree_close_ico,tree_open_ico,tree_url,tree_target)
{
	if(tree_close_ico=="")
		tree_close_ico="close.gif";
	if(tree_open_ico=="")
		tree_open_ico="open.gif";
	//                                       0 id      1 父id      2  名称    3  地址   4  关闭图标    5 打开图标     6 指向窗口
	treedata[treedata.length]	= new Array(tree_id,tree_prarent,tree_name,tree_url,tree_close_ico,tree_open_ico,tree_target);
}//end function add_item

function print_arr()
{
	var i;
	var j;
	var n	= treedata.length;
	var m	= treedata[0].length;
	
	for(i=0; i<n; i++)
	{
		for(j=0; j<m;j++)
		{
			//"  treedata["+i+"]["+j+"]="
			document.write(" "+j+":"+treedata[i][j]);
		}//end for
		
		document.write(" <br>\n");
	}//end for
	
}//end function print_arr

function menu(id)						//画菜单
{
	var currdata	= new Array();
	var i			= 0;
	var printstr	= "<table border='0' cellspacing='0' cellpadding='0'>\n";
	var listtype	= "";
	var menutype	= "";
	
	for(; i<treedata.length; i++)
	{					//判断有无此节点
		if(treedata[i][1]==id)	currdata[currdata.length] = treedata[i];
	}//end for	
	
	
	for(i=0; i<currdata.length; i++)
	{					//遍历数组，执行判断
		if(itemExists(currdata[i][0]))
		{						//判断是否有子节点
			if(i==currdata.length-1)
			{			// 最后一个
				menutype	= "menu3";
				listtype	= "list1";
			}
			else
			{
				menutype	= "menu1";
				listtype	= "list";
			}//end if
			onmouseup	= "chengstate("+currdata[i][0]+")";
			menuname	= currdata[i][2];
		}
		else
		{					//没有子节点
			if(i==currdata.length-1)
			{			// 最后一个
				menutype	= "file1";
			}
			else
			{
				menutype	= "file";
			}//end if
			menuname	= "<a href='"+currdata[i][3]+"' target='"+currdata[i][6]+"'>"+currdata[i][2]+"</a>";
			onmouseup	= "";
		}//end if
		ico			= "<img src='"+path+currdata[i][4]+"' id='ico"+currdata[i][0]+"' align=middle border=0>";
		printstr	+= "<tr><td id='pr"+currdata[i][0]+"' valign=middle class="+menutype+" onMouseUp="+onmouseup+">"+ico+"<span onMouseOver='over_str(this)' valign='bottom' onMouseOut='out_str(this)' class='item'> "+menuname+" </span> </td></tr>\n";
		printstr	+= "<tr id='item"+currdata[i][0]+"' style='display:none'><td class="+listtype+">"+menu(currdata[i][0])+"</td></tr>\n";

	}//end for
	printstr	+= "</table>\n";
	
	return printstr;
}//end function menu

function itemExists(id)
{
	for(var i=0;i<treedata.length;i++)
	{
		if(treedata[i][1]==id)return true;
	}//end for
	return false;
}//end function itemExists

function closeAll()
{											// 所有节点全部折叠
	var len	= treedata.length;
	for(i=0; i<len; i++)
	{					//遍历数组，执行判断
		obj		= document.getElementById("pr"+treedata[i][0]);
		if(obj.className == "menu2" || obj.className == "menu4")
		{						//判断是否有子节点
			chengstate(treedata[i][0]);
		}//end if
	}//end for
	
}//end function closeAll

function openAll()
{											// 所有节点全部展开
	var len	= treedata.length;
	for(i=0; i<len; i++)
	{					//遍历数组，执行判断
		obj		= document.getElementById("pr"+treedata[i][0]);
		if(obj.className == "menu1" || obj.className == "menu3")
		{						//判断是否有子节点
			chengstate(treedata[i][0]);
		}//end if
	}//end for
}//end function openAll

function over_str(obj)
{
	obj.style.background	= "#EEEEEE";
	obj.style.border		= "1px solid #999999";
}//end function over

function out_str(obj)
{
	obj.style.background	= "";
	obj.style.border		= "1px solid #FFFFFF";
}//end function out

function chengstate(menuid,save)
{											//切换节点的开放/关闭
//	alert("menuid:"+menuid+"save:"+save);
	menuobj	= document.getElementById("item"+menuid);
	obj		= document.getElementById("pr"+menuid);
	ico		= document.getElementById("ico"+menuid);
	var len	= treedata.length;
	for(i=0; i<len; i++)
	{
		if(treedata[i][0]==menuid)
		{
			break;
		}//end if
	}//end for
	
	if(menuobj.style.display == '')
	{
		menuobj.style.display	= 'none';
		ico.src					= path+treedata[i][4];
	}else{
		menuobj.style.display	= '';
		ico.src					= path+treedata[i][5];
	}//end if
	switch (obj.className)
	{
		case "menu1":
			obj.className	= "menu2";
			break;
		case "menu2":
			obj.className	= "menu1";
			break;
		case "menu3":
			obj.className	= "menu4";
			break;
		case "menu4":
			obj.className	= "menu3";
			break;
	}//end switch
	
	if(save!=false)
	{
		setupcookie(menuid);			//保存状态
	}//end if
}//end funciton chengstaut

function setupcookie(menuid)
{										//存入cookie  保存节点状态
	var menu	= new Array();
	var menustr	= new String();
	menuOpen	= false;
	if(checkCookieExist("menu"))
	{									//判断是否是是否已经保存过cookie
		menustr		= getCookie("menu");
		//alert(menustr);
		if(menustr.length>0)
		{								//判断menu是否为空，，，否则分解为数组
			menu	= menustr.split(",");
			for(i=0;i<menu.length;i++)
			{
				if(menu[i]==menuid)
				{						//如果是打开状态，，，删除记录
					menu[i]='';
					menuOpen	= true;
				}//end if
			}//end for
			if(menuOpen==false)menu[i] = menuid;
		}else{
			menu[0]	= menuid;
		}//end if
	}else{
		menu[0]	= menuid;
	}//end if
	menu.sort();
	menustr	= menu.join(",");
	menustr	= menustr.replace(",,",",");
	if(menustr.substr(menustr.length-1,1)==',')menustr = menustr.substr(0,menustr.length-1);		//去掉最后的 ","
	if(menustr.substr(0,1)==',')menustr = menustr.substr(1,menustr.length-1);		//去掉开始的 ","
	saveCookie("menu",menustr,1000);
	//alert(menustr);
	//deleteCookie("menu");
}//end function setupcookie

function initialize()
{											//取得cookie  设置节点的缩放,,初始化菜单状态
	var menu	= new Array();
	var menustr	= new String();
	
	if(checkCookieExist("menu"))
	{									//判断是否是是否已经保存过cookie
		menustr		= getCookie("menu");
		if(menustr.length>0)
		{								//判断长度是否合法
			menu	= menustr.split(",");
			for(i=0;i<menu.length;i++)
			{
				if(objExists(menu[i]))			
				{						//验证对象是否存在
					chengstate(menu[i],false);
				}//end if
			}//end for
			objExists(99);
		}//end if
	}//end if
}//end funciton setupstate

function objExists(objid)
{											//验证对象是否存在
	try
	{
		obj = document.getElementById("item"+objid);
	}//end try
	catch(obj)
	{
		return false;
	}//end catch
	
	if(typeof(obj)=="object")
	{
		return true;
	}//end if
	return false;
}//end function objExists
//--------------------------------------------------↓↓↓↓↓↓↓↓↓↓↓↓  执行Cookie 操作
function saveCookie(name, value, expires, path, domain, secure)
{											// 保存Cookie
  var strCookie = name + "=" + value;
  if (expires)
  {											// 计算Cookie的期限, 参数为天数
     var curTime = new Date();
     curTime.setTime(curTime.getTime() + expires*24*60*60*1000);
     strCookie += "; expires=" + curTime.toGMTString();
  }//end if
  // Cookie的路径
  strCookie +=  (path) ? "; path=" + path : ""; 
  // Cookie的Domain
  strCookie +=  (domain) ? "; domain=" + domain : "";
  // 是否需要保密传送,为一个布尔值
  strCookie +=  (secure) ? "; secure" : "";
  document.cookie = strCookie;
}//end funciton saveCookie

function getCookie(name)
{											// 使用名称参数取得Cookie值, null表示Cookie不存在
  var strCookies = document.cookie;
  var cookieName = name + "=";  // Cookie名称
  var valueBegin, valueEnd, value;
  // 寻找是否有此Cookie名称
  valueBegin = strCookies.indexOf(cookieName);
  if (valueBegin == -1) return null;  // 没有此Cookie
  // 取得值的结尾位置
  valueEnd = strCookies.indexOf(";", valueBegin);
  if (valueEnd == -1)
      valueEnd = strCookies.length;  // 最後一个Cookie
  // 取得Cookie值
  value = strCookies.substring(valueBegin+cookieName.length,valueEnd);
  return value;
}//end function getCookie

function checkCookieExist(name)
{											// 检查Cookie是否存在
  if (getCookie(name))
      return true;
  else
      return false;
}//end function checkCookieExist

function deleteCookie(name, path, domain)
{											// 删除Cookie
  var strCookie;
  // 检查Cookie是否存在
  if (checkCookieExist(name))
  {										    // 设置Cookie的期限为己过期
    strCookie = name + "="; 
    strCookie += (path) ? "; path=" + path : "";
    strCookie += (domain) ? "; domain=" + domain : "";
    strCookie += "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    document.cookie = strCookie;
  }//end if
}//end function deleteCookie