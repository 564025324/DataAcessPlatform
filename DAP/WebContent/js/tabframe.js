var nownumber=0; //目前存在的tab数量
var totalnum=6; //总共的tab数量，包括隐藏的
var tabdivnum=6; //总共的能显示的tabdiv数量
var frontindex=1; //当前显示的是第几个,此为显示序号
var fronttotalindex; //当前显示的是第几个，此为全部页面的序号
var src=""; //包含iframe下面应该引用的叶面URL
tabarray=new Array(14);  //一定要注意0开始，我们是1开始,tabarray是所有tab哪个显示哪个不显示
	for(i=0;i<=totalnum;i++)
	{
		tabarray[i]=0;   //tabarray初始化
	}
tabdiv=new Array(7); //tabdiv表示当前显示的6个tab，分别是哪个页面,注意从0开始和从1开始
	for(i=0;i<=tabdivnum;i++)
	{
		tabdiv[i]=0;  //初始化，0表示没有代表任何tab页面；
	}

function change_option(number,index){
for (var i = 1; i <= number; i++) {
      document.getElementById('current' + i).className = '';
      document.getElementById('content' + i).style.display = 'none';
	  document.getElementById('texttd' + i).className = 'tab';
	  document.getElementById('closetd' + i).className = 'tab';
	  document.getElementById('imgl' + i).src = "../images/conr_tabl.gif";
	  document.getElementById('imgr' + i).src = "../images/conr_tabr.gif";
	  document.getElementById('closeimg' + i).src = "../images/icon_closeg.gif";
	  document.getElementById('fontcolor' + i).style.color = '000000';
}
  document.getElementById('current' + index).className = 'current';
  document.getElementById('content' + index).style.display = 'block';
  document.getElementById('texttd' + index).className = 'tabhgt';
  document.getElementById('closetd' + index).className = 'tabhgt';
  document.getElementById('imgl' + index).src = "../images/conr_tablc.gif";
  document.getElementById('imgr' + index).src = "../images/conr_tabrc.gif";
  document.getElementById('closeimg' + index).src = "../images/icon_closer.gif";
  document.getElementById('fontcolor' + index).style.color = 'FFFFFF';
  frontindex=index;
  fronttotalindex=tabdiv[frontindex];
}


//函数：判断index是否存在于tabdiv数组中
//参数：index:全部页面的索引，非窗口显示6个页面的索引
function IsIndexExist(index)
{
	var biaozhi=0;
	for(i=1;i<=tabdivnum;i++) //注意0，1问题
	{
		if(tabdiv[i]==index)
		{	biaozhi=1;
		return true;
		}
	}
	if(biaozhi==0)
		return false;
}

//函数：返回index页面是窗口显示的第几个标签
//参数：index:全部页面的索引，非窗口显示6个页面的索引
function IndexOfTabdiv(index)
{
	for(i=1;i<=tabdivnum;i++)
	{
		if(tabdiv[i]==index)
			return i;
	}
	return 0; //0表示没有找到
}

//函数：用来改变iframe中的src
//参数：currentindex:第几个iframe，index:全部页面的序号
function ChangeSrc(currentindex,index)
{
	//alert(currentindex+" ;"+index);
	var srcString="";
	switch(index)
	{
		case "1":
			srcString="../marketing/terminal.html";
			break;
		case "2":
			srcString="../marketing/order_new.html";		
			break;
		case "3":
			srcString="../marketing/order_search.html";			
			break;
		case "4":
			srcString="../marketing/order_edit.html";
			break;
		case "5":
			srcString="../marketing/order_cancel.html";
			break;
		case "6":
			srcString="../marketing/order_stat.html";
			break;
		case "7":
			srcString="../marketing/dspth_manual01.html";
			break;
		case "8":
			srcString="../marketing/dispatch01.html";		
			break;
		case "9":
			srcString="../marketing/dspth_feedback01.html";
			break;
		case "20":
			srcString="../marketing/ems_dispatch.html";
			break;
		case "21":
			srcString="../marketing/dispatch_search.html";
			break;
		case "11":
			srcString="../temp/building.html";
			break;
		case "12":
			srcString="../temp/building.html";
			break;
		case "13":
			srcString="../marketing/seat.html";				
			break;
		case "14":
			srcString="../III/index.html";				
			break;
		case "15":
			srcString="../III/执行市场活动.html";				
			break;
			
		case "16":
			srcString="../III/交叉销售产品查询.html";				
			break;
		case "17":
			srcString="../III/合作协议查询.html";				
			break;
		case "18":
			srcString="../III/商机查询.html";				
			break;
		case "19":
			srcString="../III/座席分配查询.html";				
			break;
		case "30":
			srcString="../marketing/seat_1.html";				
			break;
		case "31":
			srcString="../III/查询新两舱航班.html";				
			break;

}
	//alert(srcString);
	document.frames("iframe"+currentindex).location.href=srcString;
}

