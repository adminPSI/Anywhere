using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Anywhere.service.Data.EmailEndpoint.Models
{
    // If you’re sticking with WCF’s DataContractSerializer, decorate these:
    [DataContract]
    public class EmailRequest
    {
        [DataMember]
        public int MessageId { get; set; }

        [DataMember]
        public string ApiKey { get; set; }
    }
}