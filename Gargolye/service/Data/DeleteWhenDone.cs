using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class DeleteWhenDone
    {
        JavaScriptSerializer js = new JavaScriptSerializer();

        public AnswerObject[] getAndParseJsonFromState()
        {
            string responseFromState = "do your call here to get the Json string"
    
        js.MaxJsonLength = Int32.MaxValue;
        AnswerObject[] filteredObjFromJson = js.Deserialize<AnswerObject[]>(responseFromState);
        foreach (AnswerObject record in filteredObjFromJson)
        {
            if(record.picklistAndRadioOption.Length == 0)
            {
                string label = "";
                string value = "";
                //your insert call below
                insert(record.AnswerKey, record.SortOrder, record.QuestionLabel, record.FieldType, record.QuestionId, record.StepName, record.HelpText, label, value);
            }
            else
            {
                    foreach (PicklistAndRadioOptions opts in record.picklistAndRadioOption)
                    {
                        insert(record.AnswerKey, record.SortOrder, record.QuestionLabel, record.FieldType, record.QuestionId, record.StepName, record.HelpText, opts.label, opts.value);
                    }
            }
                       
        }
        return filteredObjFromJson;
        }

        public class AnswerObject
        {
            public string AnswerKey { get; set; }
            public string SortOrder { get; set; }
            public string QuestionLabel { get; set; }
            public string FieldType { get; set; }
            public string QuestionId { get; set; }
            public string StepName { get; set; }
            public string HelpText { get; set; }
            public PicklistAndRadioOptions[] picklistAndRadioOption { get; set; };
        }

        public class PicklistAndRadioOptions
        {
            public string label { get; set; }
            public string value { get; set; }
        }
    }
}