//函数：将tabdiv数组中第一个为0的序号返回
function WhichIsZero()
{
	for(i=1;i<=tabdivnum;i++)
	{
		if(tabdiv[i]==0)
			return i;
	}
	return 0;  //代表失败
}

//函数：将tabdiv数组中第一个不为0的序号返回
function WhichIsNotZero()
{
	for(i=1;i<=tabdivnum;i++)
	{
		if(tabdiv[i]!=0)
			return i;
	}
	return 0;  //代表失败
}

//函数：增加一个tab，或者显示该index页面
//参数：number:总共拥有的tab数目，
//      index: 要增加的index,这个index是整体的序号，并不是当前显示的序号
function showtab(number,index)  
{
	if(IsIndexExist(index)==true) //点击左面的树结构，点击页面标签已存在
	{
	}
	else ////点击左面的树结构，点击页面标签不存在
	{
		if(nownumber>=number)  //应该考虑更好的替换策略
		{
			alert("最多允许6个标签页，请先关闭其他标签页");
			return;
		}
		else
		{
			nownumber++;
			var insertnum=WhichIsZero();
			tabdiv[insertnum]=index; //代表增加了一个tab,注意0和1起始问题
		}
	}	
	//var currentindex=IndexOfTabdiv(index);
	frontindex=IndexOfTabdiv(index);
	//alert("currentindex"+currentindex);

	for (var i = 1; i <= number; i++) {
      document.getElementById('current' + i).className = '';
      document.getElementById('content' + i).style.display = 'none';
	  document.getElementById('texttd' + i).className = 'tab';
	  document.getElementById('closetd' + i).className = 'tab';
	  document.getElementById('imgl' + i).src = "../images/conr_tabl.gif";
	  document.getElementById('imgr' + i).src = "../images/conr_tabr.gif";
	  document.getElementById('closeimg' + i).src = "../images/icon_closeg.gif";
	  document.getElementById('fontcolor' + i).style.color = '000000';

	} //for
	ChangeSrc(frontindex,index); //用来改变iframe的src
	document.getElementById('current'+frontindex).className='current';
	document.getElementById('current'+frontindex).style.display='block';
	document.getElementById('content'+frontindex).style.display='block';
	document.getElementById('texttd' + frontindex).className = 'tabhgt';
	document.getElementById('closetd' + frontindex).className = 'tabhgt';
  document.getElementById('imgl' + frontindex).src = "../images/conr_tablc.gif";
  document.getElementById('imgr' + frontindex).src = "../images/conr_tabrc.gif";
	document.getElementById('closeimg' + frontindex).src = "../images/icon_closer.gif";
	document.getElementById('fontcolor' + frontindex).style.color = 'FFFFFF';
	
}

//函数：判断该index是否存在于显示的页面中
//参数：index:整体的序号，并不是当前显示的序号
function Deltabdiv(index)
{
	for(i=1;i<=tabdivnum;i++) //注意0，1问题
	{
		if(tabdiv[i]==index)
		{
			tabdiv[i]=0;
			return  true;
		}
	}
	return false;
}


