using System;
using System.Collections.Generic;
using System.Data;
using System.Runtime.InteropServices;
using System.Linq;
using System.Web;

namespace Anywhere.service.Data.PDF_Forms
{
    public class pdfWorker
    {
        [DllImport("PDFGenerator")]
        public static extern DataSet GetTemplates();

        
    }
}