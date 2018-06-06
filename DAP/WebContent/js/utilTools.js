/**
 * 增加字符串格式化方法，比如：
 * @param src
 */
String.format = function(src){  
    if (arguments.length == 0) return null;  
    var args = Array.prototype.slice.call(arguments, 1);  
    return src.replace(/\{(\d+)\}/g, function(m, i){  
        return args[i];  
    });  
};  
/**
 * CHECK框全选方法
 * @param input1：form名字
 * @param input2：模板check（一般使用this）
 * @return
 */
function chkall(input1,input2)
{
    var objForm = document.forms[input1];
    var objLen = objForm.length;
    for (var iCount = 0; iCount < objLen; iCount++)
    {
        if (input2.checked == true)
        {
            if (objForm.elements[iCount].type == "checkbox")
            {
                objForm.elements[iCount].checked = true;
            }
        }
        else
        {
            if (objForm.elements[iCount].type == "checkbox")
            {
                objForm.elements[iCount].checked = false;
            }
        }
    }
}

/**
 * 获取CHECKBOX的值
 * @param input1：CHECKBOX的名字
 * @return
 */
function getChkValue(input1)
{
	var objForm = document.getElementsByName(input1);
    var objLen = objForm.length;
    var chkValue = '';
    for (var iCount = 0; iCount < objLen; iCount++)
    {
        if (objForm[iCount].checked == true)
        {
            chkValue += objForm[iCount].value + ';';
        }
    }
    return chkValue;
}

/**
 * 获取单选框值
 * @param rdos	单选框对象数组
 * @return
 */
function getRadioValue(rdos){
	var i=0;
	for (i; i<rdos.length; i++){
		if (rdos[i].checked) return rdos[i].value;
	}
	return '';
}

/**
 * 设置单选框选中项为传入值
 * @param rdos	单选框数组
 * @param vle	要选中的值
 * @return
 */
function setRadioValue(rdos,vle){
	var i=0;
	for (i; i<rdos.length; i++){
		if (rdos[i].value == vle){
			rdos[i].checked = true;
			break;
		}
	}
}

/**
 * 传入值如果不是数字则弹出传入的提示内容
 * @param src	待判断值
 * @param txt	提示内容
 * @return
 */
function noNumAlertStr(src, txt){
	if(isNaN(src.value)){
		alert(txt);
		src.focus();
		return;
	}
}

/**
 * 单项选择框选中传入项
 * @param elem		单选框对象
 * @param src		对比值
 * @return
 */
function selectedForValue(elem, src){
	for(var i=0; i<elem.options.length; i++){
		if (elem.options[i].value == src){
			elem.options[i].selected = true;
			break;
		}
	}
}

/**
 * 单选框选中传入项-可多选设置
 * @param elem		单选框对象
 * @param src		对比值
 * @return
 */
function selectedForValueMultiple(elem, srcs){
	for(var i=0; i<elem.options.length; i++){
		for(var m=0; m<srcs.length; m++){
			if (srcs.indexOf(elem.options[i].value)>=0){
				elem.options[i].selected = true;
			}
		}
	}
}

function selectedForValueMultiple2(elem, srcs){
	for(var i=0; i<elem.options.length; i++){
		for(var m=0; m<srcs.length; m++){
			alert(srcs[m]);
			alert(elem.options[i].value);
			if (srcs[m]==elem.options[i].value){
				elem.options[i].selected = true;
			}
		}
	}
}


/**
 * 获取多选框个数
 * @param elem	多选框对象
 * @return		返回选中个数
 */
function getCheckBoxCount(elemName) {
	var elem = document.getElementsByName(elemName);
	var num = 0;
	for (var i=0; i<elem.length; i++){
		if(elem[i].checked)
			num++;
	}
	return num;
}

/**
 * 获取多选框值
 * @param elemName		多选框名称
 * @return
 */
function getCheckBoxValue(elemName){
	var elems = document.getElementsByName(elemName);
	var elemvalues = '';
	for(var i=0; i<elems.length; i++){
		if (elems[i].checked)
			elemvalues += elems[i].value + ',';
	}
	return elemvalues.substring(0, elemvalues.length-1);
}

/**
 * 设置多选框值
 * @param elemName
 * @param src
 * @return
 */
function setCheckBoxValue(elemName,src){
	var elems = document.getElementsByName(elemName);
	for(var i=0; i<elems.length; i++){
		if (src.indexOf(elems[i].value) >= 0){
			elems[i].checked = true;
		}
	}
}

/**
 * 打开新窗体并居中，自动计算位置，使窗体显示居中
 * @param url  地址
 * @param name  窗体标识
 * @param iWidth  窗体宽度
 * @param iHeight 窗体高度
 * @param otherfeatures 其他属性
 * @param isMax 是否最大化，为true窗体宽度和高度无效
 * @return
 */
function openWindowOnCenter(url, name, iWidth, iHeight, otherfeatures, isMax) {
	var iTop;
	var iLeft;
	var features;
	if(typeof isMax!="undefined"&&isMax){
		iTop=0;
		iLeft=0;
		features = "height=" + screen.availHeight + ", width=" + screen.availWidth + ",top="
		+ "0" + ",left=" + "0";
	}
	else{
		iTop = (window.screen.availHeight - 30 - iHeight) / 2;
		iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
		features = "height=" + iHeight + ", width=" + iWidth + ",top="
				+ iTop + ",left=" + iLeft;		
	}

	if (otherfeatures != "")
		features += "," + otherfeatures;
	window.open(url, name, features);
}
/**
 * 在Src中搜索获取指定字符串位置后的部分
 * @param src
 * @param startStr
 * @return
 */
function getSearchAfterStr(src, startStr){
	return src.substring(src.lastIndexOf(startStr)+startStr.length);
}

/**
 * 获取选择框选中的文本内容
 * @param elm
 * @return
 */
function getSelectText(elm){
	var src = '';
	for(var i=0; i<elm.length; i++){
		if (elm.options[i].selected)
			src += elm.options[i].text + ',';
	}
	return src;
}

/**
 * 判断data是否为字母或数字组成
 * @param data
 * @return
 */
function checkNum(data){
	var str=/^[a-z0-9.]*$/gi;
}

/**
 * 计算短信分拆条数以及最后剩余长度
 * @param textSize
 */
function getSMSSplitInfo(textSize){
	if(textSize==0){
		return {"totalSMSCount": 0, "lastSize": 0};
	}
	var count= value=Math.floor((textSize + 6)/67) + 1;
	var last = (textSize + 6)%67;
	return {"totalSMSCount": count, "lastSize": last};
}

/**
 * 日期字符串转时间
 * @param dateStr
 * @returns {Date}
 */
function strToDate(dateStr){
    var arr = dateStr.split('-');
    var result = new Date(arr[0],arr[1]-1,arr[2]);
    return result;
}

/**
 * 计算日期间隔的天数
 * @param sdateStr
 * @param edateStr
 */
function daysBetween(sdateStr, edateStr){
	var days=parseInt(Math.abs(strToDate(edateStr)-strToDate(sdateStr))/1000/60/60/24);
	return days;	
}



