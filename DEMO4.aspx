﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DEMO4.aspx.cs" Inherits="DEMO4" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
      
    <link href="css/main.css" rel="stylesheet" type="text/css" />

</head>
<body>
    <form id="form1" runat="server">
    
    <div class=" mtm pam uiBoxYellow">
       此範例主要讓最末端註釋可以換行 , 例如每行註釋前方都有 ※ 符號 , 可是若單行過長則需要
       換行 , 可是前方也不能出現 ※ 符號
    </div>
    <br />
    <div id="tab-commentBr">
         <div data-liartype="text" id="txt_Money" >
            <input type="text"   /></br>
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
            var result = createFreeFormatData('tab-commentBr');
            console.log(result);
        });
       

    </script>

</html>
