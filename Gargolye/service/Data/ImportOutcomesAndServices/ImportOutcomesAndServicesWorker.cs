using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using pdftron.Common;
using pdftron.PDF;
using static Anywhere.service.Data.PlanOutcomes.PlanOutcomesWorker;

namespace Anywhere.service.Data.ImportOutcomesAndServices
{
    public class RiskAssessment
    {
        public string AssessmentArea { get; set; }
        public string WhatIsRisk { get; set; }
        public string WhatSupportMustLookLike { get; set; }
        public string RiskRequiresSupervision { get; set; }
        public string WhoIsResponsible { get; set; }
    }

    public class Experiences
    {
        public string WhatNeedsToHappen { get; set; }
        public string HowItShouldHappen { get; set; }
        public string WhoIsResponsible { get; set; }
        public string WhenHowOften { get; set; }
    }

    public class PaidSupports
    {
        public string AssessmentArea { get; set; }
        public string ServiceName { get; set; }
        public string ScopeOfService { get; set; }
        public string HowOftenHowMuch { get; set; }
        public string BeginDateEndDate { get; set; }
        public string FundingSource { get; set; }
        public string ProviderName { get; set; }
    }

    public class AdditionalSupports
    {
        public string AssessmentArea { get; set; }
        public string WhoSupports { get; set; }
        public string WhatSupportLooksLike { get; set; }
        public string WhenHowOften { get; set; }
    }

    public class ProfessionalReferrals
    {
        public string AssessmentArea { get; set; }
        public string NewOrExisting { get; set; }
        public string WhoSupports { get; set; }
        public string ReasonForReferral { get; set; }
    }

    public class ExtractedTables
    {
        public List<RiskAssessment> riskAssessments { get; set; }
        public List<Experiences> experiences { get; set; }
        public List<PaidSupports> paidSupports { get; set; }
        public List<AdditionalSupports> additionalSupports { get; set; }
        public List<ProfessionalReferrals> professionalReferrals { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
    }

    public class ImportedTables
    {
        public int? assessmentAreaId { get; set; }
        public string assessmentArea { get; set; }
        public string whatIsRisk { get; set; }
        public string whatSupportLooksLike { get; set; }
        public string riskRequiresSupervision { get; set; }
        public string whatNeedsToHappen { get; set; }
        public string howItShouldHappen { get; set; }
        public string whoIsResponsible { get; set; }
        public string whenHowOften { get; set; }
        public string providerName { get; set; }
        public string scopeOfService { get; set; }
        public string howOftenValue { get; set; }
        public string howOftenText { get; set; }
        public string howOftenFrequency { get; set; }
        public string whoSupports { get; set; }
        public string newOrExisting { get; set; }
        public string reasonForReferral { get; set; }
        public string section { get; set; }
        public string existingOutcomeGoalId { get; set; }
        public string serviceDateStart { get; set; }
        public string serviceDateEnd { get; set; }
    }

    public class ImportOutcomesAndServicesWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        ImportOutcomesAndServicesDataGetter ioasdg = new ImportOutcomesAndServicesDataGetter();

        // Headers for table recognition
        private readonly List<string> riskAssessmentHeaders = new List<string>
        {
            "Assessment Area:",
            "What is the risk, what it looks like, where it occurs:",
            "What support must look like, why the person needs this support:",
            "Does this risk require supervision?",
            "Who is responsible:"
        };

        private readonly List<string> experienceHeaders = new List<string>
        {
            "How it should happen",
            "Who is responsible",
            "When/How often"
        };

        private readonly List<string> paidSupportsHeaders = new List<string>
        {
            "Assessment Area:",
            "Service Name:",
            "Scope of Service/What support looks like:",
            "How often/How Much?",
            "Begin Date/End Date:",
            "Funding Source:"
        };

        private readonly List<string> additionalSupportsHeaders = new List<string>
        {
            "Assessment Area:",
            "Who supports:",
            "What support looks like:",
            "When/How often:"
        };

