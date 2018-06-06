<%@ Page language="c#" Codebehind="WebForm1.aspx.cs" AutoEventWireup="false" Inherits="Calendardemo.WebForm1" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>WebForm1</title>
		<LINK HREF="Calendar.css" TYPE="text/css" REL="stylesheet">
		<script language="javascript" src="Calendar.js"></script>
	</HEAD>
	<body>
		<form id="Form1" method="post" runat="server">
			<table cellSpacing="1" cellPadding="1" width="936" border="0" height="29" style="LEFT: 10px; POSITION: absolute; TOP: 15px">
				<tr>
					<td>
						<!--日期实例化--begin-->
						<asp:TextBox id="txtDATE" runat="server" onchange='javascript:gChangeDate(this,0);' onblur='javascript:gChangeDate(this,0);'></asp:TextBox>
						<INPUT TYPE="button" value='...' NAME='bntDATE' OnClick='showCalendar(txtDATE,0)' class="button">
						<!--end-->
						<select size="1" name="REC_SOURCE_SCUR">
							<OPTION VALUE="" selected></OPTION>
							<OPTION VALUE="1">1</OPTION>
							<OPTION VALUE="2">2</OPTION>
						</select>&nbsp;
						<asp:Button id="Button1" runat="server" Text="Button"></asp:Button>
					</td>
				</tr>
			</table>
		</form>
	</body>
</HTML>
