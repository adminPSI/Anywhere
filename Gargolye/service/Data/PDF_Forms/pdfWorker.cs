using System.Data;
using System.Runtime.InteropServices;

namespace Anywhere.service.Data.PDF_Forms
{
    public class pdfWorker
    {
        [DllImport("PDFGenerator")]
        public static extern DataSet GetTemplates();


    }
}