        private readonly List<string> professionalReferralHeaders = new List<string>
        {
            "Assessment Area:",
            "New or Existing:",
            "Who supports:",
            "Reason for referral:"
        };

        // Assessment Area categories used for new row detection
        private readonly List<string> assessmentAreas = new List<string>
        {
            "Communication",
            "Advocacy & Engagement",
            "Safety & Security",
            "Social & Spirituality",
            "Daily Life & Employment",
            "Community Living",
            "Healthy Living"
        };

        public ExtractedTables importedOutcomesPDFData(string token, string[] files)
        {
            // Initialize the PDFNet library
            pdftron.PDFNet.Initialize("Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::W+:AMS(20240512):89A5A05D0437C60A0320B13AC992737860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7");

            ExtractedTables extractedTables = new ExtractedTables
            {
                riskAssessments = new List<RiskAssessment>(),
                paidSupports = new List<PaidSupports>(),
                additionalSupports = new List<AdditionalSupports>(),
                professionalReferrals = new List<ProfessionalReferrals>(),
                experiences = new List<Experiences>()
            };

            try
            {
                foreach (string file in files)
                {
                    byte[] pdfBytes = System.Convert.FromBase64String(file);

                    using (MemoryStream pdfStream = new MemoryStream(pdfBytes))
                    {
                        using (PDFDoc doc = new PDFDoc(pdfStream))
                        {
                            doc.InitSecurityHandler();

                            string combinedText = "";
                            for (int i = 1; i <= doc.GetPageCount(); i++)
                            {
                                TextExtractor textExtractor = new TextExtractor();
                                Page page = doc.GetPage(i);

                                if (page != null)
                                {
                                    textExtractor.Begin(page, null, TextExtractor.ProcessingFlags.e_extract_using_zorder);
                                    combinedText += ProcessTextExtractor(textExtractor, page) + "\n\n";
                                }
                                else
                                {
                                    Console.WriteLine($"Page {i} not found in the document.");
                                }
                            }

                            // Store the results in variables for further inspection
                            var debugPageText = combinedText;

                            // Save the first two lines for later checks
                            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

                            string input = "ISP Span Dates: August 31, 2023 - August 30, 2024";

                            // Regular expression pattern to match the two dates
                            string pattern = @"ISP Span Dates:\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})\s*-\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})";

                            Match match = Regex.Match(input, pattern);

                            if (match.Success)
                            {
                                string startDateStr = match.Groups[1].Value;
                                string endDateStr = match.Groups[2].Value;

                                // Parse the date strings into DateTime objects
                                DateTime startDate = DateTime.ParseExact(startDateStr, "MMMM d, yyyy", CultureInfo.InvariantCulture);
                                DateTime endDate = DateTime.ParseExact(endDateStr, "MMMM d, yyyy", CultureInfo.InvariantCulture);

                                // Format the dates as needed for the front end
                                string startDateFormatted = startDate.ToString("yyyy-MM-dd");
                                string endDateFormatted = endDate.ToString("yyyy-MM-dd");

                                extractedTables.startDate = startDateFormatted;
                                extractedTables.endDate = endDateFormatted;
                            }

                            string firstTwoLines = lines.Length > 1 ? lines[0] + "\n" + lines[1] : "";

                            // Print combined text for debugging
                            Console.WriteLine(combinedText);

                            // Process the combined text for risk assessments
                            var riskAssessments = ProcessCombinedTextForRiskAssessment(combinedText, firstTwoLines);
                            var paidSupports = ProcessCombinedTextForPaidSupports(combinedText, firstTwoLines);
                            var additionalSupports = ProcessCombinedTextForAdditionalSupports(combinedText, firstTwoLines);
                            var professionalReferrals = ProcessCombinedTextForProfessionalReferrals(combinedText, firstTwoLines);
                            var experiences = ProcessCombinedTextForExperiences(combinedText);

                            // Combine the extracted tables from the current file with the overall extracted tables
                            extractedTables.riskAssessments.AddRange(riskAssessments);
                            extractedTables.paidSupports.AddRange(paidSupports);
                            extractedTables.additionalSupports.AddRange(additionalSupports);
                            extractedTables.professionalReferrals.AddRange(professionalReferrals);
                            extractedTables.experiences.AddRange(experiences);
                        }
                    }
                }
            }
            catch (PDFNetException e)
            {
                // Handle exception as needed
                Console.WriteLine(e.Message);
            }

            // Terminate PDFNet
            pdftron.PDFNet.Terminate();

            return extractedTables;
        }

