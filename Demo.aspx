<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Demo.aspx.cs" Inherits="Demo" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div id="tab-home">
		
        <div data-liartype="text" id="txt_ID">
            <input type="text"   /></br>
        </div>
          <div data-liartype="text" id="txt_NAME">
             <input type="text"   /></br>
        </div>
          <div data-liartype="text"  id="txt_GENDER">
             <input type="text"  /></br>
        </div>
          <div data-liartype="text" id="txt_BIRTH">
            <input type="text"   /></br>
        </div>

        <hr />

          <div data-liartype="text" id="txt_ID2">
            <input type="text"   /></br>
        </div>
          <div data-liartype="text" id="txt_NAME2">
             <input type="text"   /></br>
        </div>
          <div data-liartype="text"  id="txt_GENDER2">
             <input type="text"  /></br>
        </div>
          <div data-liartype="text" id="txt_BIRTH2">
            <input type="text"   /></br>
        </div>

        <input type="button" id="gotoPreview" value="套印"/>
    </div>

        <div id="result" style="width:200px;"></div>
    </form>
</body>
    <script type="text/javascript" src="Scripts/jquery-1.8.3.min.js"></script>
	<script type="text/javascript" src="Scripts/jquery.liarobject.js"></script>
    <script type="text/javascript" src="Scripts/liar.extend.js"></script>
    <script type="text/javascript" src="Scripts/liar.print.js"></script>

    <script type="text/javascript">

        $("#gotoPreview").on('click', function (e) {
            e.preventDefault();
            var result = createFreeFormatData();
            console.log(result);
        });
       

    </script>
</html>