//函数：减少一个tab
//参数：number:总共拥有的tab数目，此处为6
//      index: 要删除的index,当前窗口的序号
//		delindex: 要删除的index,全部页面的序号
function deltab(number,delindex,index)  //删除一个tab
{
	
	if(nownumber>0)
		nownumber--;  //此处逻辑和下面有一点点问题，可能会出现异常,但大多数情况下不会
	else
	{
		alert("不能再删除了");
		return;
	}
	
	var tabdivfrontindexback=tabdiv[frontindex];
	
	if(Deltabdiv(delindex)==false) //表示该tab被删除
	{
		alert(delindex+"该index不存在");
		return;
	}
	
	var frontindexback=frontindex;

	if(nownumber==0)  //恰好删没
		frontindex=0;

	//alert("tabdiv[1]="+tabdiv[1]+"tabdiv[2]="+tabdiv[2]+"frontindex="+frontindex);
	if(tabdivfrontindexback==delindex)
	{
		//tabdiv[frontindex]=0;  //将该数组对应位置为0
		frontindex=WhichIsNotZero(); //删除之后，frontindex变为什么，这里有问题是否需要这样
		fronttotalindex=tabdiv[frontindex];
		//alert("frontindex:"+frontindex);
	}
	
	SetCookie();
	if(nownumber==0)
	{
		window.location="welcome.html"; //自动跳转
	}
	for (var i = 1; i <= number; i++) {
	
      document.getElementById('current' + i).className = '';
      document.getElementById('content' + i).style.display = 'none';
	  document.getElementById('texttd' + i).className = 'tab';
	  document.getElementById('closetd' + i).className = 'tab';
	  document.getElementById('imgl' + i).src = "../images/conr_tabl.gif";
	  document.getElementById('imgr' + i).src = "../images/conr_tabr.gif";
	  document.getElementById('closeimg' + i).src = "../images/icon_closeg.gif";
	  document.getElementById('fontcolor' + i).style.color = '000000';

	}
	document.getElementById('current'+index).style.display='none'; // 后面要更改frontindex,所以在这里先删除
	document.getElementById('current'+frontindex).className='current';
	document.getElementById('content'+frontindex).style.display='block';
	document.getElementById('texttd' + frontindex).className = 'tabhgt';
	document.getElementById('closetd' + frontindex).className = 'tabhgt';
  document.getElementById('imgl' + frontindex).src = "../images/conr_tablc.gif";
  document.getElementById('imgr' + frontindex).src = "../images/conr_tabrc.gif";
	document.getElementById('closeimg' + frontindex).src = "../images/icon_closer.gif";
	document.getElementById('fontcolor' + frontindex).style.color = 'FFFFFF';

}

//函数：接收页面传来的删除操作，index是页面的序号，非全部叶面的序号
//参数：index是页面的序号，非全部叶面的序号，number:此处为6
function deltabtemp(number,index)
{
	var delindex=tabdiv[index];
	//alert("index:"+index);
	deltab(number,delindex,index);
}

//test
function test()
{
showtab(totalnum,3);
}

//函数：从cookie中读取数据
//参数：cookieName：想要读取的变量名称
	function getCookie(cookieName) 
	{
  		var cookieString = document.cookie;
  		var start = cookieString.indexOf(cookieName + '=');
  		// 加上等号的原因是避免在某些 Cookie 的值里有
  		// 与 cookieName 一样的字符串。
  		if (start == -1) // 找不到
    		return null;
  		start += cookieName.length + 1;
  		var end = cookieString.indexOf(';', start);
  		if (end == -1) return unescape(cookieString.substring(start));
  		return unescape(cookieString.substring(start, end));
	}