        string ProcessTextExtractor(TextExtractor textExtractor, Page page)
        {
            List<string> combinedLines = new List<string>();
            string currentLineText = "";
            Rect currentLineBBox = new Rect();

            // Detect lines using ElementReader
            ElementReader reader = new ElementReader();
            reader.Begin(page);

            List<Rect> verticalLines = new List<Rect>();
            Element element;
            while ((element = reader.Next()) != null)
            {
                if (element.GetType() == Element.Type.e_path)
                {
                    Rect bbox = new Rect();
                    if (element.GetBBox(bbox))
                    {
                        if (IsVerticalLine(bbox))
                        {
                            verticalLines.Add(bbox);
                        }
                    }
                }
            }
            reader.End();

            TextExtractor.Line previousLine = null;

            for (TextExtractor.Line line = textExtractor.GetFirstLine(); line.IsValid(); line = line.GetNextLine())
            {
                Rect lineBBox = line.GetBBox();

                if (currentLineBBox.x1 != 0 && currentLineBBox.x1 != lineBBox.x1)
                {
                    combinedLines.Add($"{currentLineText.Trim()}");
                    currentLineText = "";
                    currentLineBBox = new Rect();
                }

                TextExtractor.Word previousWord = null;
                

                for (TextExtractor.Word word = line.GetFirstWord(); word.IsValid(); word = word.GetNextWord())
                {
                    if (previousWord != null && IsVerticalLineBetweenWords(previousWord, word, verticalLines))
                    {
                        combinedLines.Add($"{currentLineText.Trim()}");
                        currentLineText = "";
                        currentLineBBox = new Rect();
                    }

                    currentLineText += " " + word.GetString();
                    previousWord = word;

                    // Update current line BBox
                    if (currentLineBBox.x1 == 0)
                    {
                        currentLineBBox = word.GetBBox();
                    }
                    else
                    {
                        currentLineBBox.x2 = word.GetBBox().x2;
                        currentLineBBox.y2 = Math.Min(currentLineBBox.y2, word.GetBBox().y2);
                    }
                }

                if (currentLineBBox.x1 == 0)
                {
                    currentLineBBox = lineBBox;
                }
                else
                {
                    currentLineBBox.x2 = Math.Max(currentLineBBox.x2, lineBBox.x2);
                    currentLineBBox.y2 = Math.Min(currentLineBBox.y2, lineBBox.y2);
                }

                if (previousLine != null)
                {
                    // Check if the gap between the starting `x` values of two lines is greater than 350
                    double gapBetweenLines = lineBBox.x1 - previousLine.GetBBox().x1;
                    if (gapBetweenLines > 250)
                    {
                        combinedLines.Add(" "); // Insert "BLANK CELL" when the gap is too large
                    }
                }

                previousLine = line;
            }

            // Add the last line if any
            if (!string.IsNullOrEmpty(currentLineText))
            {
                combinedLines.Add($"{currentLineText.Trim()}");
            }

            return string.Join("\n", combinedLines);
        }


        bool IsVerticalLine(Rect bbox)
        {
            // Check if the width is very small compared to the height
            return Math.Abs(bbox.x2 - bbox.x1) < 1.0 && Math.Abs(bbox.y2 - bbox.y1) > 1.0;
        }

