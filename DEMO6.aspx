﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DEMO6.aspx.cs" Inherits="DEMO6" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
      
    <link href="css/main.css" rel="stylesheet" type="text/css" />

</head>
<body>
    <form id="form1" runat="server">
    
    <div class=" mtm pam uiBoxYellow">
       此範例示範若勾選現金 , 則套印 "支付方式為現金" , 若否 , 則為支票
       <br />
       <br />
       xml 設定檔為 > <br />
       ArrayIndexOf([ {chk_group} ],'1') >= 0 <br />
       ArrayIndexOf([ {chk_group} ],'2') >= 0<br />
       1 跟 2 分別代表 checkgroup 的 val
    </div>
    <br />
    <div id="tab-checkgroup">
       <div id="chk_group" data-liartype="checkgroup">
            <label>
                <input type="radio" id="group1" name="checkgroup1" value="1"> 
                現金
            </label>
            <label>
                <input type="radio" id="group2" name="checkgroup1" value="2"> 
                支票
            </label>     
        </div>
        <br />
        <input type="button" id="gotoPreview" value="套印"/>
    </div>
    </form>
</body>

    <script type="text/javascript" src="Scripts/jquery-1.8.3.min.js"></script>
	<script type="text/javascript" src="Scripts/jquery.liarobject.js"></script>
    <script type="text/javascript" src="Scripts/liar.extend.js"></script>
    <script type="text/javascript" src="Scripts/liar.print.js"></script>

    <script type="text/javascript">
        
        $("#gotoPreview").on('click', function (e) {
            e.preventDefault();
            var result = createFreeFormatData('tab-checkgroup');
            console.log(result);
        });
       

    </script>

</html>
