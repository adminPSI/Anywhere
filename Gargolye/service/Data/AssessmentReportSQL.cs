using Anywhere.Log;
using System;
using System.Data;
using System.IO;
using System.Text;

namespace Anywhere.service.Data
{
    public class AssessmentReportSQL
    {
        private static Loger logger = new Loger();
        StringBuilder sb = new StringBuilder();
        Data.Sybase di = new Data.Sybase();

        public DataSet AssesmentHeader(long AssesmentID)
        {
            sb.Clear();
            sb.Append("SELECT   DBA.anyw_isp_consumer_plans.plan_type, DBA.anyw_isp_consumer_plans.plan_year_start, ");
            sb.Append("DBA.anyw_isp_consumer_plans.plan_year_end, DBA.anyw_isp_consumer_plans.active, ");
            sb.Append("DBA.anyw_isp_consumer_plans.revision_number, DBA.anyw_isp_consumer_plans.plan_status, ");
            sb.Append("DBA.People.Last_Name, DBA.People.First_Name, DBA.anyw_isp_consumer_plans.effective_start, ");
            sb.Append("DBA.People.Middle_Name, DBA.People.generation ");
            sb.Append("FROM     DBA.anyw_isp_consumer_plans ");
            sb.Append("LEFT OUTER JOIN DBA.People ON DBA.anyw_isp_consumer_plans.consumer_id = DBA.People.ID ");
            sb.AppendFormat("WHERE DBA.anyw_isp_consumer_plans.isp_consumer_plan_id = {0} ", AssesmentID);
            //MessageBox.Show("AssesmentHeader");
            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet AssesmentAnswers(long AssesmentID, bool Assessment)
        {
            sb.Clear();
            sb.Append("SELECT  DBA.anyw_isp_consumer_assessment_answers.answer, DBA.anyw_isp_assessment_sections.section_title, ");
            sb.Append("DBA.anyw_isp_assessment_sections.section_order, DBA.anyw_isp_assessment_subsections.subsection_title, ");
            sb.Append("DBA.anyw_isp_assessment_subsections.subsection_order, DBA.anyw_isp_assessment_questions.isp_assessment_question_id, ");
            sb.Append("DBA.anyw_isp_assessment_questions.question_text, DBA.anyw_isp_assessment_questions.question_order, ");
            sb.Append("DBA.anyw_isp_assessment_questions.answer_style, DBA.anyw_isp_assessment_question_sets.answer_rowcount,  ");
            sb.Append("DBA.anyw_isp_assessment_question_sets.question_set_order, DBA.anyw_isp_assessment_question_sets.allow_additional_answer_rows, ");
            sb.Append("DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id, answer_row, 0 AS ColumnNumber, ");
            sb.Append(" DBA.anyw_isp_assessment_question_sets.question_set_type, DBA.anyw_isp_assessment_question_sets.question_set_title, '' AS PlanStatus, ");
            sb.Append("0 AS ColumnCount, DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id, dba.anyw_isp_assessment_questions.question_prompt, 0 AS ISP, ");
            sb.Append("dba.ANYW_ISP_Assessment_Questions.hide_on_assessment, DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id, -1 AS SubSectionCount,  "); //?????
            sb.Append("SectionAllowable.Applicable AS SectionAllowable,  0 AS HideSubSectionTitle "); // SQL for SecionAllowable
            sb.Append("FROM DBA.anyw_isp_assessment_question_sets ");
            sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_subsections ON DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id = DBA.anyw_isp_assessment_subsections.isp_assessment_subsection_id ");
            sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_sections ON DBA.anyw_isp_assessment_question_sets.isp_assessment_section_id = DBA.anyw_isp_assessment_sections.isp_assessment_section_id ");
            sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_assessment_questions ON DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id ");
            sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_assessment_answers ON DBA.anyw_isp_assessment_questions.isp_assessment_question_id = DBA.anyw_isp_consumer_assessment_answers.isp_assessment_question_id ");
            sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Plan_Section_Applicable SectionAllowable ON DBA.anyw_isp_assessment_sections.isp_assessment_section_id = SectionAllowable.ISP_Assessment_Section_ID ");
            sb.AppendFormat("WHERE DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id = {0} ", AssesmentID);
            sb.AppendFormat("AND SectionAllowable.ISP_Assessment_ID = {0} ", AssesmentID); // SQL for SecionAllowable 08/17/2021
            sb.Append("AND SectionAllowable.Applicable = 'y' ");  // SQL for SecionAllowable 
            if (Assessment == true)
            {
                sb.Append("AND dba.ANYW_ISP_Assessment_Questions.hide_on_assessment IS NULL "); // Added 02/01/21
            }
            sb.Append("ORDER BY DBA.anyw_isp_assessment_sections.section_order, ");
            sb.Append("DBA.anyw_isp_assessment_subsections.subsection_order, ");
            sb.Append("DBA.anyw_isp_assessment_questions.question_order ");
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];

            //MessageBox.Show(string.Format("AssesmentAnswers dt row count {0}",dt.Rows.Count));

            foreach (DataRow row in dt.Rows)
            {
                if (row["question_set_type"].ToString().ToUpper() == "GRID")
                {
                    row["ColumnNumber"] = row["question_order"];
                    row["question_order"] = 1;
                }

                DateTime parseResult;
                if (DateTime.TryParse(row["answer"].ToString(), out parseResult))
                    row["answer"] = parseResult.ToString("MM/dd/yyyy");
                if (row["question_set_type"].ToString().ToUpper() == "GRID")
                {
                    sb.Clear();
                    sb.Append("SELECT   MAX(DBA.anyw_isp_assessment_questions.question_order) AS ColumnCount ");
                    sb.Append("FROM DBA.anyw_isp_assessment_question_sets ");
                    sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_assessment_questions ON DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id ");
                    sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_assessment_answers ON DBA.anyw_isp_consumer_assessment_answers.isp_assessment_question_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_id ");
                    sb.AppendFormat("WHERE   DBA.anyw_isp_assessment_question_sets.question_set_type = 'GRID' ");
                    sb.AppendFormat("AND DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id = {0} ", row["isp_assessment_question_set_id"]);

                    if (Assessment == true)
                        sb.Append("AND dba.ANYW_ISP_Assessment_Questions.hide_on_assessment IS NULL "); // Added 02/01/21 ??????
                    row["Columncount"] = di.SelectRowsDS(sb.ToString()).Tables[0].Rows[0]["Columncount"];

                    if (int.Parse(row["Columncount"].ToString()) > 3)
                        row["Columncount"] = 3;
                }

                if (row["question_text"].ToString() == "Who Said it?")
                {
                    if (row["answer"].ToString() != string.Empty)
                    {
                        sb.Clear();
                        sb.Append("SELECT  DBA.People.Last_Name, DBA.People.First_Name ");
                        sb.Append("FROM  DBA.People ");
                        sb.AppendFormat("WHERE DBA.People.id = {0} ", row["answer"]);
                        DataRow row2 = di.SelectRowsDS(sb.ToString()).Tables[0].Rows[0];
                        string Name = string.Format("{0}, {1}", row2["Last_Name"], row2["First_Name"]);
                        row["answer"] = Name;
                    }
                }

                sb.Clear();
                sb.Append("SELECT   COUNT(DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id) AS Counter ");
                sb.Append("FROM dba.ANYW_ISP_Assessment_Question_Sets ");
                sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Assessment_Questions ON dba.ANYW_ISP_Assessment_Question_Sets.isp_assessment_question_set_id = dba.ANYW_ISP_Assessment_Questions.isp_assessment_question_set_id ");
                sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Consumer_Assessment_Answers ON dba.ANYW_ISP_Assessment_Questions.isp_assessment_question_id = dba.ANYW_ISP_Consumer_Assessment_Answers.isp_assessment_question_id ");
                sb.AppendFormat("WHERE   DBA.anyw_isp_consumer_assessment_answers.answer > '0' ");
                sb.AppendFormat("AND DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id = {0} ", AssesmentID);
                sb.AppendFormat("AND DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id = {0} ", row["isp_assessment_subsection_id"]);

                row["SubSectionCount"] = di.QueryScalar(sb.ToString());

                if (row["section_order"].ToString() == "5")
                    if (row["subsection_order"].ToString() == "4")
                        if (Convert.ToInt16(row["question_set_order"]) > 2)
                        {
                            row["question_set_order"] = Convert.ToInt16(row["question_set_order"]) + 1;
                        }

                row["HideSubSectionTitle"] = HideSubSectionTitle(AssesmentID, row["subsection_title"].ToString(), Convert.ToInt64(row["section_order"]));


            }
            DataRow rowNew = dt.NewRow();
            rowNew["section_order"] = "5";
            rowNew["subsection_order"] = "4";
            rowNew["question_set_order"] = "3";
            sb.Clear();
            sb.Append("SELECT   Path_To_Employment ");
            sb.Append("FROM     DBA.anyw_isp_consumer_plans ");
            sb.AppendFormat("WHERE   isp_consumer_plan_id = {0} ", AssesmentID);
            rowNew["answer"] = di.QueryScalar(sb.ToString());
            dt.Rows.Add(rowNew);
            dt.AcceptChanges();


            return dt.DataSet;
        }