        bool IsVerticalLineBetweenWords(TextExtractor.Word word1, TextExtractor.Word word2, List<Rect> verticalLines)
        {
            foreach (var line in verticalLines)
            {
                if (line.x1 > word1.GetBBox().x2 && line.x1 < word2.GetBBox().x1 &&
                    line.y1 < word1.GetBBox().y1 && line.y2 > word1.GetBBox().y2)
                {
                    return true;
                }
            }
            return false;
        }


        List<RiskAssessment> ProcessCombinedTextForRiskAssessment(string combinedText, string firstTwoLines)
        {
            var riskAssessmentsList = new List<RiskAssessment>();
            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string[] firstTwoLinesArray = firstTwoLines.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < lines.Length; i++)
            {
                // Check if the line contains the first header
                if (lines[i].Contains(riskAssessmentHeaders[0]))
                {
                    // Check for the presence of subsequent headers in the next lines
                    bool headersFound = true;
                    for (int j = 1; j < riskAssessmentHeaders.Count; j++)
                    {
                        if (i + j >= lines.Length || !lines[i + j].Contains(riskAssessmentHeaders[j]))
                        {
                            headersFound = false;
                            break;
                        }
                    }

                    if (headersFound)
                    {
                        i += riskAssessmentHeaders.Count; // Move past the headers
                        while (i < lines.Length)
                        {
                            var assessmentArea = lines[i].Trim();
                            if (!assessmentAreas.Contains(assessmentArea))
                            {
                                // Check for first two lines and skip if found
                                bool skipNextTwoLines = (i + 1 < lines.Length && lines[i].Contains(firstTwoLinesArray[0]) && lines[i + 1].Contains(firstTwoLinesArray[1]));

                                if (skipNextTwoLines)
                                {
                                    i += 4; // Skip the next four lines
                                    continue;
                                }

                                break;
                            }

                            var riskAssessment = new RiskAssessment
                            {
                                AssessmentArea = assessmentArea,
                                WhatIsRisk = GetNextLine(lines, ref i),
                                WhatSupportMustLookLike = GetNextLine(lines, ref i),
                                RiskRequiresSupervision = GetNextLine(lines, ref i),
                                WhoIsResponsible = GetNextLine(lines, ref i)
                            };

                            riskAssessmentsList.Add(riskAssessment);

                            // Move to the next line to check if it's the start of a new assessment area
                            i++;
                            if (i >= lines.Length || !assessmentAreas.Contains(lines[i].Trim()))
                            {
                                i--; // Step back one line as the current line doesn't start a new assessment area
                                break;
                            }
                        }
                    }
                }
            }

            return riskAssessmentsList;
        }

        List<Experiences> ProcessCombinedTextForExperiences(string combinedText)
        {
            var experiencesList = new List<Experiences>();
            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < lines.Length; i++)
            {
                // Check if the line contains the first header
                if (lines[i].Contains(experienceHeaders[0]))
                {
                    // Check for the presence of subsequent headers in the next lines
                    bool headersFound = true;
                    for (int j = 1; j < experienceHeaders.Count; j++)
                    {
                        if (i + j >= lines.Length || !lines[i + j].Contains(experienceHeaders[j]))
                        {
                            headersFound = false;
                            break;
                        }
                    }

                    if (headersFound)
                    {
                        i += experienceHeaders.Count; // Move past the headers
                        while (i < lines.Length)
                        {
                            var experience = new Experiences
                            {
                                WhatNeedsToHappen = lines[i],
                                HowItShouldHappen = GetNextLine(lines, ref i),
                                WhoIsResponsible = GetNextLine(lines, ref i),
                                WhenHowOften = GetNextLine(lines, ref i),
                            };

                            experiencesList.Add(experience);

                            // Move to the next line to check if it's the start of a new assessment area
                            i++;
                            if (i >= lines.Length || !assessmentAreas.Contains(lines[i].Trim()))
                            {
                                i--; // Step back one line as the current line doesn't start a new assessment area
                                break;
                            }
                        }
                    }
                }
            }

