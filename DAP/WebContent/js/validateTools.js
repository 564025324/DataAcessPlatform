/**
 * 常用字符验证方法
 * 
 */

 /**
  * 检测格式"YYYY-MM-DD"日期的输入，包括日期实际性验证
  * @param {Object} str 
  */
  function checkDate(str){
      var reg =/^[12]\d{3}-(0[1-9]|1[0-2])-([0-2]\d|3[0-1])/;
      if(reg.test(str)){
          var arr = str.split('-');
          var dt2 = new Date(arr[0],arr[1]-1,arr[2]);
          var fullYear = dt2.getFullYear();
          var fullMonth = dt2.getMonth() + 1;
          var date =  dt2.getDate();
          return (arr[0] == fullYear &&arr[1] == fullMonth && arr[2] == date);
      }
      return false;
  }

  /**
   * 检测格式"YYYY-MM-DD HH:MM:SS"日期的输入
   * @param {Object} str 
   */
  function checkDataTime(str){	  
	  var dNum=Date.parse(str.replace(/-/g, "/"));
	  return !isNaN(dNum);
  }
  
  /**
   * 检测格式"HH:MM:SS"日期的输入
   * @param {Object} str 
   */  
  function checkTime(str){	  
	  return checkDataTime("2011-01-01 " + str);	  
  }
  
  /**
   * 校验是否全由数字组成
   * @param {Object} s
   */
  function isDigit(s){
  	var pattern=/^[0-9]/;
	return pattern.test(s);
  }
  
  /**
   * 验证字符串为合法格式的Email
   * @param {Object} src
   */
  function isEmail(src){
	var regEx=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
	regEx.ignoreCase=true;
	return regEx.test(src);
  }
  
  
  function isPhone(data){
  	if(data==null||data==""){
		return false;
	}
	else{
		var regex=new RegExp(/\d{3}-\d{8}|\d{4}-\d{7}/);
		return regex.test(data);
	}	
  }
  /**
   * TODO: 有待完善
   * @param {Object} data
   */
  function isMobile(data){
  	if(data==null||data==""){
		return false;
	}
	else{
		var regex=/[0-9]{1}[0-9]{2,3}-[1-9]{1}[0-9]{5,8}/;
		return regex.test(data);
	}
  }
  
  /**
   * 检查是否为任意实数
   * @param strNumber
   * @return
   */
  function isNumeric(strNumber){
  	var newPar=/^(-|\+)?\d+(\.\d+)?$/;
  	return newPar.test(strNumber);	
  }

  /**
   * 检查是否为正数
   * @param strNumber
   * @return
   */
  function isUnsignedNumeric(strNumber){
  	 var newPar=/^\d+(\.\d+)?$/;
  	 return newPar.test(strNumber);
  };

  /**
   *是否为整数 
   * @param strNumber
   * @return
   */
  function isInteger(strNumber){
  	var newPar=/^(-|\+)?\d+$/;
  	return newPar.test(strNumber);
  }

  /**
   * 是否为正整数
   * @param strInteger
   * @return
   */
  function isUnsignedInteger(strInteger){
  	var newPar=/^\d+$/;
  	return newPar.test(strInteger);
  }  
  
  
