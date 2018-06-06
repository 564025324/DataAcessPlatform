<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	hello world!!!
	<div>
		<div class="">跳转至 ：匹配客户账户信息</div>
		<form action="dd_hcdept_ppkhInfo" method="get">
			<input type="submit" value="跳转" />
		</form>
	</div>

	<div>
		<div class="">跳转至：导出对账单</div>
		<form action="exportDzdFile" method="get">
			<input type="submit" value="导出当日对账单"/>
		</form>
		
	</div>

</body>
</html>