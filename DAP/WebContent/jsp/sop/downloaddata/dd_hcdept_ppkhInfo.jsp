<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<link type="text/css" rel="stylesheet" href="<%=path%>/css/style.css ">
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/js/jquery-easyui-1.0.5/themes/default/easyui.css">
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/js/jquery-easyui-1.0.5/themes/icon.css">
<script type="text/javascript" src="<%=path%>/js/jquery-1.4.2.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/jquery-easyui-1.0.5/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/Calendar/My97DatePicker/WdatePicker.js"></script>
<script language="JavaScript">
	$(document).ready(function() {
		$('.Wdate').click(function() {
			WdatePicker()
		});
	})

	$(function() {
		//导入原始数据操作
		$("#importExcel").click(function() {
			var file = document.getElementById("upload").value;
			var suffixname = file.substr(file.lastIndexOf(".")).toLowerCase();
			if (suffixname == null || suffixname == "") {
				$.messager.alert('系统提示信息', '请上传文件', 'error');
				return;
			} else if (suffixname != ".xls") {
				$.messager.alert('系统提示信息', '请上传.xls格式文件', 'error');
				return;
			}
			document.importForm.submit();
		});

		//导出提数结果
		$("#exportExcel").click(function() {
			window.open("ppkh_exportExcel");
		});
	})
</script>
</head>
<!-- onKeyDown="JavaScript:bodyonkeydown()" -->
<body>

	<table width="98%" border="0" class="tablecolor" align="center"
		cellpadding="0" cellspacing="0">
		<tr>
			<td class="whiteline" height="20">
				<table width="99%" align="left" border="0" cellpadding="0"
					cellspacing="0">
					<tr>
						<td align="left" class="tabletitle">客户匹配账户信息</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td><form method="post" action="dd_hcdept_pphkquery">
					<table width="99%" border="0" align="center" class="tablecontent"
						cellspacing="1" cellpadding="1">
						<tr valign="middle">
							<td width="20%">客户手机号 <input type="text" /></td>
							<td width="20%">客户姓名 <input type="text" /></td>
							<td align="left" width="40%"><input type="button"
								id="queryButton" class="btn2" value="查 询"></td>
							<td><input type="reset" class="btn2" value="重 置"></td>
						</tr>
					</table>
				</form></td>
			<td><form action="ppkh_importFile" id="importForm"
					name="importForm" method="post" enctype="multipart/form-data">
					<table>
						<tr>
							<td width="50%"><input type="file" id="upload" name="upload"
								size="20" /> <input type="button" id="importExcel" class="btn2"
								value="导 入" /></td>
							<td width="50%"><input type="button" id="exportExcel"
								class="btn2" value="导 出" /></td>
						</tr>
					</table>
				</form></td>
		</tr>
		<tr>
			<td height="5"></td>
		</tr>
	</table>

	<table width="98%" border="0" class="tablecolor" align="center"
		cellpadding="1" cellspacing="1">
		<thead class="tablelisttitle">
			<tr height="25">
				<th>姓名</th>
				<th>开户日期</th>
				<th>时点资产</th>
				<th>半年资产峰值</th>
				<th>半年市值峰值</th>
				<th>一年资产峰值</th>
				<th>一年市值峰值</th>
				<th>归属人</th>
				<th>归属人部门</th>
				<th>归属类型</th>
				<th>客户风险等级</th>
				<th>客户风测日期</th>
			</tr>
		</thead>
		<tr style="text-align: center;">
			<td>ddaction1</td>
			<td>ddaction1</td>
			<td>ddaction1</td>
			<td>ddaction1</td>
			<td>1</td>
			<td>1</td>
			<td>ddaction1</td>
			<td>ddaction1</td>
			<td>1</td>
			<td>ddaction1</td>
			<td>ddaction1</td>
			<td>1</td>
		</tr>

	</table>
</body>

</html>