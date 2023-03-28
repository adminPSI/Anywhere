using System;
using System.IO;

namespace Anywhere.forms
{
    public partial class pdfView : System.Web.UI.Page
    {
        MemoryStream gms = null;
        public void main(System.IO.MemoryStream ms)
        {
            gms = ms;
        }
        public void Page_Load(object sender, EventArgs e)
        {
            Response.ContentType = "Application/pdf";
            Response.Write(PSIResponseToSTring(gms));
            Response.End();
        }
        public string PSIResponseToSTring(Stream WebResponse)
        {
            string functionReturnValue = null;

            StreamReader objReader = new StreamReader(WebResponse);

            functionReturnValue = objReader.ReadToEnd();
            WebResponse.Close();

            return functionReturnValue;

        }
    }
}