            return experiencesList;
        }

        List<PaidSupports> ProcessCombinedTextForPaidSupports(string combinedText, string firstTwoLines)
        {
            var paidSupportsList = new List<PaidSupports>();
            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string[] firstTwoLinesArray = firstTwoLines.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string providerName = string.Empty; // Variable to store provider name

            for (int i = 0; i < lines.Length; i++)
            {
                // Check if the line contains the first header
                if (lines[i].Contains(paidSupportsHeaders[0]))
                {
                    // Check for the presence of subsequent headers in the next lines
                    bool headersFound = true;
                    for (int j = 1; j < paidSupportsHeaders.Count; j++)
                    {
                        if (i + j >= lines.Length || !lines[i + j].Contains(paidSupportsHeaders[j]))
                        {
                            headersFound = false;
                            break;
                        }
                    }

                    if (headersFound)
                    {
                        // Reverse search for "Who is Responsible:" and capture the next line
                        for (int k = i - 1; k >= 0; k--)
                        {
                            if (lines[k].Contains("Who is responsible:"))
                            {
                                // Ensure that there's a next line after "Who is Responsible:"
                                if (k + 1 < lines.Length)
                                {
                                    providerName = lines[k + 1].Trim(); // Capture the next line as providerName
                                }
                                break; // Exit the reverse search once found
                            }
                        }

                        i += paidSupportsHeaders.Count; // Move past the headers
                        while (i < lines.Length)
                        {
                            // Check for first two lines
                            bool skipNextTwoLines = (i + 1 < lines.Length && lines[i].Contains(firstTwoLinesArray[0]) && lines[i +1].Contains(firstTwoLinesArray[1]));

                            if (skipNextTwoLines)
                            {
                                i += 4; // Skip the next four lines
                                continue;
                            }

                            var assessmentArea = lines[i].Trim();

                            if (!assessmentAreas.Contains(assessmentArea))
                            {
                                if (skipNextTwoLines)
                                {
                                    i += 4; // Skip the next four lines
                                    continue;
                                }

                                break;
                            }

                            var paidSupport = new PaidSupports
                            {
                                ProviderName = providerName, // Assign providerName to each row
                                AssessmentArea = assessmentArea,
                                ServiceName = GetNextLine(lines, ref i),
                                ScopeOfService = GetNextLine(lines, ref i),
                                HowOftenHowMuch = GetNextLine(lines, ref i),
                                BeginDateEndDate = GetNextLine(lines, ref i),
                                FundingSource = GetNextLine(lines, ref i),
                            };

                            paidSupportsList.Add(paidSupport);

                            // Move to the next line to check if it's the start of a new assessment area
                            i++;
                            if (i >= lines.Length || !assessmentAreas.Contains(lines[i].Trim()))
                            {
                                // Check for first two lines
                                bool skipNextTwoLines2 = (i + 1 < lines.Length && lines[i].Contains(firstTwoLinesArray[0]) && lines[i + 1].Contains(firstTwoLinesArray[1]));

                                if (skipNextTwoLines2)
                                {
                                    i += 4; // Skip the next four lines
                                    continue;
                                }

                                i--; // Step back one line as the current line doesn't start a new assessment area
                                break;
                            }
                        }
                    }
                }
            }

            return paidSupportsList;
        }

        List<AdditionalSupports> ProcessCombinedTextForAdditionalSupports(string combinedText, string firstTwoLines)
        {
            var additionalSupportsList = new List<AdditionalSupports>();
            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string[] firstTwoLinesArray = firstTwoLines.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < lines.Length; i++)
            {
                // Check if the line contains the first header
                if (lines[i].Contains(additionalSupportsHeaders[0]))
                {
                    // Check for the presence of subsequent headers in the next lines
                    bool headersFound = true;
                    for (int j = 1; j < additionalSupportsHeaders.Count; j++)
                    {
                        if (i + j >= lines.Length || !lines[i + j].Contains(additionalSupportsHeaders[j]))
                        {
                            headersFound = false;
                            break;
                        }
                    }

                    if (headersFound)
                    {
                        i += additionalSupportsHeaders.Count; // Move past the headers
                        while (i < lines.Length)
                        {
                            // Check for first two lines
                            bool skipNextTwoLines = (i + 1 < lines.Length && lines[i].Contains(firstTwoLinesArray[0]) && lines[i + 1].Contains(firstTwoLinesArray[1]));

                            if (skipNextTwoLines)
                            {
                                i += 4; // Skip the next four lines
                                continue;
                            }

                            var assessmentArea = lines[i].Trim();
                            if (!assessmentAreas.Contains(assessmentArea))
                            {
                                // Check for first two lines and skip if found
                                bool skipNextTwoLines2 = (i + 1 < lines.Length && lines[i + 1].Contains(firstTwoLinesArray[0]) && lines[i + 2].Contains(firstTwoLinesArray[1]));

                                if (skipNextTwoLines2)
                                {
                                    i += 4; // Skip the next four lines
                                    continue;
                                }

                                break;
                            }

                            var additionalSupport = new AdditionalSupports
                            {
                                AssessmentArea = assessmentArea,
                                WhoSupports = GetNextLine(lines, ref i),
                                WhatSupportLooksLike = GetNextLine(lines, ref i),
                                WhenHowOften = GetNextLine(lines, ref i),
                            };

                            additionalSupportsList.Add(additionalSupport);

                            // Move to the next line to check if it's the start of a new assessment area
                            i++;
                            if (i >= lines.Length || !assessmentAreas.Contains(lines[i].Trim()))
                            {
                                // Check for first two lines and skip if found
                                bool skipNextTwoLines3 = (i + 1 < lines.Length && lines[i].Contains(firstTwoLinesArray[0]) && lines[i + 1].Contains(firstTwoLinesArray[1]));

                                if (skipNextTwoLines3)
                                {
                                    i += 4; // Skip the next four lines
                                    continue;
                                }

                                i--; // Step back one line as the current line doesn't start a new assessment area
                                break;
                            }
                        }
                    }
                }
            }

            return additionalSupportsList;
        }

        List<ProfessionalReferrals> ProcessCombinedTextForProfessionalReferrals(string combinedText, string firstTwoLines)
        {
            var professionalReferralsList = new List<ProfessionalReferrals>();
            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string[] firstTwoLinesArray = firstTwoLines.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < lines.Length; i++)
            {
                // Check if the line contains the first header
                if (lines[i].Contains(professionalReferralHeaders[0]))
                {
                    // Check for the presence of subsequent headers in the next lines
                    bool headersFound = true;
                    for (int j = 1; j < professionalReferralHeaders.Count; j++)
                    {
                        if (i + j >= lines.Length || !lines[i + j].Contains(professionalReferralHeaders[j]))
                        {
                            headersFound = false;
                            break;
                        }
                    }

                    if (headersFound)
                    {
                        i += professionalReferralHeaders.Count; // Move past the headers
                        while (i < lines.Length)
                        {
                            // Check for first two lines
                            bool skipNextTwoLines = (i + 1 < lines.Length && lines[i].Contains(firstTwoLinesArray[0]) && lines[i + 1].Contains(firstTwoLinesArray[1]));

                            if (skipNextTwoLines)
                            {
                                i += 4; // Skip the next four lines
                                continue;
                            }

                            var assessmentArea = lines[i].Trim();
                            if (!assessmentAreas.Contains(assessmentArea))
                            {
                                // Check for first two lines and skip if found
                                bool skipNextTwoLines2 = (i + 1 < lines.Length && lines[i + 1].Contains(firstTwoLinesArray[0]) && lines[i + 2].Contains(firstTwoLinesArray[1]));

                                if (skipNextTwoLines2)
                                {
                                    i += 4; // Skip the next four lines
                                    continue;
                                }

                                break;
                            }

                            var professionalReferral = new ProfessionalReferrals
                            {
                                AssessmentArea = assessmentArea,
                                NewOrExisting = GetNextLine(lines, ref i),
                                WhoSupports = GetNextLine(lines, ref i),
                                ReasonForReferral = GetNextLine(lines, ref i),
                            };

                            professionalReferralsList.Add(professionalReferral);

                            // Move to the next line to check if it's the start of a new assessment area
                            i++;
                            if (i >= lines.Length || !assessmentAreas.Contains(lines[i].Trim()))
                            {
                                // Check for first two lines and skip if found
                                bool skipNextTwoLines3 = (i + 1 < lines.Length && lines[i].Contains(firstTwoLinesArray[0]) && lines[i + 1].Contains(firstTwoLinesArray[1]));

                                if (skipNextTwoLines3)
                                {
                                    i += 4; // Skip the next four lines
                                    continue;
                                }

                                i--; // Step back one line as the current line doesn't start a new assessment area
                                break;
                            }
                        }
                    }
                }
            }

            return professionalReferralsList;
        }

        string GetNextLine(string[] lines, ref int index)
        {
            index++;
            if (index < lines.Length)
            {
                return lines[index].Trim();
            }
            return string.Empty;
        }

        public List<ImportedTables> importSelectedServices(string token, ImportedTables[] importedTables)
        {
            List<ImportedTables> failedImports = new List<ImportedTables>();

            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    foreach (var importedTable in importedTables)
                    {
                        string objectiveStatement = null;
                        string objectiveMethod = null;
                        string objectiveRecurrance = null;

                        switch (importedTable.section)
                        {
                            case "Known & Likely Risks":
                                objectiveStatement = importedTable.whatSupportLooksLike ?? "";
                                objectiveMethod = importedTable.whatIsRisk ?? "";
                                break;
                            case "Experiences":
                                objectiveStatement = importedTable.whatNeedsToHappen ?? "";
                                objectiveMethod = importedTable.howItShouldHappen ?? "";
                                objectiveRecurrance = (importedTable.whenHowOften ?? "").Contains("Weekly") ? "W" :
                                                      (importedTable.whenHowOften ?? "").Contains("Monthly") ? "M" : null;
                                break;
                            case "Paid Supports":
                                objectiveStatement = importedTable.scopeOfService ?? "";
                                objectiveRecurrance = (importedTable.howOftenText ?? "").Contains("Daily") ? "D" :
                                                      (importedTable.howOftenText ?? "").Contains("Weekly") ? "W" :
                                                      (importedTable.howOftenText ?? "").Contains("Monthly") ? "M" : null;
                                break;
                            case "Additional Supports":
                                objectiveStatement = importedTable.whatSupportLooksLike ?? "";
                                objectiveRecurrance = (importedTable.whenHowOften ?? "").Contains("Daily") ? "D" :
                                                      (importedTable.whenHowOften ?? "").Contains("Weekly") ? "W" :
                                                      (importedTable.whenHowOften ?? "").Contains("Monthly") ? "M" : null;
                                break;
                            case "Professional Referrals":
                                objectiveStatement = importedTable.reasonForReferral ?? "";
                                break;
                        }

                        try
                        {
                            string result = ioasdg.importSelectedServices(
                                token,
                                importedTable.existingOutcomeGoalId,
                                objectiveStatement,
                                objectiveMethod,
                                objectiveRecurrance,
                                importedTable.serviceDateStart,
                                importedTable.serviceDateEnd,
                                transaction
                            );

                            // If an error occurs, add the failed object to the list
                            if (result != "[]")
                            {
                                failedImports.Add(importedTable);
                            }
                        }
                        catch (Exception)
                        {
                        }
                    }

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                }
            }

            return failedImports; // Return the list of failed imports (or an empty list if all succeeded)
        }


    }
}