//函数：写cookie，把所有想写的内容全部写入cookie
//参数：无
//Cookie协议格式： totalnum,nownumber,tab1,tab2,tab3,tab4,tab5,tab6对应的数字，即对应哪个tab
//注意：cookie一次只能加一个！！！
	function SetCookie()
	{
		//var pathString=((path==null)?"":(";path="+path));  //模版样式
		var totalnumString="totalnum="+totalnum+';';
		var nownumberString="nownumber="+nownumber+';';
		document.cookie = totalnumString;
		document.cookie = nownumberString;
		var tabdivString="";
		for(i=1;i<=tabdivnum;i++)
		{
			tabdivString="tabdiv"+i+"="+tabdiv[i]+";";
			document.cookie = tabdivString;  //注意可能rtime之类的数据没有了，可能是两个;引起的
		}
			
		var expires = new Date();
		expires.setTime(expires.getTime() + 3 * 30 * 24 * 60 * 60 * 1000);
/*   三个月 x 一个月当作 30 天 x 一天 24 小时
   x 一小时 60 分 x 一分 60 秒 x 一秒 1000 毫秒 */

		//alert(document.cookie);
	}

//函数：解析URL,判断当前点击的是哪一个tab
	function ReadURL()
	{
		var URLString=window.location.href;
		fronttotalindex=URLString.split('?')[1];
		//alert(fronttotalindex);
	}

//函数：应该显示哪些标签
//参数：index:应该显示哪个标签
	function displaydiv(index)
	{	
		var tabindex=getCookie("tabdiv"+index);
		if(tabindex==null||tabindex==0)  //初始第一次时
		{
			ReadURL();
			tabindex=fronttotalindex;
		}
		var tabString;
		//alert("tabindex"+tabindex);
		switch(tabindex)
		{
			case "1":
				tabString=" 订座/航班查询 ";
				break;
			case "2":
				tabString=" 新增订单 ";
				break;
			case "3":
				tabString=" 查询订单 ";
				break;
			case "4":
				tabString=" 修改订单 ";
				break;
			case "5":
				tabString=" 作废订单 ";
				break;
			case "6":
				tabString=" 订单统计 ";
				break;
			case "7":
				tabString=" 人工调度 ";
				break;
			case "8":
				tabString=" 配送 ";
				break;
			case "9":
				tabString=" 配送反馈 ";
				break;
			case "20":
				tabString=" EMS配送 ";
				break;
			case "21":
				tabString=" 查询 ";
				break;

			case "10":
				tabString=" 大客户客票 ";
				break;
			case "11":
				tabString=" 团队客票 ";
				break;
			case "12":
				tabString=" 新增合作伙伴协议 ";
				break;
			case "13":
				tabString=" 订座追踪 ";
				break;
			case "14":
				tabString="市场业务";
				break;
			case "15":
				tabString="执行外呼市场活动";
				break;
			case "16":
				tabString=" 交叉销售 ";
				break;
				
				case "17":
				tabString=" 合作协议 ";
				break;
			case "18":
				tabString=" 商机管理 ";
				break;
			case "19":
				tabString=" 分配座席员 ";
				break;
			case "30":
				tabString=" 执行订单追踪 ";
				break;
			case "31":
				tabString=" 新两舱旅客 ";
				break;
				
		}
		document.writeln(tabString);
	}	



//函数：进入页面后应该是什么样子
//（1）通过点击树进入页面，读取cookie有哪些窗口需要显示
//（2）将点击的页面显示在最前端
	function init()
	{
		ReadURL(); //首先判断当前窗口是哪一个
		//alert(fronttotalindex);
		
		//判断有哪些窗口//利用showtab（）将所有窗口显示出来
		nownumber=getCookie("nownumber");
		//alert("here"+nownumber);
		if(nownumber==null)
		{
			//alert("nownumber=null");
			nownumber=0; 
			showtab(totalnum,fronttotalindex);
			SetCookie();
			//alert(document.cookie);
			return;
		}
		else
		{
			for(i=1;i<=tabdivnum;i++)
			{
				tabdiv[i]=getCookie("tabdiv"+i);
			}
			for(i=1;i<=tabdivnum;i++)
			{
			if(tabdiv[i]!=0)
					{
					showtab(tabdivnum,tabdiv[i]); //这里有待优化
					}
			}
			showtab(tabdivnum,fronttotalindex);  //最后将选中的tab显示出来
			SetCookie(); 
		}
		           
	}