        public DataSet ISPSummary(long AssesmentID, bool Assessment, string WhichISPArea, Boolean Advisor = false)
        {
            String Vendor = "Vendor";
            if (Advisor == true)
            {
                Vendor = "Vendors";
            }

            sb.Clear();
            sb.Append("SELECT  DBA.anyw_isp_consumer_assessment_answers.answer, DBA.anyw_isp_assessment_sections.section_title, ");
            sb.Append("DBA.anyw_isp_assessment_sections.section_order, DBA.anyw_isp_assessment_subsections.subsection_title, ");
            sb.Append("DBA.anyw_isp_assessment_subsections.subsection_order, DBA.anyw_isp_assessment_questions.isp_assessment_question_id, ");
            sb.Append("DBA.anyw_isp_assessment_questions.question_text, DBA.anyw_isp_assessment_questions.question_order, ");
            sb.Append("DBA.anyw_isp_assessment_questions.answer_style, DBA.anyw_isp_assessment_question_sets.answer_rowcount,  ");
            sb.Append("DBA.anyw_isp_assessment_question_sets.question_set_order, DBA.anyw_isp_assessment_question_sets.allow_additional_answer_rows, ");
            sb.Append("DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id, DBA.anyw_isp_consumer_assessment_answers.answer_row, 0 AS ColumnNumber, ");
            sb.Append("DBA.anyw_isp_assessment_question_sets.question_set_type, DBA.anyw_isp_assessment_question_sets.question_set_title, '' AS PlanStatus, ");
            sb.Append("0 AS ColumnCount, DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id, DBA.anyw_isp_assessment_questions.question_prompt, 0 AS ISP, ");
            sb.Append("DBA.anyw_isp_consumer_plans.Alone_Time_Amount, DBA.anyw_isp_consumer_plans.Provider_Back_Up, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Plans.Best_Way_To_Connect, DBA.ANYW_ISP_Consumer_Plans.More_Detail, DBA.ANYW_ISP_Consumer_Plans.Path_To_Employment ");
            sb.Append("FROM DBA.anyw_isp_assessment_question_sets ");
            sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_subsections ON DBA.anyw_isp_assessment_question_sets.isp_assessment_subsection_id = DBA.anyw_isp_assessment_subsections.isp_assessment_subsection_id ");
            sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_sections ON DBA.anyw_isp_assessment_question_sets.isp_assessment_section_id = DBA.anyw_isp_assessment_sections.isp_assessment_section_id ");
            sb.Append("RIGHT OUTER JOIN  DBA.anyw_isp_assessment_questions ON DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id ");
            sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_assessment_answers ON DBA.anyw_isp_assessment_questions.isp_assessment_question_id = DBA.anyw_isp_consumer_assessment_answers.isp_assessment_question_id ");
            sb.Append("LEFT OUTER JOIN DBA.anyw_isp_consumer_plans ON DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id = dba.anyw_isp_consumer_plans.isp_consumer_plan_id ");
            sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Plan_Section_Applicable SectionAllowable ON DBA.anyw_isp_assessment_sections.ISP_Assessment_Section_ID = SectionAllowable.ISP_Assessment_Section_ID "); // SQL for SecionAllowable 
            sb.AppendFormat("WHERE DBA.anyw_isp_consumer_assessment_answers.isp_consumer_plan_id = {0} ", AssesmentID);
            sb.AppendFormat("AND SectionAllowable.ISP_Assessment_ID = {0} ", AssesmentID); // SQL for SecionAllowable  
            sb.Append("AND SectionAllowable.Applicable = 'y' ");  // SQL for SecionAllowable 'SQL for SecionAllowable 

            switch (WhichISPArea.ToUpper())
            {
                case "SUMMARY":
                    {
                        sb.Append("AND (DBA.anyw_isp_assessment_questions.question_tag Like '%_importantTo%' or DBA.anyw_isp_assessment_questions.question_tag Like '%_importantFor%')  ");
                        break;
                    }

                case "SKILLS":
                    {
                        sb.Append("AND (DBA.anyw_isp_assessment_questions.question_tag Like '%_skills%' or DBA.anyw_isp_assessment_questions.question_tag Like '%Place on path to COMMUNITY%' ");
                        sb.Append("or DBA.anyw_isp_assessment_questions.question_tag Like '%Best way to connect%' or DBA.anyw_isp_assessment_questions.question_tag = 'communication_skillsWayToConnect' ");
                        sb.Append("or DBA.anyw_isp_assessment_questions.question_tag = 'dailylife_skillsEmploymentPath') ");
                        break;
                    }

                case "SUPERVISION":
                    {
                        sb.Append("AND (DBA.anyw_isp_assessment_questions.question_tag Like '%_risks%') ");
                        break;
                    }
            }

            if (Assessment == true)
                sb.Append("AND dba.ANYW_ISP_Assessment_Questions.hide_on_assessment IS NULL "); // Added 02/01/21
            sb.Append("ORDER BY DBA.anyw_isp_assessment_sections.section_order, ");
            sb.Append("DBA.anyw_isp_assessment_subsections.subsection_order, ");
            sb.Append("DBA.anyw_isp_assessment_questions.question_order ");
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            foreach (DataRow row in dt.Rows)
            {
                if (row["question_set_type"].ToString().ToUpper() == "GRID")
                {
                    row["ColumnNumber"] = row["question_order"];
                }

                DateTime parseResult;
                if (DateTime.TryParse(row["answer"].ToString(), out parseResult))
                {
                    row["answer"] = parseResult.ToString("MM/dd/yyyy");
                }
                if (row["question_set_type"].ToString().ToUpper() == "GRID")
                {
                    sb.Clear();
                    sb.Append("SELECT   MAX(DBA.anyw_isp_assessment_questions.question_order) AS ColumnCount ");
                    sb.Append("FROM DBA.anyw_isp_assessment_question_sets ");
                    sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_assessment_questions ON DBA.anyw_isp_assessment_question_sets.isp_assessment_question_set_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id ");
                    sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_assessment_answers ON DBA.anyw_isp_consumer_assessment_answers.isp_assessment_question_id = DBA.anyw_isp_assessment_questions.isp_assessment_question_id ");
                    sb.AppendFormat("WHERE   DBA.anyw_isp_assessment_question_sets.question_set_type = 'GRID' ");
                    sb.AppendFormat("AND DBA.anyw_isp_assessment_questions.isp_assessment_question_set_id = {0} ", row["isp_assessment_question_set_id"]);
                    if (Assessment == true)
                        sb.Append("AND dba.ANYW_ISP_Assessment_Questions.hide_on_assessment IS NULL "); // Added 02/01/21 
                    row["Columncount"] = di.SelectRowsDS(sb.ToString()).Tables[0].Rows[0]["Columncount"];
                    if (int.Parse(row["Columncount"].ToString()) > 3)
                        row["Columncount"] = 3;
                }

                string name = string.Empty;
                if (row["question_text"].ToString().Equals("Who is responsible:"))
                {
                    if (row["answer"].ToString() != string.Empty)
                    {
                        if (row["answer"].ToString().ToUpper().Contains("V"))
                        {
                            sb.Clear();
                            sb.AppendFormat("SELECT  DBA.{0}.Name ", Vendor);
                            sb.AppendFormat("FROM  DBA.{0} ", Vendor);
                            sb.AppendFormat("WHERE DBA.{0}.Vendor_ID = {1} ", Vendor, row["answer"].ToString().ToUpper().Replace("V", ""));
                            DataRow row2 = di.SelectRowsDS(sb.ToString()).Tables[0].Rows[0];
                            name = string.Format("{0}", row2["Name"].ToString());
                        }

                        else
                        {
                            sb.Clear();
                            sb.Append("SELECT  DBA.People.Last_Name, DBA.People.First_Name ");
                            sb.Append("FROM  DBA.People ");
                            sb.AppendFormat("WHERE DBA.People.id = {0} ", row["answer"]);
                            DataRow row2 = di.SelectRowsDS(sb.ToString()).Tables[0].Rows[0];
                            name = string.Format("{0}, {1}", row2["Last_Name"], row2["First_Name"]);
                        }

                        row["answer"] = name;
                    }
                }
            }
            //MessageBox.Show("ISPSummary");
            return dt.DataSet;
        }

