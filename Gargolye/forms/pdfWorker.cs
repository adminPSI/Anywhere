using System.Data;

namespace Anywhere.forms
{
    public class pdfWorker
    {
        [System.Runtime.InteropServices.DllImport("PDFGenerator")]
        private static extern DataSet GetTemplates();
    }
}