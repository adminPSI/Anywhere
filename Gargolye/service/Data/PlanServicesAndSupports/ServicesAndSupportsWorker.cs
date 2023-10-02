// Decompiled with JetBrains decompiler
// Type: Anywhere.service.Data.PlanServicesAndSupports.ServicesAndSupportsWorker
// Assembly: Anywhere, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 39B061E5-0D68-4B5C-86AA-22065F23A733
// Assembly location: C:\Users\mike.taft\Desktop\2023.3DLL\Anywhere.dll

using System;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanServicesAndSupports
{
    public class ServicesAndSupportsWorker
    {
        private JavaScriptSerializer js = new JavaScriptSerializer();
        private ServicesAndSupportsDataGetter dg = new ServicesAndSupportsDataGetter();

        public ServicesAndSupportsWorker.ServicesAndSupports getServicesAndSupports(
          string token,
          long anywAssessmentId,
          int consumerId)
        {
            //Paid Support
            string paidSupportString = dg.getPaidSupports(token, anywAssessmentId, 0);
            PaidSupports[] paidSupportObj = js.Deserialize<PaidSupports[]>(paidSupportString);
            //Support Modfications
            string supportModString = dg.getSSModifications(token, anywAssessmentId);
            SupportModifications[] supportModObj = js.Deserialize<SupportModifications[]>(supportModString);
            //Additional Supports
            string additionalSupportString = dg.getAdditionalSupports(token, anywAssessmentId, 0);
            AdditionalSupports[] additionalSupportObj = js.Deserialize<AdditionalSupports[]>(additionalSupportString);
            //Professional Referrals
            string proRefString = dg.getProfessionalReferral(token, anywAssessmentId, 0);
            ProfessionalReferrals[] proRefObj = js.Deserialize<ProfessionalReferrals[]>(proRefString);
            //communications Options
            string communicationOptionsString = dg.getCommunicationOptions(token);
            CommunicationsOptions[] communicationOptionsObj = js.Deserialize<CommunicationsOptions[]>(communicationOptionsString);
            //Employment Options
            string employmentOptionsString = dg.getEmploymentOptions(token);
            EmploymentOptions[] employmentOptionsObj = js.Deserialize<EmploymentOptions[]>(employmentOptionsString);
            //Levels Of Supervision
            string levelsOfSuervisionString = dg.getLevelsOfSupervision(token);
            LevelsOfSupervision[] levelsOfSupervisionObj = js.Deserialize<LevelsOfSupervision[]>(levelsOfSuervisionString);
            //Experience Relationships
            string relationshipString = dg.getExperienceRelationships(consumerId);
            ConsumerRelationships[] relationshipObj = js.Deserialize<ConsumerRelationships[]>(relationshipString);
            //Working/Not Working
            string workingNotWorking = dg.getWorkingNotWorkingAnswers(token, anywAssessmentId);
            WorkingNotWorking[] workingNotWorkingObj = js.Deserialize<WorkingNotWorking[]>(workingNotWorking);
            //Sections Applicable
            string sectionsApplicable = dg.getSectionsApplicable(token, anywAssessmentId);
            SectionsApplicable[] sectionsAPplicalbeObj = js.Deserialize<SectionsApplicable[]>(sectionsApplicable);
            //Total Outcomes
            string assessmentOutcomes = dg.getAssessmentOutcomes(token, anywAssessmentId, 0);
            AssessmentOutcomes[] assessmentOutcomesObj = js.Deserialize<AssessmentOutcomes[]>(assessmentOutcomes);


            ServicesAndSupports totalServicesAndSupports = new ServicesAndSupports();
            totalServicesAndSupports.paidSupport = paidSupportObj;
            totalServicesAndSupports.supportModification = supportModObj;
            totalServicesAndSupports.additionalSupport = additionalSupportObj;
            totalServicesAndSupports.professionalReferral = proRefObj;
            totalServicesAndSupports.communicationsOptions = communicationOptionsObj;
            totalServicesAndSupports.employmentOptions = employmentOptionsObj;
            totalServicesAndSupports.levelsOfsupervision = levelsOfSupervisionObj;
            totalServicesAndSupports.experienceRelationships = relationshipObj;
            totalServicesAndSupports.workingNotWorking = workingNotWorkingObj;
            totalServicesAndSupports.sectionsApplicable = sectionsAPplicalbeObj;
            totalServicesAndSupports.assessmentOutcomes = assessmentOutcomesObj;

            return totalServicesAndSupports;
        }

        public string deleteProfessionalReferral(string token, long professionalReferralId)
        {
            return dg.deleteProfessionalReferral(token, professionalReferralId);
        }

        public string getProfessionalReferral(string token, long professionalReferralId, int targetAssessmentVersionId)
        {
            return dg.getProfessionalReferral(token, professionalReferralId, 0);
        }

        public string updateProfessionalReferral(string token, long professionalReferralId, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral)
        {
            return dg.updateProfessionalReferral(token, professionalReferralId, anywAssessmentId, assessmentAreaId, newOrExisting, whoSupports, reasonForReferral);
        }

        public string insertProfessionalReferral(string token, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral, int rowOrder)
        {
            return dg.insertProfessionalReferral(token, anywAssessmentId, assessmentAreaId, newOrExisting, whoSupports, reasonForReferral, rowOrder);
        }

        public string deleteAdditionalSupports(string token, long additionalSupportsId)
        {
            return dg.deleteAdditionalSupports(token, additionalSupportsId);
        }

        public string updateAdditionalSupports(string token, long additionalSupportsId, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText)
        {
            return dg.updateAdditionalSupports(token, additionalSupportsId, anywAssessmentId, assessmentAreaId, whoSupports, whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText);
        }

        public string insertAdditionalSupports(string token, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText, int rowOrder)
        {
            return dg.insertAdditionalSupports(token, anywAssessmentId, assessmentAreaId, whoSupports, whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText, rowOrder);
        }

        public string deleteSSModifications(string token, long modificationsId)
        {
            return dg.deleteSSModifications(token, modificationsId);
        }

        public string updateSSModifications(string token, long modificationsId, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate)
        {
            return dg.updateSSModifications(token, modificationsId, anywAssessmentId, medicalRate, behaviorRate, icfRate, complexRate, developmentalRate, childIntensiveRate);
        }

        public string insertSSModifications(string token, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate)
        {
            return dg.insertSSModifications(token, anywAssessmentId, medicalRate, behaviorRate, icfRate, complexRate, developmentalRate, childIntensiveRate);
        }

        public string deletePaidSupports(string token, long paidSupportsId)
        {
            return dg.deletePaidSupports(token, paidSupportsId);
        }

        public string updateMultiPaidSupports(string token, string paidSupportsId, string providerId, string beginDate, string endDate)
        {
            return dg.updateMultiPaidSupports(token, paidSupportsId, providerId, beginDate, endDate);
        }
        public string updatePaidSupports(string token, long paidSupportsId, long anywAssessmentId, string providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, string serviceNameOther)
        {
            return dg.updatePaidSupports(token, paidSupportsId, anywAssessmentId, providerId, assessmentAreaId, serviceNameId, scopeOfService, howOftenValue, howOftenFrequency, howOftenText, beginDate, endDate, fundingSource, fundingSourceText, serviceNameOther);
        }

        public string insertPaidSupports(string token, long anywAssessmentId, string providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, int rowOrder, string serviceNameOther)
        {
            return dg.insertPaidSupports(token, anywAssessmentId, providerId, assessmentAreaId, serviceNameId, scopeOfService, howOftenValue, howOftenFrequency, howOftenText, beginDate, endDate, fundingSource, fundingSourceText, rowOrder, serviceNameOther);
        }

        public string updatePaidSupportsRowOrder(string token, long assessmentId, long supportId, int newPos, int oldPos)
        {
            return dg.updatePaidSupportsRowOrder(token, assessmentId, supportId, newPos, oldPos);
        }

        public string updateModificationRowOrder(string token, long assessmentId, long modificationId, int newPos, int oldPos)
        {
            return dg.updateModificationRowOrder(token, assessmentId, modificationId, newPos, oldPos);
        }

        public string updateServiceReferralRowOrder(string token, long assessmentId, long referralId, int newPos, int oldPos)
        {
            return dg.updateServiceReferralRowOrder(token, assessmentId, referralId, newPos, oldPos);
        }

        public string updateAdditionalSupportsRowOrder(string token, long assessmentId, long addSupportId, int newPos, int oldPos)
        {
            return dg.updateAdditionalSupportsRowOrder(token, assessmentId, addSupportId, newPos, oldPos);
        }

        public void carryOverServicesToNewPlan(string consumerPlanId, string priorConsumerPlanId, string effectiveStart, string effectiveend, string targetAssessmentVersionId, string token, string revision)
        {
            long priorPlanId = long.Parse(priorConsumerPlanId);
            long newPlanId = long.Parse(consumerPlanId);
            string beginDate = "";
            string endDateT = "";
            string endDate = "";
            int result = 1;
            //Paid supports
            string paidSupportString = dg.getPaidSupports(token, priorPlanId, int.Parse(targetAssessmentVersionId));
            PaidSupports[] paidSupportObj = js.Deserialize<PaidSupports[]>(paidSupportString);
            string previousPlanEndString = dg.getPreviousPlanEnd(priorConsumerPlanId, token);
            PreviousPlanEnd[] previousEnd = js.Deserialize<PreviousPlanEnd[]>(previousPlanEndString);
            for (int i = 0; i < paidSupportObj.Length; i++)
                ServicesAndSupportsWorker.PaidSupports[] paidSupportsArray = this.js.Deserialize<ServicesAndSupportsWorker.PaidSupports[]>(this.dg.getPaidSupports(token, anywAssessmentId, 0));
            ServicesAndSupportsWorker.SupportModifications[] supportModificationsArray = this.js.Deserialize<ServicesAndSupportsWorker.SupportModifications[]>(this.dg.getSSModifications(token, anywAssessmentId));
            ServicesAndSupportsWorker.AdditionalSupports[] additionalSupportsArray = this.js.Deserialize<ServicesAndSupportsWorker.AdditionalSupports[]>(this.dg.getAdditionalSupports(token, anywAssessmentId, 0));
            ServicesAndSupportsWorker.ProfessionalReferrals[] professionalReferralsArray = this.js.Deserialize<ServicesAndSupportsWorker.ProfessionalReferrals[]>(this.dg.getProfessionalReferral(token, anywAssessmentId, 0));
            ServicesAndSupportsWorker.CommunicationsOptions[] communicationsOptionsArray = this.js.Deserialize<ServicesAndSupportsWorker.CommunicationsOptions[]>(this.dg.getCommunicationOptions(token));
            ServicesAndSupportsWorker.EmploymentOptions[] employmentOptionsArray = this.js.Deserialize<ServicesAndSupportsWorker.EmploymentOptions[]>(this.dg.getEmploymentOptions(token));
            ServicesAndSupportsWorker.LevelsOfSupervision[] levelsOfSupervisionArray = this.js.Deserialize<ServicesAndSupportsWorker.LevelsOfSupervision[]>(this.dg.getLevelsOfSupervision(token));
            ServicesAndSupportsWorker.ConsumerRelationships[] consumerRelationshipsArray = this.js.Deserialize<ServicesAndSupportsWorker.ConsumerRelationships[]>(this.dg.getExperienceRelationships(consumerId));
            return new ServicesAndSupportsWorker.ServicesAndSupports()
            {
                paidSupport = paidSupportsArray,
                supportModification = supportModificationsArray,
                additionalSupport = additionalSupportsArray,
                professionalReferral = professionalReferralsArray,
                communicationsOptions = communicationsOptionsArray,
                employmentOptions = employmentOptionsArray,
                levelsOfsupervision = levelsOfSupervisionArray,
                experienceRelationships = consumerRelationshipsArray
            };
        }

        public string deleteProfessionalReferral(string token, long professionalReferralId) => this.dg.deleteProfessionalReferral(token, professionalReferralId);

        public string getProfessionalReferral(
          string token,
          long professionalReferralId,
          int targetAssessmentVersionId)
        {
            return this.dg.getProfessionalReferral(token, professionalReferralId, 0);
        }

        public string updateProfessionalReferral(
          string token,
          long professionalReferralId,
          long anywAssessmentId,
          int assessmentAreaId,
          char newOrExisting,
          string whoSupports,
          string reasonForReferral)
        {
            return this.dg.updateProfessionalReferral(token, professionalReferralId, anywAssessmentId, assessmentAreaId, newOrExisting, whoSupports, reasonForReferral);
        }

        public string insertProfessionalReferral(
          string token,
          long anywAssessmentId,
          int assessmentAreaId,
          char newOrExisting,
          string whoSupports,
          string reasonForReferral,
          int rowOrder)
        {
            return this.dg.insertProfessionalReferral(token, anywAssessmentId, assessmentAreaId, newOrExisting, whoSupports, reasonForReferral, rowOrder);
        }

        public string deleteAdditionalSupports(string token, long additionalSupportsId) => this.dg.deleteAdditionalSupports(token, additionalSupportsId);

        public string updateAdditionalSupports(
          string token,
          long additionalSupportsId,
          long anywAssessmentId,
          int assessmentAreaId,
          string whoSupports,
          string whatSupportLooksLike,
          string howOftenValue,
          int howOftenFrequency,
          string howOftenText)
        {
            return this.dg.updateAdditionalSupports(token, additionalSupportsId, anywAssessmentId, assessmentAreaId, whoSupports, whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText);
        }

        public string insertAdditionalSupports(
          string token,
          long anywAssessmentId,
          int assessmentAreaId,
          string whoSupports,
          string whatSupportLooksLike,
          string howOftenValue,
          int howOftenFrequency,
          string howOftenText,
          int rowOrder)
        {
            return this.dg.insertAdditionalSupports(token, anywAssessmentId, assessmentAreaId, whoSupports, whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText, rowOrder);
        }

        public string deleteSSModifications(string token, long modificationsId) => this.dg.deleteSSModifications(token, modificationsId);

        public string updateSSModifications(
          string token,
          long modificationsId,
          long anywAssessmentId,
          char medicalRate,
          char behaviorRate,
          char icfRate,
          char complexRate,
          char developmentalRate,
          char childIntensiveRate)
        {
            return this.dg.updateSSModifications(token, modificationsId, anywAssessmentId, medicalRate, behaviorRate, icfRate, complexRate, developmentalRate, childIntensiveRate);
        }

        public string insertSSModifications(
          string token,
          long anywAssessmentId,
          char medicalRate,
          char behaviorRate,
          char icfRate,
          char complexRate,
          char developmentalRate,
          char childIntensiveRate)
        {
            return this.dg.insertSSModifications(token, anywAssessmentId, medicalRate, behaviorRate, icfRate, complexRate, developmentalRate, childIntensiveRate);
        }

        public string deletePaidSupports(string token, long paidSupportsId) => this.dg.deletePaidSupports(token, paidSupportsId);

        public string updateMultiPaidSupports(
          string token,
          string paidSupportsId,
          string providerId,
          string beginDate,
          string endDate)
        {
            return this.dg.updateMultiPaidSupports(token, paidSupportsId, providerId, beginDate, endDate);
        }

        public string updatePaidSupports(
          string token,
          long paidSupportsId,
          long anywAssessmentId,
          string providerId,
          int assessmentAreaId,
          int serviceNameId,
          string scopeOfService,
          string howOftenValue,
          int howOftenFrequency,
          string howOftenText,
          string beginDate,
          string endDate,
          int fundingSource,
          string fundingSourceText,
          string serviceNameOther)
        {
            return this.dg.updatePaidSupports(token, paidSupportsId, anywAssessmentId, providerId, assessmentAreaId, serviceNameId, scopeOfService, howOftenValue, howOftenFrequency, howOftenText, beginDate, endDate, fundingSource, fundingSourceText, serviceNameOther);
        }

        public string insertPaidSupports(
          string token,
          long anywAssessmentId,
          string providerId,
          int assessmentAreaId,
          int serviceNameId,
          string scopeOfService,
          string howOftenValue,
          int howOftenFrequency,
          string howOftenText,
          string beginDate,
          string endDate,
          int fundingSource,
          string fundingSourceText,
          int rowOrder,
          string serviceNameOther)
        {
            return this.dg.insertPaidSupports(token, anywAssessmentId, providerId, assessmentAreaId, serviceNameId, scopeOfService, howOftenValue, howOftenFrequency, howOftenText, beginDate, endDate, fundingSource, fundingSourceText, rowOrder, serviceNameOther);
        }

        public string updatePaidSupportsRowOrder(
          string token,
          long assessmentId,
          long supportId,
          int newPos,
          int oldPos)
        {
            return this.dg.updatePaidSupportsRowOrder(token, assessmentId, supportId, newPos, oldPos);
        }

        public string updateModificationRowOrder(
          string token,
          long assessmentId,
          long modificationId,
          int newPos,
          int oldPos)
        {
            return this.dg.updateModificationRowOrder(token, assessmentId, modificationId, newPos, oldPos);
        }

        public string updateServiceReferralRowOrder(
          string token,
          long assessmentId,
          long referralId,
          int newPos,
          int oldPos)
        {
            return this.dg.updateServiceReferralRowOrder(token, assessmentId, referralId, newPos, oldPos);
        }

        public string updateAdditionalSupportsRowOrder(
          string token,
          long assessmentId,
          long addSupportId,
          int newPos,
          int oldPos)
        {
            return this.dg.updateAdditionalSupportsRowOrder(token, assessmentId, addSupportId, newPos, oldPos);
        }

        public void carryOverServicesToNewPlan(
          string consumerPlanId,
          string priorConsumerPlanId,
          string effectiveStart,
          string effectiveend,
          string targetAssessmentVersionId,
          string token,
          string revision)
        {
            long anywAssessmentId1 = long.Parse(priorConsumerPlanId);
            long anywAssessmentId2 = long.Parse(consumerPlanId);
            ServicesAndSupportsWorker.PaidSupports[] paidSupportsArray = this.js.Deserialize<ServicesAndSupportsWorker.PaidSupports[]>(this.dg.getPaidSupports(token, anywAssessmentId1, int.Parse(targetAssessmentVersionId)));
            ServicesAndSupportsWorker.PreviousPlanEnd[] previousPlanEndArray = this.js.Deserialize<ServicesAndSupportsWorker.PreviousPlanEnd[]>(this.dg.getPreviousPlanEnd(priorConsumerPlanId, token));
            for (int index = 0; index < paidSupportsArray.Length; ++index)
            {
                string beginDate;
                string str;
                int num;
                if (revision == "false")
                {
                    //var bd = DateTime.Parse(paidSupportObj[i].beginDate);
                    var bd = DateTime.Parse(effectiveStart);
                    beginDate = bd.ToString("yyyy-MM-dd");
                    var ed = DateTime.Parse(effectiveend);
                    endDate = ed.ToString("yyyy-MM-dd");
                    var edT = DateTime.Parse(paidSupportObj[i].endDate);
                    endDateT = edT.ToString("yyyy-MM-dd");
                    DateTime previousEndDate = DateTime.Parse(previousEnd[0].endDate);
                    DateTime endTestDate = DateTime.Parse(endDateT);
                    //result = DateTime.Compare(endTestDate, previousEndDate);
                }
                else
                {
                    var bd = DateTime.Parse(paidSupportObj[i].beginDate);
                    beginDate = bd.ToString("yyyy-MM-dd");
                    var ed = DateTime.Parse(paidSupportObj[i].endDate);
                    endDate = ed.ToString("yyyy-MM-dd");
                    //beginDate = paidSupportObj[i].beginDate;
                    //endDate = paidSupportObj[i].endDate;
                    var edT = DateTime.Parse(endDate);
                    endDateT = edT.ToString("yyyy-MM-dd");
                    DateTime previousEndDate = DateTime.Parse(previousEnd[0].endDate);
                    DateTime endTestDate = DateTime.Parse(endDateT);
                    //result = DateTime.Compare(endTestDate, previousEndDate);
                }
                if (result < 0)
                {
                    //do nothing
                }
                else
                {
                    dg.insertPaidSupports(token, newPlanId, paidSupportObj[i].providerId, int.Parse(paidSupportObj[i].assessmentAreaId), int.Parse(paidSupportObj[i].serviceNameId), removeUnsavableNoteText(paidSupportObj[i].scopeOfservice), removeUnsavableNoteText(paidSupportObj[i].howOftenValue), int.Parse(paidSupportObj[i].howOftenFrequency), removeUnsavableNoteText(paidSupportObj[i].howOftenText), beginDate, endDate, int.Parse(paidSupportObj[i].fundingSource), removeUnsavableNoteText(paidSupportObj[i].fundingSourceText), int.Parse(paidSupportObj[i].rowOrder), removeUnsavableNoteText(paidSupportObj[i].serviceNameOther));
                    beginDate = DateTime.Parse(effectiveStart).ToString("yyyy-MM-dd");
                    str = DateTime.Parse(effectiveend).ToString("yyyy-MM-dd");
                    string s = DateTime.Parse(paidSupportsArray[index].endDate).ToString("yyyy-MM-dd");
                    DateTime t2 = DateTime.Parse(previousPlanEndArray[0].endDate);
                    num = DateTime.Compare(DateTime.Parse(s), t2);
                }
                else
                {
                    beginDate = DateTime.Parse(paidSupportsArray[index].beginDate).ToString("yyyy-MM-dd");
                    str = DateTime.Parse(paidSupportsArray[index].endDate).ToString("yyyy-MM-dd");
                    string s = DateTime.Parse(str).ToString("yyyy-MM-dd");
                    DateTime t2 = DateTime.Parse(previousPlanEndArray[0].endDate);
                    num = DateTime.Compare(DateTime.Parse(s), t2);
                }
                if (num >= 0)
                    this.dg.insertPaidSupports(token, anywAssessmentId2, paidSupportsArray[index].providerId, int.Parse(paidSupportsArray[index].assessmentAreaId), int.Parse(paidSupportsArray[index].serviceNameId), this.removeUnsavableNoteText(paidSupportsArray[index].scopeOfservice), this.removeUnsavableNoteText(paidSupportsArray[index].howOftenValue), int.Parse(paidSupportsArray[index].howOftenFrequency), this.removeUnsavableNoteText(paidSupportsArray[index].howOftenText), beginDate, str, int.Parse(paidSupportsArray[index].fundingSource), this.removeUnsavableNoteText(paidSupportsArray[index].fundingSourceText), int.Parse(paidSupportsArray[index].rowOrder), this.removeUnsavableNoteText(paidSupportsArray[index].serviceNameOther));
            }
            ServicesAndSupportsWorker.SupportModifications[] supportModificationsArray = this.js.Deserialize<ServicesAndSupportsWorker.SupportModifications[]>(this.dg.getSSModifications(token, anywAssessmentId1));
            for (int index = 0; index < supportModificationsArray.Length; ++index)
                this.dg.insertSSModifications(token, anywAssessmentId2, char.Parse(supportModificationsArray[index].medicalRate), char.Parse(supportModificationsArray[index].behaviorRate), char.Parse(supportModificationsArray[index].icfRate), char.Parse(supportModificationsArray[index].complexRate), char.Parse(supportModificationsArray[index].developmentalRate), char.Parse(supportModificationsArray[index].childIntensiveRate));
            ServicesAndSupportsWorker.AdditionalSupports[] additionalSupportsArray = this.js.Deserialize<ServicesAndSupportsWorker.AdditionalSupports[]>(this.dg.getAdditionalSupports(token, anywAssessmentId1, int.Parse(targetAssessmentVersionId)));
            for (int index = 0; index < additionalSupportsArray.Length; ++index)
                this.dg.insertAdditionalSupports(token, anywAssessmentId2, int.Parse(additionalSupportsArray[index].assessmentAreaId), this.removeUnsavableNoteText(additionalSupportsArray[index].whoSupports), this.removeUnsavableNoteText(additionalSupportsArray[index].whatSupportsLookLike), this.removeUnsavableNoteText(additionalSupportsArray[index].howOftenValue), int.Parse(additionalSupportsArray[index].howOftenFrequency), this.removeUnsavableNoteText(additionalSupportsArray[index].howOftenText), int.Parse(additionalSupportsArray[index].rowOrder));
            ServicesAndSupportsWorker.ProfessionalReferrals[] professionalReferralsArray = this.js.Deserialize<ServicesAndSupportsWorker.ProfessionalReferrals[]>(this.dg.getProfessionalReferral(token, anywAssessmentId1, int.Parse(targetAssessmentVersionId)));
            for (int index = 0; index < professionalReferralsArray.Length; ++index)
                this.dg.insertProfessionalReferral(token, anywAssessmentId2, int.Parse(professionalReferralsArray[index].assessmentAreaId), char.Parse(professionalReferralsArray[index].newOrExisting), this.removeUnsavableNoteText(professionalReferralsArray[index].whoSupports), this.removeUnsavableNoteText(professionalReferralsArray[index].reasonForReferral), int.Parse(professionalReferralsArray[index].rowOrder));
        }

        public string removeUnsavableNoteText(string note)
        {
            if (note == "" || note == null || !note.Contains("\\"))
                return note;
            note = note.Replace("\\", "");
            return note;
        }

        public class ServicesAndSupports
        {
            public ServicesAndSupportsWorker.PaidSupports[] paidSupport { get; set; }

            public ServicesAndSupportsWorker.SupportModifications[] supportModification { get; set; }

            public ServicesAndSupportsWorker.AdditionalSupports[] additionalSupport { get; set; }

            public ServicesAndSupportsWorker.ProfessionalReferrals[] professionalReferral { get; set; }

            public ServicesAndSupportsWorker.CommunicationsOptions[] communicationsOptions { get; set; }

            public ServicesAndSupportsWorker.EmploymentOptions[] employmentOptions { get; set; }

            public ServicesAndSupportsWorker.LevelsOfSupervision[] levelsOfsupervision { get; set; }

            public ServicesAndSupportsWorker.ConsumerRelationships[] experienceRelationships { get; set; }
        }

        public class CommunicationsOptions
        {
            public string communicationsId { get; set; }

            public string communicationType { get; set; }
        }

        public class EmploymentOptions
        {
            public string employmentId { get; set; }

            public string employmentOption { get; set; }
        }

        public class PreviousPlanEnd
        {
            public string endDate { get; set; }
        }

        public class LevelsOfSupervision
        {
            public string supervisionId { get; set; }

            public string supervisionLabel { get; set; }

            public string supervisiondescription { get; set; }
        }

        public class PaidSupports
        {
            public string paidSupportsId { get; set; }

            public string anywAssessmentId { get; set; }

            public string providerId { get; set; }

            public string assessmentAreaId { get; set; }

            public string serviceNameId { get; set; }

            public string scopeOfservice { get; set; }

            public string howOftenValue { get; set; }

            public string howOftenFrequency { get; set; }

            public string howOftenText { get; set; }

            public string beginDate { get; set; }

            public string endDate { get; set; }

            public string fundingSource { get; set; }

            public string fundingSourceText { get; set; }

            public string rowOrder { get; set; }

            public string serviceNameOther { get; set; }
        }

        public class SupportModifications
        {
            public string modificationsId { get; set; }

            public string anywAssessmentId { get; set; }

            public string medicalRate { get; set; }

            public string behaviorRate { get; set; }

            public string icfRate { get; set; }

            public string complexRate { get; set; }

            public string developmentalRate { get; set; }

            public string childIntensiveRate { get; set; }
        }

        public class AdditionalSupports
        {
            public string additionalSupportsId { get; set; }

            public string anywAssessmentId { get; set; }

            public string assessmentAreaId { get; set; }

            public string whoSupports { get; set; }

            public string whatSupportsLookLike { get; set; }

            public string howOftenValue { get; set; }

            public string howOftenFrequency { get; set; }

            public string howOftenText { get; set; }

            public string rowOrder { get; set; }
        }

        public class ProfessionalReferrals
        {
            public string professionalReferralId { get; set; }

            public string anywAssessmentId { get; set; }

            public string assessmentAreaId { get; set; }

            public string newOrExisting { get; set; }

            public string whoSupports { get; set; }

            public string reasonForReferral { get; set; }

            public string rowOrder { get; set; }
        }

        public class ConsumerRelationships
        {
            public string firstName { get; set; }

            public string lastName { get; set; }

            public string middleName { get; set; }

            public string ID { get; set; }

            public string relationship { get; set; }
        }
    }
}