        public DataSet ISPOutcomes(long AssesmentID, Boolean Advisor = false)
        {
            string Vendor = "Vendor";
            if (Advisor == true)
            {
                Vendor = "Vendors";
            }

            sb.Clear();
            sb.Append("SELECT DBA.ANYW_ISP_Outcomes.ISP_Consumer_Plan_ID AS Expr1, DBA.ANYW_ISP_Outcomes.ISP_Consumer_Outcome_ID, DBA.ANYW_ISP_Outcomes.Outcome, ");
            sb.Append("DBA.ANYW_ISP_Outcomes.Details, DBA.ANYW_ISP_Outcomes.History, DBA.ANYW_ISP_Outcomes.ISP_Assessment_Section_ID, DBA.ANYW_ISP_Outcomes.Outcome_Order, ");
            sb.Append("DBA.ANYW_ISP_Outcomes_Experiences.ISP_Outcome_Experiences_ID, DBA.ANYW_ISP_Outcomes_Experiences.What_Happened, DBA.ANYW_ISP_Outcomes_Experiences.How_Happened, ");
            sb.Append("DBA.ANYW_ISP_Outcomes_Experiences.Outcome_Experience_Order, DBA.ANYW_ISP_Consumer_Outcome_Reviews.What_Will_Happen,  ");
            sb.Append("DBA.ANYW_ISP_Consumer_Outcome_Reviews.Outcome_Review_Order, DBA.ANYW_ISP_Consumer_Outcome_Reviews.ISP_Outcomes_Review_ID, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Outcome_Reviews.Who, DBA.ANYW_ISP_Consumer_Outcome_Reviews.When_To_Check_In, DBA.ANYW_ISP_Outcomes_Progress_Summary.Progress_Summary, ");
            sb.AppendFormat("People_1.Last_Name AS ContactLastName, People_1.First_Name AS ContactFirstName, DBA.{0}.Name AS ProviderName, ", Vendor);
            sb.Append("DBA.ANYW_ISP_Outcome_Experience_Responsibility.When_How_Often_Value AS HowOftenValue, DBA.ANYW_ISP_Outcome_Experience_Responsibility.Outcome_Experience_Responsibility_ID, ");
            sb.Append("DBA.ANYW_ISP_Outcome_Experience_Responsibility.When_How_Often_Frequency AS HowOftenFrequency, DBA.ANYW_ISP_Outcome_Experience_Responsibility.When_How_Often_Other AS HowOftenOther, ");
            sb.Append("DBA.People.First_Name + ' ' + DBA.People.Last_Name AS Who2 ");
            sb.Append("FROM DBA.ANYW_ISP_Outcomes ");
            sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Outcomes_Experiences ON DBA.ANYW_ISP_Outcomes.ISP_Consumer_Outcome_ID = DBA.ANYW_ISP_Outcomes_Experiences.ISP_Consumer_Outcome_ID ");
            sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Outcome_Experience_Responsibility ON DBA.ANYW_ISP_Outcomes_Experiences.ISP_Outcome_Experiences_ID = DBA.ANYW_ISP_Outcome_Experience_Responsibility.ISP_Outcome_Experiences_ID ");
            sb.Append("LEFT OUTER JOIN DBA.People People_1 ON DBA.ANYW_ISP_Outcome_Experience_Responsibility.Responsible_Contact = People_1.ID ");
            sb.AppendFormat("LEFT OUTER JOIN DBA.{0} ON DBA.ANYW_ISP_Outcome_Experience_Responsibility.Responsible_Provider = DBA.{0}.Vendor_ID ", Vendor);
            sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Outcomes_Progress_Summary ON DBA.ANYW_ISP_Outcomes.ISP_Consumer_Plan_ID = DBA.ANYW_ISP_Outcomes_Progress_Summary.ISP_Consumer_Plan_ID ");
            sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Consumer_Outcome_Reviews ON DBA.ANYW_ISP_Outcomes.ISP_Consumer_Outcome_ID = DBA.ANYW_ISP_Consumer_Outcome_Reviews.ISP_Consumer_Outcome_ID ");
            sb.Append("LEFT OUTER JOIN DBA.People ON DBA.ANYW_ISP_Consumer_Outcome_Reviews.ID = DBA.People.ID ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Outcomes.ISP_Consumer_Plan_ID = {0} ", AssesmentID);
            sb.Append("ORDER BY DBA.ANYW_ISP_Outcomes.Outcome_Order ASC, ");
            sb.Append("DBA.ANYW_ISP_Outcomes_Experiences.Outcome_Experience_Order ASC, DBA.ANYW_ISP_Consumer_Outcome_Reviews.Outcome_Review_Order ASC, ");
            sb.Append("DBA.ANYW_ISP_Outcome_Experience_Responsibility.Outcome_Experience_Responsibility_ID ASC");
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //MessageBox.Show("ISPOutcomes");
            return dt.DataSet;

        }

        public DataSet ISPServices(long AssesmentID, Boolean Advisor = false)

