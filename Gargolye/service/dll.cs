// Decompiled with JetBrains decompiler
// Type: Anywhere.service.Data.AssessmentReportSQL
// Assembly: Anywhere, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: DC308BEB-95AA-4B64-ACB0-2239594FF41B
// Assembly location: C:\Users\mike.taft\Desktop\Anywhere.dll

using Anywhere.Log;
using System;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Text;

namespace Anywhere.service.Data
{
    public class dll
    {
        private static Loger logger = new Loger();
        private StringBuilder sb = new StringBuilder();
        private Sybase di = new Sybase();

        public DataSet AssesmentHeader(long AssesmentID)
        {
            this.sb.Clear();
            this.sb.Append("SELECT   DBA.anyw_isp_consumer_plans.plan_type, DBA.anyw_isp_consumer_plans.plan_year_start, ");
            this.sb.Append("DBA.anyw_isp_consumer_plans.plan_year_end, DBA.anyw_isp_consumer_plans.active, ");
            this.sb.Append("DBA.anyw_isp_consumer_plans.revision_number, DBA.anyw_isp_consumer_plans.plan_status, ");
            this.sb.Append("DBA.People.Last_Name, DBA.People.First_Name, DBA.anyw_isp_consumer_plans.effective_start, ");
            this.sb.Append("DBA.People.Middle_Name ");
            this.sb.Append("FROM     DBA.anyw_isp_consumer_plans ");
            this.sb.Append("LEFT OUTER JOIN DBA.People ON DBA.anyw_isp_consumer_plans.consumer_id = DBA.People.ID ");
            this.sb.AppendFormat("WHERE DBA.anyw_isp_consumer_plans.isp_consumer_plan_id = {0} ", (object)AssesmentID);
            return this.di.SelectRowsDS(this.sb.ToString());
        }

        public DataSet AssesmentAnswers(long AssesmentID, bool Assessment)
        {
            this.sb.Clear();
            this.sb.Append("SELECT  DBA.anyw_isp_consumer_assessment_answers.answer, DBA.anyw_isp_assessment_sections.section_title, ");
            this.sb.Append("DBA.anyw_isp_assessment_sections.section_order, DBA.anyw_isp_assessment_subsections.subsection_title, ");
            this.sb.Append("DBA.anyw_isp_assessment_subsections.subsection_order, DBA.anyw_isp_assessment_questions.isp_assessment_question_id, ");
            this.sb.Append("DBA.anyw_isp_assessment_questions.question_text, DBA.anyw_isp_assessment_questions.question_order, ");
            this.sb.Append("DBA.anyw_isp_assessment_questions.answer_style, DBA.anyw_isp_assessment_question_sets.answer_rowcount,  ");
            this.sb.Append("DBA.anyw_isp_assessment_question_sets.question_set_order, DBA.anyw_isp_assessment_question_sets.allow_additional_answer_rows, ");
            this.sb.Append("DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id, answer_row, 0 AS ColumnNumber, ");
            this.sb.Append(" DBA.anyw_isp_assessment_question_sets.question_set_type, DBA.anyw_isp_assessment_question_sets.question_set_title, '' AS PlanStatus, ");
            this.sb.Append("0 AS ColumnCount, DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id, dba.anyw_isp_assessment_questions.question_prompt, 0 AS ISP, ");
            this.sb.Append("dba.ANYW_ISP_Assessment_Questions.hide_on_assessment, DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id, -1 AS SubSectionCount,  ");
            this.sb.Append("SectionAllowable.Applicable AS SectionAllowable ");
            this.sb.Append("FROM DBA.anyw_isp_assessment_question_sets ");
            this.sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_subsections ON DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id = DBA.anyw_isp_assessment_subsections.isp_assessment_subsection_id ");
            this.sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_sections ON DBA.anyw_isp_assessment_question_sets.isp_assessment_section_id = DBA.anyw_isp_assessment_sections.isp_assessment_section_id ");
            this.sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_assessment_questions ON DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id ");
            this.sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_assessment_answers ON DBA.anyw_isp_assessment_questions.isp_assessment_question_id = DBA.anyw_isp_consumer_assessment_answers.isp_assessment_question_id ");
            this.sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Plan_Section_Applicable SectionAllowable ON DBA.anyw_isp_assessment_sections.isp_assessment_section_id = SectionAllowable.ISP_Assessment_Section_ID ");
            this.sb.AppendFormat("WHERE DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id = {0} ", (object)AssesmentID);
            this.sb.AppendFormat("AND SectionAllowable.ISP_Assessment_ID = {0} ", (object)AssesmentID);
            this.sb.Append("AND SectionAllowable.Applicable = 'y' ");
            if (Assessment)
                this.sb.Append("AND dba.ANYW_ISP_Assessment_Questions.hide_on_assessment IS NULL ");
            this.sb.Append("ORDER BY DBA.anyw_isp_assessment_sections.section_order, ");
            this.sb.Append("DBA.anyw_isp_assessment_subsections.subsection_order, ");
            this.sb.Append("DBA.anyw_isp_assessment_questions.question_order ");
            DataTable table = this.di.SelectRowsDS(this.sb.ToString()).Tables[0];
            foreach (DataRow row1 in (InternalDataCollectionBase)table.Rows)
            {
                if (row1["question_set_type"].ToString().ToUpper() == "GRID")
                {
                    row1["ColumnNumber"] = row1["question_order"];
                    row1["question_order"] = (object)1;
                }
                DateTime result;
                if (DateTime.TryParse(row1["answer"].ToString(), out result))
                    row1["answer"] = (object)result.ToString("MM/dd/yyyy");
                if (row1["question_set_type"].ToString().ToUpper() == "GRID")
                {
                    this.sb.Clear();
                    this.sb.Append("SELECT   MAX(DBA.anyw_isp_assessment_questions.question_order) AS ColumnCount ");
                    this.sb.Append("FROM DBA.anyw_isp_assessment_question_sets ");
                    this.sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_assessment_questions ON DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id ");
                    this.sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_assessment_answers ON DBA.anyw_isp_consumer_assessment_answers.isp_assessment_question_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_id ");
                    this.sb.AppendFormat("WHERE   DBA.anyw_isp_assessment_question_sets.question_set_type = 'GRID' ");
                    this.sb.AppendFormat("AND DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id = {0} ", row1["isp_assessment_question_set_id"]);
                    if (Assessment)
                        this.sb.Append("AND dba.ANYW_ISP_Assessment_Questions.hide_on_assessment IS NULL ");
                    row1["Columncount"] = this.di.SelectRowsDS(this.sb.ToString()).Tables[0].Rows[0]["Columncount"];
                    if (int.Parse(row1["Columncount"].ToString()) > 3)
                        row1["Columncount"] = (object)3;
                }
                if (row1["question_text"].ToString() == "Who Said it?" && row1["answer"].ToString() != string.Empty)
                {
                    this.sb.Clear();
                    this.sb.Append("SELECT  DBA.People.Last_Name, DBA.People.First_Name ");
                    this.sb.Append("FROM  DBA.People ");
                    this.sb.AppendFormat("WHERE DBA.People.id = {0} ", row1["answer"]);
                    DataRow row2 = this.di.SelectRowsDS(this.sb.ToString()).Tables[0].Rows[0];
                    string str = string.Format("{0}, {1}", row2["Last_Name"], row2["First_Name"]);
                    row1["answer"] = (object)str;
                }
                this.sb.Clear();
                this.sb.Append("SELECT   COUNT(DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id) AS Counter ");
                this.sb.Append("FROM dba.ANYW_ISP_Assessment_Question_Sets ");
                this.sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Assessment_Questions ON dba.ANYW_ISP_Assessment_Question_Sets.isp_assessment_question_set_id = dba.ANYW_ISP_Assessment_Questions.isp_assessment_question_set_id ");
                this.sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Consumer_Assessment_Answers ON dba.ANYW_ISP_Assessment_Questions.isp_assessment_question_id = dba.ANYW_ISP_Consumer_Assessment_Answers.isp_assessment_question_id ");
                this.sb.AppendFormat("WHERE   DBA.anyw_isp_consumer_assessment_answers.answer > '0' ");
                this.sb.AppendFormat("AND DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id = {0} ", (object)AssesmentID);
                this.sb.AppendFormat("AND DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id = {0} ", row1["isp_assessment_subsection_id"]);
                row1["SubSectionCount"] = (object)this.di.QueryScalar(this.sb.ToString());
                if (row1["section_order"].ToString() == "5" && row1["subsection_order"].ToString() == "4" && Convert.ToInt16(row1["question_set_order"]) > (short)2)
                    row1["question_set_order"] = (object)((int)Convert.ToInt16(row1["question_set_order"]) + 1);
            }
            DataRow row = table.NewRow();
            row["section_order"] = (object)"5";
            row["subsection_order"] = (object)"4";
            row["question_set_order"] = (object)"3";
            this.sb.Clear();
            this.sb.Append("SELECT   Path_To_Employment ");
            this.sb.Append("FROM     DBA.anyw_isp_consumer_plans ");
            this.sb.AppendFormat("WHERE   isp_consumer_plan_id = {0} ", (object)AssesmentID);
            row["answer"] = (object)this.di.QueryScalar(this.sb.ToString());
            table.Rows.Add(row);
            table.AcceptChanges();
            return table.DataSet;
        }

