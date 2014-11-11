<%@ WebHandler Language="C#" Class="POS02004" %>

using System;
using System.Web;
using System.IO;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
//回傳RULE XML
public class POS02004 : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        string fileName ="pos.xml";
      
        
        try
        {
            string path = context.Server.MapPath("~/xml") + "/" + fileName;
            string content = System.IO.File.OpenText(path).ReadToEnd();

            response.Write(JsonConvert.SerializeObject(new { Code = 200, Data = content }, Formatting.Indented));

        }
        catch (Exception e)
        {
            response.Write(JsonConvert.SerializeObject(new { Code = 500, Msg = e.StackTrace }, Formatting.Indented));
        }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }


   

}