        {
            String Vendor = "Vendor";
            String FundingSource = "Funding_Source_Info";
            String Description = "Description";
            if (Advisor == true)
            {
                Vendor = "Vendors";
                FundingSource = "Funding_Sources";
                Description = "Funding_Source_Name";
            }

            sb.Clear();
            sb.Append("SELECT   DBA.ANYW_ISP_Services_Paid_Support.ISP_Paid_Support_ID, DBA.ANYW_ISP_Services_Paid_Support.ISP_Assessment_Id, ");
            sb.Append("DBA.ANYW_ISP_Services_Paid_Support.Provider_ID, DBA.ANYW_ISP_Services_Paid_Support.Assessment_Area_ID, ");
            sb.Append("DBA.ANYW_ISP_Services_Paid_Support.Service_Name_Id, DBA.ANYW_ISP_Services_Paid_Support.Scope_Of_Service, ");
            sb.Append("DBA.ANYW_ISP_Services_Paid_Support.How_Often_Value, DBA.ANYW_ISP_Services_Paid_Support.How_Often_Frequency, ");
            sb.Append("DBA.ANYW_ISP_Services_Paid_Support.How_Often_Text, DBA.ANYW_ISP_Services_Paid_Support.Begin_Date, ");
            sb.Append("DBA.ANYW_ISP_Services_Paid_Support.End_Date, DBA.ANYW_ISP_Services_Paid_Support.Funding_Source_Text, ");
            sb.AppendFormat("DBA.ANYW_ISP_Services_Paid_Support.Row_Order, DBA.Service_Types.Description, DBA.{0}.{1} AS FundingSource, ", FundingSource, Description);
            sb.AppendFormat("DBA.{0}.Name AS Provider, DBA.anyw_isp_assessment_sections.section_title AS Area, DBA.ANYW_ISP_Services_Paid_Support.Funding_Source, ", Vendor);
            sb.Append("DBA.ANYW_ISP_Services_Paid_Support.Additional_Service_Name ");
            sb.Append("FROM DBA.anyw_isp_assessment_sections ");
            sb.Append("RIGHT OUTER JOIN DBA.ANYW_ISP_Services_Paid_Support ON DBA.anyw_isp_assessment_sections.isp_assessment_section_id = DBA.ANYW_ISP_Services_Paid_Support.Assessment_Area_ID ");
            sb.AppendFormat("LEFT OUTER JOIN DBA.{0} ON DBA.ANYW_ISP_Services_Paid_Support.Provider_ID = DBA.{0}.Vendor_ID ", Vendor);
            sb.AppendFormat("LEFT OUTER JOIN DBA.{0} ON DBA.ANYW_ISP_Services_Paid_Support.Funding_Source = DBA.{0}.Funding_Source_ID ", FundingSource);
            sb.Append("LEFT OUTER JOIN DBA.Service_Types ON DBA.ANYW_ISP_Services_Paid_Support.Additional_Service_Name = DBA.Service_Types.Service_Type_ID ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Services_Paid_Support.ISP_Assessment_Id = {0} ", AssesmentID);
            sb.Append("ORDER BY Provider, DBA.ANYW_ISP_Services_Paid_Support.Row_Order ");
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];

            foreach (DataRow row in dt.Rows)
                if (row.Field<int>("Funding_Source") == 5)
                {
                    row["Provider"] = string.Empty;
                }

            //MessageBox.Show("ISPServices");
            return dt.DataSet;
        }

        public DataSet ISPModifiers(long AssesmentID)
        {
            sb.Clear();
            sb.Append("SELECT   ISP_Modification_ID, ISP_Assessment_Id, Medical_Rate, Behavior_Rate, ");
            sb.Append("ICF_Rate, Complex_Rate, Developmental_Rate, Child_Intensive_Rate ");
            sb.Append("FROM DBA.ANYW_ISP_Services_Modification ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Services_Modification.ISP_Assessment_Id = {0} ", AssesmentID); //08/17/2021
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //MessageBox.Show("ISPModifiers");
            return dt.DataSet;
        }

        public DataSet ISPAdditionalSupports(long AssesmentID)
        {
            sb.Clear();
            sb.Append(" SELECT   DBA.ANYW_ISP_Services_Additional_Support.ISP_Services_Additional_Support_ID, ");
            sb.Append("DBA.ANYW_ISP_Services_Additional_Support.ISP_Assessment_Id, DBA.ANYW_ISP_Services_Additional_Support.Assessment_Area_ID, ");
            sb.Append("DBA.ANYW_ISP_Services_Additional_Support.Who_Supports, DBA.ANYW_ISP_Services_Additional_Support.What_Support_Looks_Like, ");
            sb.Append("DBA.ANYW_ISP_Services_Additional_Support.How_Often_Value, DBA.ANYW_ISP_Services_Additional_Support.How_Often_Frequency, ");
            sb.Append("DBA.ANYW_ISP_Services_Additional_Support.How_Often_Text, DBA.ANYW_ISP_Services_Additional_Support.Row_Order, ");
            sb.Append("DBA.anyw_isp_assessment_sections.section_title, DBA.People.Last_Name, DBA.People.First_Name ");
            sb.Append("FROM DBA.ANYW_ISP_Services_Additional_Support ");
            sb.Append("LEFT OUTER JOIN DBA.People ON DBA.ANYW_ISP_Services_Additional_Support.Who_Supports = DBA.People.ID ");
            sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_sections ON DBA.ANYW_ISP_Services_Additional_Support.Assessment_Area_ID = DBA.anyw_isp_assessment_sections.isp_assessment_section_id ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Services_Additional_Support.ISP_Assessment_Id = {0} ", AssesmentID);
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //MessageBox.Show("ISPAdditionalSupports");
            return dt.DataSet;
        }

        public DataSet ISPReferrals(long AssesmentID)
        {
            sb.Clear();
            sb.Append("SELECT   DBA.ANYW_ISP_Services_Referral.ISP_Services_Referral_ID, DBA.ANYW_ISP_Services_Referral.ISP_Assessment_Id, DBA.ANYW_ISP_Services_Referral.Assessment_Area_ID, ");
            sb.Append("DBA.ANYW_ISP_Services_Referral.New_Or_Existing, DBA.ANYW_ISP_Services_Referral.Who_Supports, DBA.ANYW_ISP_Services_Referral.Reason_For_Referral, ");
            sb.Append("DBA.ANYW_ISP_Services_Referral.Row_Order, DBA.anyw_isp_assessment_sections.section_title, DBA.People.Last_Name, DBA.People.First_Name ");
            sb.Append("FROM DBA.ANYW_ISP_Services_Referral ");
            sb.Append("LEFT OUTER JOIN DBA.People ON DBA.ANYW_ISP_Services_Referral.Who_Supports = DBA.People.ID ");
            sb.Append("LEFT OUTER JOIN DBA.anyw_isp_assessment_sections ON DBA.ANYW_ISP_Services_Referral.Assessment_Area_ID = DBA.anyw_isp_assessment_sections.isp_assessment_section_id ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Services_Referral.ISP_Assessment_Id = {0} ", AssesmentID);
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //MessageBox.Show("ISPReferrals");
            return dt.DataSet;
        }

        public DataSet ISPTeamMembers(long AssesmentID, Boolean Advisor = false)
        {
            String Vendor = "Vendor";
            if (Advisor == true)
            {
                Vendor = "Vendors";
            }

            sb.Clear();
            sb.Append("SELECT   ISP_Consumer_Informed_Consent_ID, ISP_Consumer_Plan_ID, RM_Identified, RM_HRC_Date, RM_Keep_Self_Safe, ");
            sb.Append("RM_Fade_Restriction, RM_What_Could_Happen_Good, RM_What_Could_Happen_Bad, RM_Other_Way_Help_Good, RM_Other_Way_Help_Bad ");
            sb.AppendFormat("FROM DBA.{0} ", Vendor);
            sb.AppendFormat("RIGHT OUTER JOIN DBA.ANYW_ISP_Consumer_Informed_Consent ON DBA.{0}.Vendor_ID = DBA.ANYW_ISP_Consumer_Informed_Consent.CS_Contact_Provider_Vendor_ID ", Vendor);
            sb.Append("LEFT OUTER JOIN DBA.People ON DBA.ANYW_ISP_Consumer_Informed_Consent.CS_Change_Mind_SSA_People_ID = DBA.People.ID ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Consumer_Informed_Consent.ISP_Consumer_Plan_ID = {0} ", AssesmentID); //08/17/2021
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];