        public DataSet ISPSummary(
          long AssesmentID,
          bool Assessment,
          string WhichISPArea,
          bool Advisor = false)
        {
            string str1 = "Vendor";
            if (Advisor)
                str1 = "Vendors";
            this.sb.Clear();
            this.sb.Append("SELECT  DBA.anyw_isp_consumer_assessment_answers.answer, DBA.anyw_isp_assessment_sections.section_title, ");
            this.sb.Append("DBA.anyw_isp_assessment_sections.section_order, DBA.anyw_isp_assessment_subsections.subsection_title, ");
            this.sb.Append("DBA.anyw_isp_assessment_subsections.subsection_order, DBA.anyw_isp_assessment_questions.isp_assessment_question_id, ");
            this.sb.Append("DBA.anyw_isp_assessment_questions.question_text, DBA.anyw_isp_assessment_questions.question_order, ");
            this.sb.Append("DBA.anyw_isp_assessment_questions.answer_style, DBA.anyw_isp_assessment_question_sets.answer_rowcount,  ");
            this.sb.Append("DBA.anyw_isp_assessment_question_sets.question_set_order, DBA.anyw_isp_assessment_question_sets.allow_additional_answer_rows, ");
            this.sb.Append("DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id, DBA.anyw_isp_consumer_assessment_answers.answer_row, 0 AS ColumnNumber, ");
            this.sb.Append("DBA.anyw_isp_assessment_question_sets.question_set_type, DBA.anyw_isp_assessment_question_sets.question_set_title, '' AS PlanStatus, ");
            this.sb.Append("0 AS ColumnCount, DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id, DBA.anyw_isp_assessment_questions.question_prompt, 0 AS ISP, ");
            this.sb.Append("DBA.anyw_isp_consumer_plans.Alone_Time_Amount, DBA.anyw_isp_consumer_plans.Provider_Back_Up, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Plans.Best_Way_To_Connect, DBA.ANYW_ISP_Consumer_Plans.More_Detail, DBA.ANYW_ISP_Consumer_Plans.Path_To_Employment ");
            this.sb.Append("FROM DBA.anyw_isp_assessment_question_sets ");
            this.sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_subsections ON DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id = DBA.anyw_isp_assessment_subsections.isp_assessment_subsection_id ");
            this.sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_sections ON DBA.anyw_isp_assessment_question_sets.isp_assessment_section_id = DBA.anyw_isp_assessment_sections.isp_assessment_section_id ");
            this.sb.Append("RIGHT OUTER JOIN  DBA.anyw_isp_assessment_questions ON DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id ");
            this.sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_assessment_answers ON DBA.anyw_isp_assessment_questions.isp_assessment_question_id = DBA.anyw_isp_consumer_assessment_answers.isp_assessment_question_id ");
            this.sb.Append("LEFT OUTER JOIN DBA.anyw_isp_consumer_plans ON DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id = dba.anyw_isp_consumer_plans.isp_consumer_plan_id ");
            this.sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Plan_Section_Applicable SectionAllowable ON DBA.anyw_isp_assessment_sections.ISP_Assessment_Section_ID = SectionAllowable.ISP_Assessment_Section_ID ");
            this.sb.AppendFormat("WHERE DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id = {0} ", (object)AssesmentID);
            this.sb.AppendFormat("AND SectionAllowable.ISP_Assessment_ID = {0} ", (object)AssesmentID);
            this.sb.Append("AND SectionAllowable.Applicable = 'y' ");
            string upper = WhichISPArea.ToUpper();
            if (!(upper == "SUMMARY"))
            {
                if (!(upper == "SKILLS"))
                {
                    if (upper == "SUPERVISION")
                        this.sb.Append("AND (DBA.anyw_isp_assessment_questions.question_tag Like '%_risks%') ");
                }
                else
                {
                    this.sb.Append("AND (DBA.anyw_isp_assessment_questions.question_tag Like '%_skills%' or DBA.anyw_isp_assessment_questions.question_tag Like '%Place on path to COMMUNITY%' ");
                    this.sb.Append("or DBA.anyw_isp_assessment_questions.question_tag Like '%Best way to connect%' or DBA.anyw_isp_assessment_questions.question_tag = 'communication_skillsWayToConnect' ");
                    this.sb.Append("or DBA.anyw_isp_assessment_questions.question_tag = 'dailylife_skillsEmploymentPath') ");
                }
            }
            else
                this.sb.Append("AND (DBA.anyw_isp_assessment_questions.question_tag Like '%_importantTo%' or DBA.anyw_isp_assessment_questions.question_tag Like '%_importantFor%')  ");
            if (Assessment)
                this.sb.Append("AND dba.ANYW_ISP_Assessment_Questions.hide_on_assessment IS NULL ");
            this.sb.Append("ORDER BY DBA.anyw_isp_assessment_sections.section_order, ");
            this.sb.Append("DBA.anyw_isp_assessment_subsections.subsection_order, ");
            this.sb.Append("DBA.anyw_isp_assessment_questions.question_order ");
            DataTable table = this.di.SelectRowsDS(this.sb.ToString()).Tables[0];
            foreach (DataRow row1 in (InternalDataCollectionBase)table.Rows)
            {
                if (row1["question_set_type"].ToString().ToUpper() == "GRID")
                    row1["ColumnNumber"] = row1["question_order"];
                DateTime result;
                if (DateTime.TryParse(row1["answer"].ToString(), out result))
                    row1["answer"] = (object)result.ToString("MM/dd/yyyy");
                if (row1["question_set_type"].ToString().ToUpper() == "GRID")
                {
                    this.sb.Clear();
                    this.sb.Append("SELECT   MAX(DBA.anyw_isp_assessment_questions.question_order) AS ColumnCount ");
                    this.sb.Append("FROM DBA.anyw_isp_assessment_question_sets ");
                    this.sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_assessment_questions ON DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id ");
                    this.sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_assessment_answers ON DBA.anyw_isp_consumer_assessment_answers.isp_assessment_question_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_id ");
                    this.sb.AppendFormat("WHERE   DBA.anyw_isp_assessment_question_sets.question_set_type = 'GRID' ");
                    this.sb.AppendFormat("AND DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id = {0} ", row1["isp_assessment_question_set_id"]);
                    if (Assessment)
                        this.sb.Append("AND dba.ANYW_ISP_Assessment_Questions.hide_on_assessment IS NULL ");
                    row1["Columncount"] = this.di.SelectRowsDS(this.sb.ToString()).Tables[0].Rows[0]["Columncount"];
                    if (int.Parse(row1["Columncount"].ToString()) > 3)
                        row1["Columncount"] = (object)3;
                }
                string empty = string.Empty;
                if (row1["question_text"].ToString().Equals("Who is responsible:") && row1["answer"].ToString() != string.Empty)
                {
                    string str2;
                    if (row1["answer"].ToString().ToUpper().Contains("V"))
                    {
                        this.sb.Clear();
                        this.sb.AppendFormat("SELECT  DBA.{0}.Name ", (object)str1);
                        this.sb.AppendFormat("FROM  DBA.{0} ", (object)str1);
                        this.sb.AppendFormat("WHERE DBA.{0}.Vendor_ID = {1} ", (object)str1, (object)row1["answer"].ToString().ToUpper().Replace("V", ""));
                        str2 = string.Format("{0}", (object)this.di.SelectRowsDS(this.sb.ToString()).Tables[0].Rows[0]["Name"].ToString());
                    }
                    else
                    {
                        this.sb.Clear();
                        this.sb.Append("SELECT  DBA.People.Last_Name, DBA.People.First_Name ");
                        this.sb.Append("FROM  DBA.People ");
                        this.sb.AppendFormat("WHERE DBA.People.id = {0} ", row1["answer"]);
                        DataRow row2 = this.di.SelectRowsDS(this.sb.ToString()).Tables[0].Rows[0];
                        str2 = string.Format("{0}, {1}", row2["Last_Name"], row2["First_Name"]);
                    }
                    row1["answer"] = (object)str2;
                }
            }
            return table.DataSet;
        }

        public DataSet ISPOutcomes(long AssesmentID, bool Advisor = false)
        {
            string str = "Vendor";
            if (Advisor)
                str = "Vendors";
            this.sb.Clear();
            this.sb.Append("SELECT DBA.ANYW_ISP_Outcomes.ISP_Consumer_Plan_ID AS Expr1, DBA.ANYW_ISP_Outcomes.ISP_Consumer_Outcome_ID, DBA.ANYW_ISP_Outcomes.Outcome, ");
            this.sb.Append("DBA.ANYW_ISP_Outcomes.Details, DBA.ANYW_ISP_Outcomes.History, DBA.ANYW_ISP_Outcomes.ISP_Assessment_Section_ID, DBA.ANYW_ISP_Outcomes.Outcome_Order, ");
            this.sb.Append("DBA.ANYW_ISP_Outcomes_Experiences.ISP_Outcome_Experiences_ID, DBA.ANYW_ISP_Outcomes_Experiences.What_Happened, DBA.ANYW_ISP_Outcomes_Experiences.How_Happened, ");
            this.sb.Append("DBA.ANYW_ISP_Outcomes_Experiences.Outcome_Experience_Order, DBA.ANYW_ISP_Consumer_Outcome_Reviews.What_Will_Happen,  ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Outcome_Reviews.Outcome_Review_Order, DBA.ANYW_ISP_Consumer_Outcome_Reviews.ISP_Outcomes_Review_ID, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Outcome_Reviews.Who, DBA.ANYW_ISP_Consumer_Outcome_Reviews.When_To_Check_In, DBA.ANYW_ISP_Outcomes_Progress_Summary.Progress_Summary, ");
            this.sb.AppendFormat("People_1.Last_Name AS ContactLastName, People_1.First_Name AS ContactFirstName, DBA.{0}.Name AS ProviderName, ", (object)str);
            this.sb.Append("DBA.ANYW_ISP_Outcome_Experience_Responsibility.When_How_Often_Value AS HowOftenValue, DBA.ANYW_ISP_Outcome_Experience_Responsibility.Outcome_Experience_Responsibility_ID, ");
            this.sb.Append("DBA.ANYW_ISP_Outcome_Experience_Responsibility.When_How_Often_Frequency AS HowOftenFrequency, DBA.ANYW_ISP_Outcome_Experience_Responsibility.When_How_Often_Other AS HowOftenOther, ");
            this.sb.Append("DBA.People.First_Name + ' ' + DBA.People.Last_Name AS Who2 ");
            this.sb.Append("FROM DBA.ANYW_ISP_Outcomes ");
            this.sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Outcomes_Experiences ON DBA.ANYW_ISP_Outcomes.ISP_Consumer_Outcome_ID = DBA.ANYW_ISP_Outcomes_Experiences.ISP_Consumer_Outcome_ID ");
            this.sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Outcome_Experience_Responsibility ON DBA.ANYW_ISP_Outcomes_Experiences.ISP_Outcome_Experiences_ID = DBA.ANYW_ISP_Outcome_Experience_Responsibility.ISP_Outcome_Experiences_ID ");
            this.sb.Append("LEFT OUTER JOIN DBA.People People_1 ON DBA.ANYW_ISP_Outcome_Experience_Responsibility.Responsible_Contact = People_1.ID ");
            this.sb.AppendFormat("LEFT OUTER JOIN DBA.{0} ON DBA.ANYW_ISP_Outcome_Experience_Responsibility.Responsible_Provider = DBA.{0}.Vendor_ID ", (object)str);
            this.sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Outcomes_Progress_Summary ON DBA.ANYW_ISP_Outcomes.ISP_Consumer_Plan_ID = DBA.ANYW_ISP_Outcomes_Progress_Summary.ISP_Consumer_Plan_ID ");
            this.sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Consumer_Outcome_Reviews ON DBA.ANYW_ISP_Outcomes.ISP_Consumer_Outcome_ID = DBA.ANYW_ISP_Consumer_Outcome_Reviews.ISP_Consumer_Outcome_ID ");
            this.sb.Append("LEFT OUTER JOIN DBA.People ON DBA.ANYW_ISP_Consumer_Outcome_Reviews.ID = DBA.People.ID ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Outcomes.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
            this.sb.Append("ORDER BY DBA.ANYW_ISP_Outcomes.Outcome_Order ASC, ");
            this.sb.Append("DBA.ANYW_ISP_Outcomes_Experiences.Outcome_Experience_Order ASC, DBA.ANYW_ISP_Consumer_Outcome_Reviews.Outcome_Review_Order ASC, ");
            this.sb.Append("DBA.ANYW_ISP_Outcome_Experience_Responsibility.Outcome_Experience_Responsibility_ID ASC");
            return this.di.SelectRowsDS(this.sb.ToString()).Tables[0].DataSet;
        }

        public DataSet ISPServices(long AssesmentID, bool Advisor = false)
        {
            string str1 = "Vendor";
            string str2 = "Funding_Source_Info";
            string str3 = "Description";
            if (Advisor)
            {
                str1 = "Vendors";
                str2 = "Funding_Sources";
                str3 = "Funding_Source_Name";
            }
            this.sb.Clear();
            this.sb.Append("SELECT   DBA.ANYW_ISP_Services_Paid_Support.ISP_Paid_Support_ID, DBA.ANYW_ISP_Services_Paid_Support.ISP_Assessment_Id, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Paid_Support.Provider_ID, DBA.ANYW_ISP_Services_Paid_Support.Assessment_Area_ID, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Paid_Support.Service_Name_Id, DBA.ANYW_ISP_Services_Paid_Support.Scope_Of_Service, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Paid_Support.How_Often_Value, DBA.ANYW_ISP_Services_Paid_Support.How_Often_Frequency, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Paid_Support.How_Often_Text, DBA.ANYW_ISP_Services_Paid_Support.Begin_Date, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Paid_Support.End_Date, DBA.ANYW_ISP_Services_Paid_Support.Funding_Source_Text, ");
            this.sb.AppendFormat("DBA.ANYW_ISP_Services_Paid_Support.Row_Order, DBA.Service_Types.Description, DBA.{0}.{1} AS FundingSource, ", (object)str2, (object)str3);
            this.sb.AppendFormat("DBA.{0}.Name AS Provider, DBA.anyw_isp_assessment_sections.section_title AS Area, DBA.ANYW_ISP_Services_Paid_Support.Funding_Source, ", (object)str1);
            this.sb.Append("DBA.ANYW_ISP_Services_Paid_Support.Additional_Service_Name ");
            this.sb.Append("FROM DBA.anyw_isp_assessment_sections ");
            this.sb.Append("RIGHT OUTER JOIN DBA.ANYW_ISP_Services_Paid_Support ON DBA.anyw_isp_assessment_sections.isp_assessment_section_id = DBA.ANYW_ISP_Services_Paid_Support.Assessment_Area_ID ");
            this.sb.AppendFormat("LEFT OUTER JOIN DBA.{0} ON DBA.ANYW_ISP_Services_Paid_Support.Provider_ID = DBA.{0}.Vendor_ID ", (object)str1);
            this.sb.AppendFormat("LEFT OUTER JOIN DBA.{0} ON DBA.ANYW_ISP_Services_Paid_Support.Funding_Source = DBA.{0}.Funding_Source_ID ", (object)str2);
            this.sb.Append("LEFT OUTER JOIN DBA.Service_Types ON DBA.ANYW_ISP_Services_Paid_Support.Additional_Service_Name = DBA.Service_Types.Service_Type_ID ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Services_Paid_Support.ISP_Assessment_Id = {0} ", (object)AssesmentID);
            this.sb.Append("ORDER BY Provider, DBA.ANYW_ISP_Services_Paid_Support.Row_Order ");
            DataTable table = this.di.SelectRowsDS(this.sb.ToString()).Tables[0];
            foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
            {
                if (row.Field<int>("Funding_Source") == 5)
                    row["Provider"] = (object)string.Empty;
            }
            return table.DataSet;
        }

        public DataSet ISPModifiers(long AssesmentID)
        {
            this.sb.Clear();
            this.sb.Append("SELECT   ISP_Modification_ID, ISP_Assessment_Id, Medical_Rate, Behavior_Rate, ");
            this.sb.Append("ICF_Rate, Complex_Rate, Developmental_Rate, Child_Intensive_Rate ");
            this.sb.Append("FROM DBA.ANYW_ISP_Services_Modification ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Services_Modification.ISP_Assessment_Id = {0} ", (object)AssesmentID);
            return this.di.SelectRowsDS(this.sb.ToString()).Tables[0].DataSet;
        }

        public DataSet ISPAdditionalSupports(long AssesmentID)
        {
            this.sb.Clear();
            this.sb.Append(" SELECT   DBA.ANYW_ISP_Services_Additional_Support.ISP_Services_Additional_Support_ID, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Additional_Support.ISP_Assessment_Id, DBA.ANYW_ISP_Services_Additional_Support.Assessment_Area_ID, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Additional_Support.Who_Supports, DBA.ANYW_ISP_Services_Additional_Support.What_Support_Looks_Like, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Additional_Support.How_Often_Value, DBA.ANYW_ISP_Services_Additional_Support.How_Often_Frequency, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Additional_Support.How_Often_Text, DBA.ANYW_ISP_Services_Additional_Support.Row_Order, ");
            this.sb.Append("DBA.anyw_isp_assessment_sections.section_title, DBA.People.Last_Name, DBA.People.First_Name ");
            this.sb.Append("FROM DBA.ANYW_ISP_Services_Additional_Support ");
            this.sb.Append("LEFT OUTER JOIN DBA.People ON DBA.ANYW_ISP_Services_Additional_Support.Who_Supports = DBA.People.ID ");
            this.sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_sections ON DBA.ANYW_ISP_Services_Additional_Support.Assessment_Area_ID = DBA.anyw_isp_assessment_sections.isp_assessment_section_id ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Services_Additional_Support.ISP_Assessment_Id = {0} ", (object)AssesmentID);
            return this.di.SelectRowsDS(this.sb.ToString()).Tables[0].DataSet;
        }

        public DataSet ISPReferrals(long AssesmentID)
        {
            this.sb.Clear();
            this.sb.Append("SELECT   DBA.ANYW_ISP_Services_Referral.ISP_Services_Referral_ID, DBA.ANYW_ISP_Services_Referral.ISP_Assessment_Id, DBA.ANYW_ISP_Services_Referral.Assessment_Area_ID, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Referral.New_Or_Existing, DBA.ANYW_ISP_Services_Referral.Who_Supports, DBA.ANYW_ISP_Services_Referral.Reason_For_Referral, ");
            this.sb.Append("DBA.ANYW_ISP_Services_Referral.Row_Order, DBA.anyw_isp_assessment_sections.section_title, DBA.People.Last_Name, DBA.People.First_Name ");
            this.sb.Append("FROM DBA.ANYW_ISP_Services_Referral ");
            this.sb.Append("LEFT OUTER JOIN DBA.People ON DBA.ANYW_ISP_Services_Referral.Who_Supports = DBA.People.ID ");
            this.sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_sections ON DBA.ANYW_ISP_Services_Referral.Assessment_Area_ID = DBA.anyw_isp_assessment_sections.isp_assessment_section_id ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Services_Referral.ISP_Assessment_Id = {0} ", (object)AssesmentID);
            return this.di.SelectRowsDS(this.sb.ToString()).Tables[0].DataSet;
        }

        public DataSet ISPTeamMembers(long AssesmentID, bool Advisor = false)
        {
            string str = "Vendor";
            if (Advisor)
                str = "Vendors";
            this.sb.Clear();
            this.sb.Append("SELECT   ISP_Consumer_Informed_Consent_ID, ISP_Consumer_Plan_ID, RM_Identified, RM_HRC_Date, RM_Keep_Self_Safe, ");
            this.sb.Append("RM_Fade_Restriction, RM_What_Could_Happen_Good, RM_What_Could_Happen_Bad, RM_Other_Way_Help_Good, RM_Other_Way_Help_Bad ");
            this.sb.AppendFormat("FROM DBA.{0} ", (object)str);
            this.sb.AppendFormat("RIGHT OUTER JOIN DBA.ANYW_ISP_Consumer_Informed_Consent ON DBA.{0}.Vendor_ID = DBA.ANYW_ISP_Consumer_Informed_Consent.CS_Contact_Provider_Vendor_ID ", (object)str);
            this.sb.Append("LEFT OUTER JOIN DBA.People ON DBA.ANYW_ISP_Consumer_Informed_Consent.CS_Change_Mind_SSA_People_ID = DBA.People.ID ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Consumer_Informed_Consent.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
            return this.di.SelectRowsDS(this.sb.ToString()).Tables[0].DataSet;
        }

        public DataSet ISPTeamMembers2(long AssesmentID, bool Advisor = false)
        {
            if (Advisor)
            {
                this.sb.Clear();
                this.sb.AppendFormat("SELECT   dba.ANYW_ISP_Signatures.ISP_Consumer_Signature_ID, dba.Vendors.Name, dba.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID, ");
                this.sb.Append("dba.ANYW_ISP_Signatures.CS_Change_Mind, dba.ANYW_ISP_Signatures.CS_Change_Mind_SSA_People_ID, dba.ANYW_ISP_Signatures.CS_Contact, ");
                this.sb.Append("dba.ANYW_ISP_Signatures.CS_Contact_Provider_Vendor_ID, dba.ANYW_ISP_Signatures.CS_Contact_Input, dba.ANYW_ISP_Signatures.CS_Rights_Reviewed, ");
                this.sb.Append("dba.ANYW_ISP_Signatures.CS_Agree_To_Plan, dba.ANYW_ISP_Signatures.CS_FCOP_Explained, dba.ANYW_ISP_Signatures.CS_Due_Process, ");
                this.sb.Append("dba.ANYW_ISP_Signatures.CS_Residential_Options, dba.ANYW_ISP_Signatures.CS_Supports_Health_Needs, dba.ANYW_ISP_Signatures.Name AS SupportName, ");
                this.sb.Append("SSA.Last_Name, SSA.First_Name, SSA.Middle_Name, dba.ANYW_ISP_Signatures.Signature_Order, dba.ANYW_ISP_Signatures.CS_Technology AS TechSolutionsExplored, ");
                this.sb.Append("DBA.People.First_Name + ' ' + DBA.People.Last_Name AS Name2 ");
                this.sb.Append("FROM  dba.ANYW_ISP_Signatures ");
                this.sb.Append("LEFT OUTER JOIN dba.People ON dba.ANYW_ISP_Signatures.ID = dba.People.ID ");
                this.sb.Append("LEFT OUTER JOIN dba.People SSA ON dba.ANYW_ISP_Signatures.CS_Change_Mind_SSA_People_ID = SSA.ID ");
                this.sb.Append("LEFT OUTER JOIN dba.Vendors ON dba.ANYW_ISP_Signatures.CS_Contact_Provider_Vendor_ID = dba.Vendors.Vendor_ID ");
                this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
                this.sb.Append("AND (DBA.ANYW_ISP_Signatures.Team_Member = 'Parent/Guardian' ");
                this.sb.Append("OR DBA.ANYW_ISP_Signatures.Team_Member = 'Guardian' ");
                this.sb.Append("OR DBA.ANYW_ISP_Signatures.Team_Member = 'Person Supported') ");
            }
            else if (!Advisor)
            {
                this.sb.Clear();
                this.sb.Append("SELECT  dba.ANYW_ISP_Signatures.ISP_Consumer_Signature_ID, dba.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID, dba.ANYW_ISP_Signatures.CS_Change_Mind, ");
                this.sb.Append("dba.ANYW_ISP_Signatures.CS_Change_Mind_SSA_People_ID, dba.ANYW_ISP_Signatures.CS_Contact, dba.ANYW_ISP_Signatures.CS_Contact_Provider_Vendor_ID, ");
                this.sb.Append("dba.ANYW_ISP_Signatures.CS_Contact_Input, dba.ANYW_ISP_Signatures.CS_Rights_Reviewed, dba.ANYW_ISP_Signatures.CS_Agree_To_Plan, ");
                this.sb.Append("dba.ANYW_ISP_Signatures.CS_FCOP_Explained, dba.ANYW_ISP_Signatures.CS_Due_Process, dba.ANYW_ISP_Signatures.CS_Residential_Options, ");
                this.sb.Append("dba.ANYW_ISP_Signatures.CS_Supports_Health_Needs, dba.ANYW_ISP_Signatures.Name AS SupportName, SSA.Last_Name, SSA.First_Name, SSA.Middle_Name, ");
                this.sb.Append("dba.ANYW_ISP_Signatures.Signature_Order, dba.ANYW_ISP_Signatures.CS_Technology AS TechSolutionsExplored, ");
                this.sb.Append("dba.People.First_Name + ' ' + dba.People.Last_Name AS Name2, dba.Organization.Name ");
                this.sb.Append("FROM dba.Organization ");
                this.sb.Append("RIGHT OUTER JOIN dba.People SSA ON dba.Organization.Organization_ID = SSA.Organization_ID ");
                this.sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Signatures ON dba.ANYW_ISP_Signatures.CS_Change_Mind_SSA_People_ID = SSA.ID ");
                this.sb.Append("RIGHT OUTER JOIN dba.People ON dba.ANYW_ISP_Signatures.ID = dba.People.ID ");
                this.sb.AppendFormat("WHERE dba.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
                this.sb.Append("AND (DBA.ANYW_ISP_Signatures.Team_Member = 'Parent/Guardian' ");
                this.sb.Append("OR DBA.ANYW_ISP_Signatures.Team_Member = 'Guardian' ");
                this.sb.Append("OR DBA.ANYW_ISP_Signatures.Team_Member = 'Person Supported') ");
            }
            return this.di.SelectRowsDS(this.sb.ToString()).Tables[0].DataSet;
        }

        public DataSet ISPSignatures(long AssesmentID)
        {
            this.sb.Clear();
            this.sb.Append("SELECT ISP_Consumer_Signature_ID, ISP_Consumer_Plan_ID, Team_Member, Name, Relationship, Participated, ");
            this.sb.Append("Signature, Date_Signed, Dissent_Area_Disagree, Dissent_How_To_Address, Dissent_Date, dba.ANYW_ISP_Signatures.User_ID, ");
            this.sb.Append("dba.ANYW_ISP_Signatures.Last_Update, Signature_Order, ");
            this.sb.Append("DBA.People.First_Name + ' ' + DBA.People.Last_Name AS Name2 ");
            this.sb.Append("FROM dba.ANYW_ISP_Signatures ");
            this.sb.Append("LEFT OUTER JOIN dba.People ON dba.ANYW_ISP_Signatures.ID = dba.People.ID ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
            DataTable table = this.di.SelectRowsDS(this.sb.ToString()).Tables[0];
            foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
            {
                if (row["Signature"].ToString() != string.Empty)
                {
                    MemoryStream memoryStream1 = new MemoryStream();
                    byte[] buffer = (byte[])row["Signature"];
                    memoryStream1.Write(buffer, 0, buffer.Length);
                    memoryStream1.Position = 0L;
                    Image image = Image.FromStream((Stream)memoryStream1);
                    Bitmap bitmap = new Bitmap(image.Size.Width, image.Size.Height, PixelFormat.Format24bppRgb);
                    Graphics graphics = Graphics.FromImage((Image)bitmap);
                    graphics.Clear(Color.White);
                    graphics.CompositingMode = CompositingMode.SourceOver;
                    graphics.DrawImage(image, 0, 0);
                    MemoryStream memoryStream2 = new MemoryStream();
                    bitmap.Save((Stream)memoryStream2, ImageFormat.Bmp);
                    memoryStream2.Position = 0L;
                    byte[] array = memoryStream2.ToArray();
                    row["Signature"] = (object)array;
                    memoryStream1.Close();
                    memoryStream1.Dispose();
                    memoryStream2.Close();
                    memoryStream2.Dispose();
                }
            }
            return table.DataSet;
        }

        public DataSet ISPContacts(long AssesmentID, bool Advisor = false)
        {
            this.sb.Clear();
            if (!Advisor)
            {
                this.sb.Append("SELECT DBA.anyw_isp_consumer_plans.consumer_id AS ISP_Consumer_Contact_Id, DBA.anyw_isp_consumer_plans.isp_consumer_plan_id, ");
                this.sb.Append("DBA.People.First_Name, DBA.People.Last_Name, DBA.People.Resident_Address AS Address1, DBA.People.Resident_City AS City, ");
                this.sb.Append("DBA.People.Resident_State as State, DBA.People.Resident_Zip AS Zip_Code, DBA.People.County, DBA.People.Resident_Address_2 AS Address2, ");
                this.sb.Append("DBA.People.Primary_Phone AS Phone, DBA.People.Date_of_Birth, DBA.People.Gender, DBA.People.Marital_Status, DBA.Consumer_Info.Resident_Number, ");
                this.sb.Append("DBA.Consumer_Info.Medicaid_Number, DBA.Consumer_Info.Medicare_Number, DBA.People.SSN, DBA.ANYW_ISP_Consumer_Contact.Other_Health_Insurance_Info, ");
                this.sb.Append("DBA.ANYW_ISP_Consumer_Contact.Other_Health_Insurance_Phone, DBA.ANYW_ISP_Consumer_Contact.Other_Health_Insurance_Policy, ");
                this.sb.Append("DBA.ANYW_ISP_Consumer_Contact.User_ID, DBA.anyw_isp_consumer_plans.plan_year_start, DBA.anyw_isp_consumer_plans.plan_year_end, '' AS FundingSource, ");
                this.sb.Append("DBA.anyw_isp_consumer_plans.Best_Way_To_Connect, DBA.anyw_isp_consumer_plans.More_Detail, DBA.People.e_mail, People.Nick_Name ");
                this.sb.Append("FROM DBA.ANYW_ISP_Consumer_Contact ");
                this.sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_plans ON DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID = DBA.anyw_isp_consumer_plans.isp_consumer_plan_id ");
                this.sb.Append(" LEFT OUTER JOIN DBA.People ON DBA.anyw_isp_consumer_plans.consumer_id = DBA.People.ID ");
                this.sb.Append("LEFT OUTER JOIN DBA.Consumer_Info ON DBA.People.ID = DBA.Consumer_Info.ID ");
                this.sb.AppendFormat("WHERE DBA.anyw_isp_consumer_plans.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
            }
            else if (Advisor)
            {
                this.sb.Append("SELECT  dba.ANYW_ISP_Consumer_Plans.consumer_id AS ISP_Consumer_Contact_Id, dba.ANYW_ISP_Consumer_Plans.isp_consumer_plan_id, ");
                this.sb.Append("dba.People.First_Name, dba.People.Last_Name, dba.People.Address1, dba.People.City, ");
                this.sb.Append("dba.People.State, dba.People.Zip_Code, dba.People.County, dba.People.Address2, ");
                this.sb.Append("dba.People.Primary_Phone AS Phone, dba.People.Date_of_Birth, dba.People.Gender, dba.Consumers.Marital_Status, dba.Consumers.Resident_Number, ");
                this.sb.Append("dba.Consumers.Medicaid_Number, dba.Consumers.Medicare_Number, dba.Consumers.SSN, '' AS Other_Health_Insurance_Info, ");
                this.sb.Append("'' AS Other_Health_Insurance_Phone, '' AS Other_Health_Insurance_Policy, ");
                this.sb.Append("dba.ANYW_ISP_Consumer_Contact.User_ID, dba.ANYW_ISP_Consumer_Plans.plan_year_start, dba.ANYW_ISP_Consumer_Plans.plan_year_end, '' AS FundingSource, ");
                this.sb.Append("dba.ANYW_ISP_Consumer_Plans.Best_Way_To_Connect, dba.ANYW_ISP_Consumer_Plans.More_Detail, dba.People.e_mail, dba.People.Nick_Name ");
                this.sb.Append("FROM dba.People ");
                this.sb.Append("LEFT OUTER JOIN dba.Consumers ON dba.People.Consumer_ID = dba.Consumers.Consumer_ID ");
                this.sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Consumer_Plans ON dba.People.ID = dba.ANYW_ISP_Consumer_Plans.consumer_id ");
                this.sb.Append("LEFT OUTER JOIN dba.ANYW_ISP_Consumer_Contact ON dba.ANYW_ISP_Consumer_Plans.isp_consumer_plan_id = dba.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID ");
                this.sb.AppendFormat("WHERE DBA.anyw_isp_consumer_plans.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
            }
            DataTable table1 = this.di.SelectRowsDS(this.sb.ToString()).Tables[0];
            if (Advisor)
            {
                this.sb.Clear();
                this.sb.Append("SELECT  dba.Code_Table.Caption, dba.ANYW_ISP_Consumer_Plans.isp_consumer_plan_id ");
                this.sb.Append("FROM dba.ANYW_ISP_Consumer_Plans ");
                this.sb.Append("LEFT OUTER JOIN dba.People ON dba.ANYW_ISP_Consumer_Plans.consumer_id = dba.People.ID ");
                this.sb.Append("LEFT OUTER JOIN dba.Consumers ON dba.People.Consumer_ID = dba.Consumers.Consumer_ID ");
                this.sb.Append("LEFT OUTER JOIN dba.Locations ON dba.Consumers.Location_ID = dba.Locations.Location_ID ");
                this.sb.Append("LEFT OUTER JOIN dba.Code_Table ON dba.Locations.Service_Location_Default = dba.Code_Table.Code ");
                this.sb.Append("WHERE  dba.Code_Table.Table_ID = 'Locations' ");
                this.sb.Append("AND dba.Code_Table.Field_ID = 'Service_Location' ");
                this.sb.AppendFormat("AND dba.ANYW_ISP_Consumer_Plans.isp_consumer_plan_id = {0} ", (object)AssesmentID);
                DataTable table2 = this.di.SelectRowsDS(this.sb.ToString()).Tables[0];
                string empty = string.Empty;
                if (table2.Rows.Count > 0)
                {
                    string str = table2.Rows[0]["Caption"].ToString();
                    table1.Rows[0]["County"] = (object)str;
                }
            }
            this.sb.Clear();
            this.sb.Append("SELECT DISTINCT Funding_Source, Funding_Source_Text ");
            this.sb.Append("FROM DBA.ANYW_ISP_Services_Paid_Support ");
            this.sb.AppendFormat("WHERE ISP_Assessment_Id = {0} ", (object)AssesmentID);
            DataSet dataSet = this.di.SelectRowsDS(this.sb.ToString());
            string str1 = string.Empty;
            if (dataSet.Tables.Count > 0)
            {
                DataTable table3 = this.di.SelectRowsDS(this.sb.ToString()).Tables[0];
                string str2 = string.Empty;
                foreach (DataRow row in (InternalDataCollectionBase)table3.Rows)
                {
                    switch (row["Funding_Source"].ToString())
                    {
                        case "1":
                            str2 = "HCBS Individual Options Waiver";
                            break;
                        case "2":
                            str2 = "HCBS Level One Waiver";
                            break;
                        case "3":
                            str2 = "HCBS SELF Waiver";
                            break;
                        case "4":
                            str2 = "ICF";
                            break;
                        case "5":
                            str2 = "State Plan Services";
                            break;
                        case "6":
                            str2 = "Local Funds";
                            break;
                        case "7":
                            str2 = "Local Funds--Contracted with Ohio Department of Aging";
                            break;
                        case "8":
                            str2 = row["Funding_Source_Text"].ToString();
                            break;
                    }
                    str1 += string.Format("{0}, ", (object)str2);
                }
            }
            if (str1.Length > 0)
                str1 = str1.Substring(0, str1.ToString().LastIndexOf(","));
            if (table1.Rows.Count > 0)
                table1.Rows[0]["FundingSource"] = (object)str1;
            this.sb.Clear();
            this.sb.Append("SELECT   Setting_Value ");
            this.sb.Append("FROM DBA.System_Settings ");
            this.sb.Append("WHERE   (DBA.System_Settings.Setting_Section = 'General') AND (DBA.System_Settings.Setting_Key = 'MaskSSN')");
            return table1.DataSet;
        }

        public DataSet ISPImportantPeople(long AssesmentID)
        {
            this.sb.Clear();
            this.sb.Append("SELECT   DBA.ANYW_ISP_Consumer_Contact_Important_People.ISP_Consumer_Important_People_ID, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_People.ISP_Consumer_Contact_Id, DBA.ANYW_ISP_Consumer_Contact_Important_People.Type, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_People.Name, DBA.ANYW_ISP_Consumer_Contact_Important_People.Relationship, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_People.Address, DBA.ANYW_ISP_Consumer_Contact_Important_People.Phone, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_People.Row_Order, DBA.ANYW_ISP_Consumer_Contact_Important_People.Email ");
            this.sb.Append("FROM     DBA.ANYW_ISP_Consumer_Contact_Important_People ");
            this.sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Consumer_Contact ON DBA.ANYW_ISP_Consumer_Contact_Important_People.ISP_Consumer_Contact_Id = DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Contact_Id ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
            return this.di.SelectRowsDS(this.sb.ToString()).Tables[0].DataSet;
        }

        public DataSet ISPClubs(long AssesmentID)
        {
            this.sb.Clear();
            this.sb.Append("SELECT   DBA.ANYW_ISP_Consumer_Contact_Important_Groups.ISP_Consumer_Important_Groups_ID, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Groups.ISP_Consumer_Contact_Id, DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Status, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Name, DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Address, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Phone, DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Meeting_Info, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Who_Helps, DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Row_Order ");
            this.sb.Append("FROM DBA.ANYW_ISP_Consumer_Contact ");
            this.sb.Append("RIGHT OUTER JOIN DBA.ANYW_ISP_Consumer_Contact_Important_Groups ON DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Contact_Id = DBA.ANYW_ISP_Consumer_Contact_Important_Groups.ISP_Consumer_Contact_Id ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
            return this.di.SelectRowsDS(this.sb.ToString()).Tables[0].DataSet;
        }

        public DataSet ISPPlaces(long AssesmentID)
        {
            this.sb.Clear();
            this.sb.Append("SELECT   DBA.ANYW_ISP_Consumer_Contact_Important_Places.ISP_Consumer_Important_Places_ID, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Places.ISP_Consumer_Contact_Id, DBA.ANYW_ISP_Consumer_Contact_Important_Places.Type, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Places.Name, DBA.ANYW_ISP_Consumer_Contact_Important_Places.Address, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Places.Phone, DBA.ANYW_ISP_Consumer_Contact_Important_Places.Schedule, ");
            this.sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Places.Acuity, DBA.ANYW_ISP_Consumer_Contact_Important_Places.Row_Order ");
            this.sb.Append("FROM DBA.ANYW_ISP_Consumer_Contact ");
            this.sb.Append("RIGHT OUTER JOIN DBA.ANYW_ISP_Consumer_Contact_Important_Places ON DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Contact_Id = DBA.ANYW_ISP_Consumer_Contact_Important_Places.ISP_Consumer_Contact_Id ");
            this.sb.AppendFormat("WHERE DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID = {0} ", (object)AssesmentID);
            return this.di.SelectRowsDS(this.sb.ToString()).Tables[0].DataSet;
        }

        public DataSet ISPIntroduction(long AssesmentID)
        {
            MemoryStream memoryStream1 = new MemoryStream();
            byte[] buffer = (byte[])null;
            this.sb.Clear();
            this.sb.Append("SELECT   DBA.People.Last_Name, DBA.People.First_Name, DBA.People.Middle_Name, DBA.People.ID, ");
            this.sb.Append("DBA.anyw_isp_consumer_plans.Use_Consumer_Plan_Image, DBA.anyw_isp_consumer_plans.Like_Admire, ");
            this.sb.Append("DBA.anyw_isp_consumer_plans.Things_Important_To, DBA.anyw_isp_consumer_plans.Things_important_For, ");
            this.sb.Append("DBA.anyw_isp_consumer_plans.How_To_Support, DBA.ANYW_ISP_Consumer_Plan_Images.Image AS PlanPicture, ");
            this.sb.Append("DBA.People.Nick_Name ");
            this.sb.Append("FROM DBA.anyw_isp_consumer_plans ");
            this.sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Consumer_Plan_Images ON DBA.anyw_isp_consumer_plans.isp_consumer_plan_id = DBA.ANYW_ISP_Consumer_Plan_Images.ISP_Consumer_Plan_ID ");
            this.sb.Append("LEFT OUTER JOIN DBA.People ON DBA.anyw_isp_consumer_plans.consumer_id = DBA.People.ID ");
            this.sb.AppendFormat("WHERE DBA.anyw_isp_consumer_plans.isp_consumer_plan_id = {0} ", (object)AssesmentID);
            DataTable table = this.di.SelectRowsDS(this.sb.ToString()).Tables[0];
            if (table.Rows.Count > 0)
            {
                DataRow row = table.Rows[0];
                if (row["Use_Consumer_Plan_Image"].ToString() == "1")
                {
                    buffer = (byte[])row["PlanPicture"];
                    if (buffer.Length == 0)
                        buffer = (byte[])null;
                }
                else
                {
                    string empty = string.Empty;
                    this.sb.Clear();
                    this.sb.Append("SELECT   setting ");
                    this.sb.Append("FROM sysoption ");
                    this.sb.AppendFormat("WHERE {0}  = 'Anywhere_Portrait_Path' ", (object)"\"option\"");
                    if (this.di.SelectRowsDS(this.sb.ToString()).Tables[0].Rows.Count > 0)
                    {
                        empty = this.di.SelectRowsDS(this.sb.ToString()).Tables[0].Rows[0]["setting"].ToString();
                        row["PlanPicture"] = (object)0;
                    }
                    try
                    {
                        string str = string.Format("{0}\\{1}.", (object)empty, row["id"]);
                        if (File.Exists(string.Format("{0}jpg", (object)str)))
                            buffer = File.ReadAllBytes(string.Format("{0}jpg", (object)str));
                        if (File.Exists(string.Format("{0}png", (object)str)))
                            buffer = File.ReadAllBytes(string.Format("{0}png", (object)str));
                    }
                    catch
                    {
                    }
                }
                if (buffer != null)
                {
                    memoryStream1.Write(buffer, 0, buffer.Length);
                    memoryStream1.Position = 0L;
                    Image image = Image.FromStream((Stream)memoryStream1);
                    Bitmap bitmap = new Bitmap(image.Size.Width, image.Size.Height, PixelFormat.Format24bppRgb);
                    Graphics graphics = Graphics.FromImage((Image)bitmap);
                    graphics.Clear(Color.White);
                    graphics.CompositingMode = CompositingMode.SourceOver;
                    graphics.DrawImage(image, 0, 0);
                    MemoryStream memoryStream2 = new MemoryStream();
                    bitmap.Save((Stream)memoryStream2, ImageFormat.Bmp);
                    memoryStream2.Position = 0L;
                    byte[] array = memoryStream2.ToArray();
                    row["PlanPicture"] = (object)array;
                    memoryStream1.Close();
                    memoryStream1.Dispose();
                    memoryStream2.Close();
                    memoryStream2.Dispose();
                }
            }
            return table.DataSet;
        }
    }
}