            return dt.DataSet;
        }

        public DataSet ISPTeamMembers2(long AssesmentID, Boolean Advisor = false)
        {
            if (Advisor == true)
            {
                sb.Clear();
                sb.AppendFormat("SELECT   dba.ANYW_ISP_Signatures.ISP_Consumer_Signature_ID, dba.Vendors.Name, dba.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID, ");
                sb.Append("dba.ANYW_ISP_Signatures.CS_Change_Mind, dba.ANYW_ISP_Signatures.CS_Change_Mind_SSA_People_ID, dba.ANYW_ISP_Signatures.CS_Contact, ");
                sb.Append("dba.ANYW_ISP_Signatures.CS_Contact_Provider_Vendor_ID, dba.ANYW_ISP_Signatures.CS_Contact_Input, dba.ANYW_ISP_Signatures.CS_Rights_Reviewed, ");
                sb.Append("dba.ANYW_ISP_Signatures.CS_Agree_To_Plan, dba.ANYW_ISP_Signatures.CS_FCOP_Explained, dba.ANYW_ISP_Signatures.CS_Due_Process, ");
                sb.Append("dba.ANYW_ISP_Signatures.CS_Residential_Options, dba.ANYW_ISP_Signatures.CS_Supports_Health_Needs, dba.ANYW_ISP_Signatures.Name AS SupportName, ");
                sb.Append("SSA.Last_Name, SSA.First_Name, SSA.Middle_Name, dba.ANYW_ISP_Signatures.Signature_Order, dba.ANYW_ISP_Signatures.CS_Technology AS TechSolutionsExplored, ");
                sb.Append("DBA.People.First_Name + ' ' + DBA.People.Last_Name AS Name2, dba.ANYW_ISP_Signatures.ISP_Signature_Type ");
                sb.Append("FROM  dba.ANYW_ISP_Signatures ");
                sb.Append("LEFT OUTER JOIN dba.People ON dba.ANYW_ISP_Signatures.ID = dba.People.ID ");
                sb.Append("LEFT OUTER JOIN dba.People SSA ON dba.ANYW_ISP_Signatures.CS_Change_Mind_SSA_People_ID = SSA.ID ");
                sb.Append("LEFT OUTER JOIN dba.Vendors ON dba.ANYW_ISP_Signatures.CS_Contact_Provider_Vendor_ID = dba.Vendors.Vendor_ID ");
                sb.AppendFormat("WHERE DBA.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID = {0} ", AssesmentID); //08/17/2021
                sb.Append("AND  dba.ANYW_ISP_Signatures.ISP_Signature_Type < 3 ");
                sb.Append("AND (DBA.ANYW_ISP_Signatures.Team_Member = 'Parent/Guardian' ");
                sb.Append("OR DBA.ANYW_ISP_Signatures.Team_Member = 'Guardian' ");
                sb.Append("OR DBA.ANYW_ISP_Signatures.Team_Member = 'Person Supported') ");
            }

            else if (Advisor == false)
            {
                sb.Clear();
                sb.Append("SELECT  dba.ANYW_ISP_Signatures.ISP_Consumer_Signature_ID, dba.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID, dba.ANYW_ISP_Signatures.CS_Change_Mind, ");
                sb.Append("dba.ANYW_ISP_Signatures.CS_Change_Mind_SSA_People_ID, dba.ANYW_ISP_Signatures.CS_Contact, dba.ANYW_ISP_Signatures.CS_Contact_Provider_Vendor_ID, ");
                sb.Append("dba.ANYW_ISP_Signatures.CS_Contact_Input, dba.ANYW_ISP_Signatures.CS_Rights_Reviewed, dba.ANYW_ISP_Signatures.CS_Agree_To_Plan, ");
                sb.Append("dba.ANYW_ISP_Signatures.CS_FCOP_Explained, dba.ANYW_ISP_Signatures.CS_Due_Process, dba.ANYW_ISP_Signatures.CS_Residential_Options, ");
                sb.Append("dba.ANYW_ISP_Signatures.CS_Supports_Health_Needs, dba.ANYW_ISP_Signatures.Name AS SupportName, SSA.Last_Name, SSA.First_Name, SSA.Middle_Name, ");
                sb.Append("dba.ANYW_ISP_Signatures.Signature_Order, dba.ANYW_ISP_Signatures.CS_Technology AS TechSolutionsExplored, ");
                sb.Append("dba.People.First_Name + ' ' + dba.People.Last_Name AS Name2, dba.Organization.Name, dba.ANYW_ISP_Signatures.ISP_Signature_Type ");
                sb.Append("FROM dba.Organization ");
                sb.Append("RIGHT OUTER JOIN dba.People SSA ON dba.Organization.Organization_ID = SSA.Organization_ID ");
                sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Signatures ON dba.ANYW_ISP_Signatures.CS_Change_Mind_SSA_People_ID = SSA.ID ");
                sb.Append("RIGHT OUTER JOIN dba.People ON dba.ANYW_ISP_Signatures.ID = dba.People.ID ");
                sb.AppendFormat("WHERE dba.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID = {0} ", AssesmentID);
                sb.Append("AND  dba.ANYW_ISP_Signatures.ISP_Signature_Type < 3 ");
                sb.Append("AND (DBA.ANYW_ISP_Signatures.Team_Member = 'Parent/Guardian' ");
                sb.Append("OR DBA.ANYW_ISP_Signatures.Team_Member = 'Guardian' ");
                sb.Append("OR DBA.ANYW_ISP_Signatures.Team_Member = 'Person Supported') ");
            }

            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //dt.WriteXmlSchema(@"C:\Work\OComReports\AssesmentXML\ISPTeamMembers2.xml");
            //MessageBox.Show("ISPTeamMembers2");
            return dt.DataSet;


        }

        public DataSet ISPSignatures(long AssesmentID)
        {
            sb.Clear();
            sb.Append("SELECT ISP_Consumer_Signature_ID, ISP_Consumer_Plan_ID, Team_Member, Name, Relationship, Participated, ");
            sb.Append("Signature, Date_Signed, Dissent_Area_Disagree, Dissent_How_To_Address, Dissent_Date, dba.ANYW_ISP_Signatures.User_ID, ");
            sb.Append("dba.ANYW_ISP_Signatures.Last_Update, Signature_Order, ");
            sb.Append("DBA.People.First_Name + ' ' + DBA.People.Last_Name AS Name2, dba.ANYW_ISP_Signatures.ISP_Signature_Type ");
            sb.Append("FROM dba.ANYW_ISP_Signatures ");
            sb.Append("LEFT OUTER JOIN dba.People ON dba.ANYW_ISP_Signatures.ID = dba.People.ID ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID = {0} ", AssesmentID); //08/17/2021
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //int x = 0;
            foreach (DataRow row in dt.Rows)
            {
                if (row["Signature"].ToString() != string.Empty)
                {
                    var ms = new MemoryStream();
                    byte[] ba = (byte[])row["Signature"];
                    ms.Write(ba, 0, ba.Length);
                    ms.Position = 0L;

                    System.Drawing.Image i = System.Drawing.Image.FromStream(ms);
                    var bm = new System.Drawing.Bitmap(i.Size.Width, i.Size.Height, System.Drawing.Imaging.PixelFormat.Format24bppRgb);
                    var g = System.Drawing.Graphics.FromImage(bm);
                    g.Clear(System.Drawing.Color.White);
                    g.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceOver;
                    g.DrawImage(i, 0, 0);
                    var ms2 = new MemoryStream();
                    bm.Save(ms2, System.Drawing.Imaging.ImageFormat.Bmp);
                    ms2.Position = 0L;
                    ba = null;
                    ba = ms2.ToArray();
                    row["Signature"] = ba;

                    //iImage = i;

                    ms.Close();
                    ms.Dispose();
                    ms2.Close();
                    ms2.Dispose();
                }
            }
            //MessageBox.Show("ISPSignatures");
            return dt.DataSet;
        }

        public DataSet Dissenting(long AssesmentID, Boolean OneSpan)
        {
            sb.Clear();
            sb.Append("SELECT ISP_Consumer_Signature_ID, ISP_Consumer_Plan_ID, Team_Member, Name, Relationship, Participated, ");
            sb.Append("Signature, Date_Signed, Dissent_Area_Disagree, Dissent_How_To_Address, Dissent_Date, dba.ANYW_ISP_Signatures.User_ID, ");
            sb.Append("dba.ANYW_ISP_Signatures.Last_Update, Signature_Order, ");
            sb.Append("DBA.People.First_Name + ' ' + DBA.People.Last_Name AS Name2, dba.ANYW_ISP_Signatures.ISP_Signature_Type ");
            sb.Append("FROM dba.ANYW_ISP_Signatures ");
            sb.Append("LEFT OUTER JOIN dba.People ON dba.ANYW_ISP_Signatures.ID = dba.People.ID ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Signatures.ISP_Consumer_Plan_ID = {0} ", AssesmentID); //08/17/2021

            {
                if (OneSpan == false)
                {
                    sb.Append("AND Dissent_Area_Disagree > '' ");
                }
            }
            {
                if (OneSpan == true)
                {
                    sb.Append("AND (Dissent_Area_Disagree = '' OR Dissent_Area_Disagree IS NULL) ");
                }
            }

            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //int x = 0;
            foreach (DataRow row in dt.Rows)
            {
                if (row["Signature"].ToString() != string.Empty)
                {
                    var ms = new MemoryStream();
                    byte[] ba = (byte[])row["Signature"];
                    ms.Write(ba, 0, ba.Length);
                    ms.Position = 0L;

                    System.Drawing.Image i = System.Drawing.Image.FromStream(ms);
                    var bm = new System.Drawing.Bitmap(i.Size.Width, i.Size.Height, System.Drawing.Imaging.PixelFormat.Format24bppRgb);
                    var g = System.Drawing.Graphics.FromImage(bm);
                    g.Clear(System.Drawing.Color.White);
                    g.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceOver;
                    g.DrawImage(i, 0, 0);
                    var ms2 = new MemoryStream();
                    bm.Save(ms2, System.Drawing.Imaging.ImageFormat.Bmp);
                    ms2.Position = 0L;
                    ba = null;
                    ba = ms2.ToArray();
                    row["Signature"] = ba;

                    //iImage = i;

                    ms.Close();
                    ms.Dispose();
                    ms2.Close();
                    ms2.Dispose();
                }
            }
            //MessageBox.Show("ISPSignatures");
            return dt.DataSet;
        }

        public DataSet ISPContacts(long AssesmentID, Boolean Advisor = false)
        {
            sb.Clear();

            if (Advisor == false)
            {
                sb.Append("SELECT DBA.anyw_isp_consumer_plans.consumer_id AS ISP_Consumer_Contact_Id, DBA.anyw_isp_consumer_plans.isp_consumer_plan_id, ");
                sb.Append("DBA.People.First_Name, DBA.People.Last_Name, DBA.People.Resident_Address AS Address1, DBA.People.Resident_City AS City, ");
                sb.Append("DBA.People.Resident_State as State, DBA.People.Resident_Zip AS Zip_Code, DBA.People.County, DBA.People.Resident_Address_2 AS Address2, ");
                sb.Append("DBA.People.Primary_Phone AS Phone, DBA.People.Date_of_Birth, DBA.People.Gender, DBA.People.Marital_Status, DBA.Consumer_Info.Resident_Number, ");
                sb.Append("DBA.Consumer_Info.Medicaid_Number, DBA.Consumer_Info.Medicare_Number, DBA.People.SSN, DBA.ANYW_ISP_Consumer_Contact.Other_Health_Insurance_Info, ");
                sb.Append("DBA.ANYW_ISP_Consumer_Contact.Other_Health_Insurance_Phone, DBA.ANYW_ISP_Consumer_Contact.Other_Health_Insurance_Policy, ");
                sb.Append("DBA.ANYW_ISP_Consumer_Contact.User_ID, DBA.anyw_isp_consumer_plans.plan_year_start, DBA.anyw_isp_consumer_plans.plan_year_end, '' AS FundingSource, ");
                sb.Append("DBA.anyw_isp_consumer_plans.Best_Way_To_Connect, DBA.anyw_isp_consumer_plans.More_Detail, DBA.People.e_mail, People.Nick_Name ");
                sb.Append("FROM DBA.ANYW_ISP_Consumer_Contact ");
                sb.Append("RIGHT OUTER JOIN DBA.anyw_isp_consumer_plans ON DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID = DBA.anyw_isp_consumer_plans.isp_consumer_plan_id ");
                sb.Append(" LEFT OUTER JOIN DBA.People ON DBA.anyw_isp_consumer_plans.consumer_id = DBA.People.ID ");
                sb.Append("LEFT OUTER JOIN DBA.Consumer_Info ON DBA.People.ID = DBA.Consumer_Info.ID ");
                sb.AppendFormat("WHERE DBA.anyw_isp_consumer_plans.ISP_Consumer_Plan_ID = {0} ", AssesmentID);
            }
            else if (Advisor == true)
            {
                sb.Append("SELECT  dba.ANYW_ISP_Consumer_Plans.consumer_id AS ISP_Consumer_Contact_Id, dba.ANYW_ISP_Consumer_Plans.isp_consumer_plan_id, ");
                sb.Append("dba.People.First_Name, dba.People.Last_Name, dba.People.Address1, dba.People.City, ");
                sb.Append("dba.People.State, dba.People.Zip_Code, dba.People.County, dba.People.Address2, ");
                sb.Append("dba.People.Primary_Phone AS Phone, dba.People.Date_of_Birth, dba.People.Gender, dba.Consumers.Marital_Status, dba.Consumers.Resident_Number, ");
                sb.Append("dba.Consumers.Medicaid_Number, dba.Consumers.Medicare_Number, dba.Consumers.SSN, '' AS Other_Health_Insurance_Info, ");
                sb.Append("'' AS Other_Health_Insurance_Phone, '' AS Other_Health_Insurance_Policy, ");
                sb.Append("dba.ANYW_ISP_Consumer_Contact.User_ID, dba.ANYW_ISP_Consumer_Plans.plan_year_start, dba.ANYW_ISP_Consumer_Plans.plan_year_end, '' AS FundingSource, ");
                sb.Append("dba.ANYW_ISP_Consumer_Plans.Best_Way_To_Connect, dba.ANYW_ISP_Consumer_Plans.More_Detail, dba.People.e_mail, dba.People.Nick_Name ");
                sb.Append("FROM dba.People ");
                sb.Append("LEFT OUTER JOIN dba.Consumers ON dba.People.Consumer_ID = dba.Consumers.Consumer_ID ");
                sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Consumer_Plans ON dba.People.ID = dba.ANYW_ISP_Consumer_Plans.consumer_id ");
                sb.Append("LEFT OUTER JOIN dba.ANYW_ISP_Consumer_Contact ON dba.ANYW_ISP_Consumer_Plans.isp_consumer_plan_id = dba.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID ");
                sb.AppendFormat("WHERE DBA.anyw_isp_consumer_plans.ISP_Consumer_Plan_ID = {0} ", AssesmentID);
            }
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];

            if (Advisor == true)
            {
                sb.Clear();
                sb.Append("SELECT  dba.Code_Table.Caption, dba.ANYW_ISP_Consumer_Plans.isp_consumer_plan_id ");
                sb.Append("FROM dba.ANYW_ISP_Consumer_Plans ");
                sb.Append("LEFT OUTER JOIN dba.People ON dba.ANYW_ISP_Consumer_Plans.consumer_id = dba.People.ID ");
                sb.Append("LEFT OUTER JOIN dba.Consumers ON dba.People.Consumer_ID = dba.Consumers.Consumer_ID ");
                sb.Append("LEFT OUTER JOIN dba.Locations ON dba.Consumers.Location_ID = dba.Locations.Location_ID ");
                sb.Append("LEFT OUTER JOIN dba.Code_Table ON dba.Locations.Service_Location_Default = dba.Code_Table.Code ");
                sb.Append("WHERE  dba.Code_Table.Table_ID = 'Locations' ");
                sb.Append("AND dba.Code_Table.Field_ID = 'Service_Location' ");
                sb.AppendFormat("AND dba.ANYW_ISP_Consumer_Plans.isp_consumer_plan_id = {0} ", AssesmentID);
                DataTable cdt = di.SelectRowsDS(sb.ToString()).Tables[0];

                string County = String.Empty;
                if (cdt.Rows.Count > 0)
                {
                    County = cdt.Rows[0]["Caption"].ToString();
                    dt.Rows[0]["County"] = County;

                }

            }

            sb.Clear();
            sb.Append("SELECT DISTINCT Funding_Source, Funding_Source_Text ");
            sb.Append("FROM DBA.ANYW_ISP_Services_Paid_Support ");
            sb.AppendFormat("WHERE ISP_Assessment_Id = {0} ", AssesmentID);
            DataSet ds = di.SelectRowsDS(sb.ToString());

            string FundingSource = string.Empty;
            if (ds.Tables.Count > 0)
            {
                DataTable dt2 = di.SelectRowsDS(sb.ToString()).Tables[0];
                string fs = string.Empty;
                foreach (System.Data.DataRow row in dt2.Rows)
                {
                    switch (row["Funding_Source"].ToString())
                    {
                        case "1":
                            {
                                fs = "HCBS Individual Options Waiver";
                                break;
                            }

                        case "2":
                            {
                                fs = "HCBS Level One Waiver";
                                break;
                            }

                        case "3":
                            {
                                fs = "HCBS SELF Waiver";
                                break;
                            }

                        case "4":
                            {
                                fs = "ICF";
                                break;
                            }

                        case "5":
                            {
                                fs = "State Plan Services";
                                break;
                            }

                        case "6":
                            {
                                fs = "Local Funds";
                                break;
                            }

                        case "7":
                            {
                                fs = "Local Funds--Contracted with Ohio Department of Aging";
                                break;
                            }

                        case "8":
                            {
                                fs = row["Funding_Source_Text"].ToString();
                                break;
                            }
                    }

                    FundingSource += string.Format("{0}, ", fs);
                }
            }

            if (FundingSource.Length > 0)
                FundingSource = FundingSource.Substring(0, FundingSource.ToString().LastIndexOf(","));
            if (dt.Rows.Count > 0)
            {
                dt.Rows[0]["FundingSource"] = FundingSource;
            }

            sb.Clear();
            sb.Append("SELECT   Setting_Value ");
            sb.Append("FROM DBA.System_Settings ");
            sb.Append("WHERE   (DBA.System_Settings.Setting_Section = 'General') AND (DBA.System_Settings.Setting_Key = 'MaskSSN')"); //08/17/2021
            //if (di.SelectRowsDS(sb.ToString()).Tables[0].Rows[0]["Setting_Value"].ToString().ToUpper() == "Y")
            //{
            //    dt.Rows[0]["SSN"] = "xxx-xx-xxxx";
            //}
            //dt.WriteXmlSchema(@"C:\Work\OComReports\AssesmentXML\ISPContacts.xml");
            //MessageBox.Show("ISPContacts");
            return dt.DataSet;
        }

        public DataSet ISPImportantPeople(long AssesmentID)
        {
            sb.Clear();
            sb.Append("SELECT   DBA.ANYW_ISP_Consumer_Contact_Important_People.ISP_Consumer_Important_People_ID, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_People.ISP_Consumer_Contact_Id, DBA.ANYW_ISP_Consumer_Contact_Important_People.Type, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_People.Name, DBA.ANYW_ISP_Consumer_Contact_Important_People.Relationship, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_People.Address, DBA.ANYW_ISP_Consumer_Contact_Important_People.Phone, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_People.Row_Order, DBA.ANYW_ISP_Consumer_Contact_Important_People.Email ");
            sb.Append("FROM     DBA.ANYW_ISP_Consumer_Contact_Important_People ");
            sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Consumer_Contact ON DBA.ANYW_ISP_Consumer_Contact_Important_People.ISP_Consumer_Contact_Id = DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Contact_Id ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID = {0} ", AssesmentID);
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //dt.WriteXmlSchema(@"C:\Work\OComReports\AssesmentXML\ISPImportantPeople.xml");
            //MessageBox.Show("ISPImportantPeople");
            return dt.DataSet;
        }

        public DataSet ISPClubs(long AssesmentID)
        {
            sb.Clear();
            sb.Append("SELECT   DBA.ANYW_ISP_Consumer_Contact_Important_Groups.ISP_Consumer_Important_Groups_ID, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Groups.ISP_Consumer_Contact_Id, DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Status, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Name, DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Address, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Phone, DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Meeting_Info, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Who_Helps, DBA.ANYW_ISP_Consumer_Contact_Important_Groups.Row_Order ");
            sb.Append("FROM DBA.ANYW_ISP_Consumer_Contact ");
            sb.Append("RIGHT OUTER JOIN DBA.ANYW_ISP_Consumer_Contact_Important_Groups ON DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Contact_Id = DBA.ANYW_ISP_Consumer_Contact_Important_Groups.ISP_Consumer_Contact_Id ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID = {0} ", AssesmentID);
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //MessageBox.Show("ISPClubs");
            return dt.DataSet;
        }

        public DataSet ISPPlaces(long AssesmentID)
        {
            sb.Clear();
            sb.Append("SELECT   DBA.ANYW_ISP_Consumer_Contact_Important_Places.ISP_Consumer_Important_Places_ID, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Places.ISP_Consumer_Contact_Id, DBA.ANYW_ISP_Consumer_Contact_Important_Places.Type, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Places.Name, DBA.ANYW_ISP_Consumer_Contact_Important_Places.Address, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Places.Phone, DBA.ANYW_ISP_Consumer_Contact_Important_Places.Schedule, ");
            sb.Append("DBA.ANYW_ISP_Consumer_Contact_Important_Places.Acuity, DBA.ANYW_ISP_Consumer_Contact_Important_Places.Row_Order ");
            sb.Append("FROM DBA.ANYW_ISP_Consumer_Contact ");
            sb.Append("RIGHT OUTER JOIN DBA.ANYW_ISP_Consumer_Contact_Important_Places ON DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Contact_Id = DBA.ANYW_ISP_Consumer_Contact_Important_Places.ISP_Consumer_Contact_Id ");
            sb.AppendFormat("WHERE DBA.ANYW_ISP_Consumer_Contact.ISP_Consumer_Plan_ID = {0} ", AssesmentID);
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            //MessageBox.Show("ISPPlaces");
            return dt.DataSet;
        }

        public DataSet ISPIntroduction(long AssesmentID, Boolean Advisor = false)
        {
            var ms = new MemoryStream();
            byte[] ba = null;

            sb.Clear();
            sb.Append("SELECT   DBA.People.Last_Name, DBA.People.First_Name, DBA.People.Middle_Name, ");
            sb.Append("DBA.anyw_isp_consumer_plans.Use_Consumer_Plan_Image, DBA.anyw_isp_consumer_plans.Like_Admire, ");
            sb.Append("DBA.anyw_isp_consumer_plans.Things_Important_To, DBA.anyw_isp_consumer_plans.Things_important_For, ");
            sb.Append("DBA.anyw_isp_consumer_plans.How_To_Support, DBA.ANYW_ISP_Consumer_Plan_Images.Image AS PlanPicture, ");
            sb.Append("DBA.People.Nick_Name, '' AS BadPicture, ");
            if (Advisor == true)
            {
                sb.Append("DBA.People.Consumer_ID AS ID ");
            }
            else
            {
                sb.Append("DBA.People.ID ");
            }
            sb.Append("FROM DBA.anyw_isp_consumer_plans ");
            sb.Append("LEFT OUTER JOIN DBA.ANYW_ISP_Consumer_Plan_Images ON DBA.anyw_isp_consumer_plans.isp_consumer_plan_id = DBA.ANYW_ISP_Consumer_Plan_Images.ISP_Consumer_Plan_ID ");
            sb.Append("LEFT OUTER JOIN DBA.People ON DBA.anyw_isp_consumer_plans.consumer_id = DBA.People.ID ");
            sb.AppendFormat("WHERE DBA.anyw_isp_consumer_plans.isp_consumer_plan_id = {0} ", AssesmentID);
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            if (dt.Rows.Count > 0)
            {
                string fPath = string.Empty;
                DataRow row = dt.Rows[0];
                if (row["Use_Consumer_Plan_Image"].ToString() == "1") //Custom
                {
                    ba = (byte[])row["PlanPicture"];
                    if (ba.Length == 0)
                    {
                        ba = null;
                    }
                }
                else if (row["Use_Consumer_Plan_Image"].ToString() == "2") //No Picture
                {
                    ba = null;
                    fPath = @".\Images\new-icons\default.jpg";
                    if (File.Exists(fPath))
                    {
                        ba = File.ReadAllBytes(fPath);
                    }
                }

                else
                {
                    fPath = string.Empty;
                    sb.Clear();
                    sb.Append("SELECT   setting ");
                    sb.Append("FROM sysoption ");
                    sb.AppendFormat("WHERE {0}  = 'Anywhere_Portrait_Path' ", @"""option""");
                    if (di.SelectRowsDS(sb.ToString()).Tables[0].Rows.Count > 0)
                    {
                        fPath = di.SelectRowsDS(sb.ToString()).Tables[0].Rows[0]["setting"].ToString();
                        row["PlanPicture"] = 0;
                    }
                    try
                    {
                        string picName = string.Format("{0}\\{1}.", fPath, row["id"]);

                        if (File.Exists(string.Format("{0}jpg", picName)))
                        {
                            ba = File.ReadAllBytes(string.Format("{0}jpg", picName));
                        }

                        if (File.Exists(string.Format("{0}png", picName)))
                        {
                            ba = File.ReadAllBytes(string.Format("{0}png", picName));
                        }
                    }
                    catch
                    {

                    };
                }


                if (ba != null)

                {
                    ms.Write(ba, 0, ba.Length);
                    ms.Position = 0L;

                    System.Drawing.Image i = System.Drawing.Image.FromStream(ms);
                    var bm = new System.Drawing.Bitmap(192, 192, System.Drawing.Imaging.PixelFormat.Format24bppRgb);
                    var g = System.Drawing.Graphics.FromImage(bm);
                    g.Clear(System.Drawing.Color.White);
                    g.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceOver;
                    g.DrawImage(i, 0, 0, 192, 192);

                    var ms2 = new MemoryStream();
                    bm.Save(ms2, System.Drawing.Imaging.ImageFormat.Bmp);
                    ms2.Position = 0L;
                    ba = null;
                    ba = ms2.ToArray();
                    row["PlanPicture"] = ba;

                    //iImage = i;

                    ms.Close();
                    ms.Dispose();
                    ms2.Close();
                    ms2.Dispose();
                }
            }
            //MessageBox.Show("ISPIntroduction");
            return dt.DataSet;
        }

        public long HideSubSectionTitle(long AssesmentID, string SubSectionName, long SectionOrder)
        {
            sb.Clear();
            sb.Append("SELECT COUNT(dba.ANYW_ISP_Consumer_Assessment_Answers.answer) AS iCount ");
            sb.Append("FROM dba.ANYW_ISP_Assessment_Question_Sets ");
            sb.Append("LEFT OUTER JOIN dba.ANYW_ISP_Assessment_Subsections ON dba.ANYW_ISP_Assessment_Question_Sets.isp_assessment_subsection_id = dba.ANYW_ISP_Assessment_Subsections.isp_assessment_subsection_id ");
            sb.Append("LEFT OUTER JOIN dba.ANYW_ISP_Assessment_Sections ON dba.ANYW_ISP_Assessment_Question_Sets.isp_assessment_section_id = dba.ANYW_ISP_Assessment_Sections.isp_assessment_section_id ");
            sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Assessment_Questions ON dba.ANYW_ISP_Assessment_Question_Sets.isp_assessment_question_set_id = dba.ANYW_ISP_Assessment_Questions.isp_assessment_question_set_id ");
            sb.Append("RIGHT OUTER JOIN dba.ANYW_ISP_Consumer_Assessment_Answers ON dba.ANYW_ISP_Assessment_Questions.isp_assessment_question_id = dba.ANYW_ISP_Consumer_Assessment_Answers.isp_assessment_question_id ");
            sb.Append("LEFT OUTER JOIN dba.ANYW_ISP_Plan_Section_Applicable SectionAllowable ON dba.ANYW_ISP_Assessment_Sections.isp_assessment_section_id = SectionAllowable.ISP_Assessment_Section_ID ");
            sb.AppendFormat("WHERE SectionAllowable.ISP_Assessment_ID = {0} ", AssesmentID);
            sb.AppendFormat("AND dba.ANYW_ISP_Consumer_Assessment_Answers.isp_consumer_plan_id = {0} ", AssesmentID);
            sb.Append("AND SectionAllowable.Applicable = 'y' ");
            sb.Append("AND dba.ANYW_ISP_Assessment_Questions.hide_on_assessment IS NULL ");
            sb.Append("AND dba.ANYW_ISP_Assessment_Questions.answer_style = 'CHECKOPTION' ");
            sb.AppendFormat("AND dba.ANYW_ISP_Assessment_Subsections.subsection_title = '{0}' ", SubSectionName);
            sb.AppendFormat("AND dba.ANYW_ISP_Assessment_Sections.section_order = {0} ", SectionOrder);
            sb.Append("AND dba.ANYW_ISP_Consumer_Assessment_Answers.answer = '1' ");
            if (di.QueryScalar(sb.ToString()) > 0)
                return 0;
            else
                return 1;
        }




    }//
}//