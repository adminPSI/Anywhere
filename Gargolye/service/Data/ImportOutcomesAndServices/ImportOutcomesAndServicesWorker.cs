using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using pdftron.Common;
using pdftron.PDF;
using static Anywhere.service.Data.PlanOutcomes.PlanOutcomesWorker;
using static pdftron.PDF.Page;

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
        public string whatSupportMustLookLike { get; set; }
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
            "Services and Supports Additional Supports: Family, friends, community resources, technology, etc. Assessment Area:",
            "Who supports:",
            "What support looks like:",
            //"",
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

                            string combinedTextWithPostitions = "";
                            // Store line positions with line text as the key
                            Dictionary<string, Rect> linePositions = new Dictionary<string, Rect>();
                            for (int i = 1; i <= doc.GetPageCount(); i++)
                            {
                                TextExtractor textExtractor = new TextExtractor();
                                Page page = doc.GetPage(i);

                                if (page != null)
                                {
                                    textExtractor.Begin(page, null, TextExtractor.ProcessingFlags.e_extract_using_zorder);
                                    combinedTextWithPostitions += ProcessTextExtractorWithPositions(textExtractor, page, ref linePositions) + "\n\n";
                                }
                                else
                                {
                                    Console.WriteLine($"Page {i} not found in the document.");
                                }
                            }

                            // Process combinedTextWithPositions for further usage
                            string combinedText = string.Join("\n", combinedTextWithPostitions
                                .Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries)
                                .Select(line => line.Contains(":") ? line.Substring(0, line.LastIndexOf(":")) : line));

                            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
                            string[] linesWithPositions = combinedTextWithPostitions.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

                            List<KeyValuePair<string, Rect>> linePositionsList = ConvertToList(linesWithPositions);

                            // Regular expression pattern to match the two dates
                            string pattern = @"ISP Span Dates:\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})\s*-\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})";

                            // Loop through lines[0] to lines[3] and find the first match
                            Match match = null;
                            for (int i = 0; i <= 3 && i < lines.Length; i++)
                            {
                                match = Regex.Match(lines[i], pattern);
                                if (match.Success)
                                {
                                    break;  // Exit the loop when a match is found
                                }
                            }

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
                            var riskAssessments = ProcessCombinedTextForRiskAssessment(combinedText, firstTwoLines, linePositionsList);
                            var paidSupports = ProcessCombinedTextForPaidSupports(combinedText, firstTwoLines, linePositionsList);
                            var additionalSupports = ProcessCombinedTextForAdditionalSupports(combinedText, firstTwoLines, linePositionsList);
                            var professionalReferrals = ProcessCombinedTextForProfessionalReferrals(combinedText, firstTwoLines);
                            var experiences = ProcessCombinedTextForExperiences(combinedText, firstTwoLines, linePositionsList);

                            // Combine the extracted tables from the current file with the overall extracted tables
                            extractedTables.riskAssessments.AddRange(riskAssessments);
                            extractedTables.paidSupports.AddRange(paidSupports);
                            extractedTables.additionalSupports.AddRange(additionalSupports);
                            extractedTables.professionalReferrals.AddRange(professionalReferrals);
                            extractedTables.experiences.AddRange(experiences);

                            foreach (var risk in extractedTables.riskAssessments)
                            {
                                risk.AssessmentArea = ValidateAndTrimAssessmentArea(risk.AssessmentArea);
                            }

                            foreach (var support in extractedTables.paidSupports)
                            {
                                support.AssessmentArea = ValidateAndTrimAssessmentArea(support.AssessmentArea);
                            }

                            foreach (var support in extractedTables.additionalSupports)
                            {
                                support.AssessmentArea = ValidateAndTrimAssessmentArea(support.AssessmentArea);
                            }

                            foreach (var referral in extractedTables.professionalReferrals)
                            {
                                referral.AssessmentArea = ValidateAndTrimAssessmentArea(referral.AssessmentArea);
                            }
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

        string ProcessTextExtractorWithPositions(TextExtractor textExtractor, Page page, ref Dictionary<string, Rect> linePositions)
        {
            List<string> combinedLines = new List<string>();
            List<string> positionLines = new List<string>();
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
            double gapBetweenLines = 250; // Default value
            bool foundKnownAndLikelyRisks = false; // Flag for "Known and Likely Risks" line

            for (TextExtractor.Line line = textExtractor.GetFirstLine(); line.IsValid(); line = line.GetNextLine())
            {
                Rect lineBBox = line.GetBBox();

                if (currentLineBBox.x1 != 0 && currentLineBBox.x1 != lineBBox.x1)
                {
                    string trimmedText = currentLineText.Trim();
                    combinedLines.Add(trimmedText);

                    if (currentLineBBox.x1 == 0 && currentLineBBox.y1 == 0 && currentLineBBox.x2 == 0 && currentLineBBox.y2 == 0)
                    {
                        positionLines.Add($"{trimmedText}: [0, 0, 0, 0]");
                        linePositions[trimmedText] = new Rect(0, 0, 0, 0);
                    }
                    else
                    {
                        positionLines.Add($"{trimmedText}: [{currentLineBBox.x1}, {currentLineBBox.y1}, {currentLineBBox.x2}, {currentLineBBox.y2}]");
                        linePositions[trimmedText] = currentLineBBox; // Add the current line's BBox to the dictionary
                    }

                    currentLineText = "";
                    currentLineBBox = new Rect();
                }

                TextExtractor.Word previousWord = null;

                for (TextExtractor.Word word = line.GetFirstWord(); word.IsValid(); word = word.GetNextWord())
                {
                    if (previousWord != null && IsVerticalLineBetweenWords(previousWord, word, verticalLines))
                    {
                        string trimmedText = currentLineText.Trim();
                        combinedLines.Add(trimmedText);

                        if (currentLineBBox.x1 == 0 && currentLineBBox.y1 == 0 && currentLineBBox.x2 == 0 && currentLineBBox.y2 == 0)
                        {
                            positionLines.Add($"{trimmedText}: [0, 0, 0, 0]");
                            linePositions[trimmedText] = new Rect(0, 0, 0, 0);
                        }
                        else
                        {
                            positionLines.Add($"{trimmedText}: [{currentLineBBox.x1}, {currentLineBBox.y1}, {currentLineBBox.x2}, {currentLineBBox.y2}]");
                            linePositions[trimmedText] = currentLineBBox; // Add the current line's BBox to the dictionary
                        }

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

                // Check if the current line contains "Known and Likely Risks"
                if (currentLineText.Contains("Known and Likely Risks --include any MUI trends and preventative measures"))
                {
                    foundKnownAndLikelyRisks = true; // Set flag to true but don't change gap yet
                }

                // Check if the current line contains "Who is responsible:"
                if (foundKnownAndLikelyRisks && currentLineText.Contains("Who is responsible:"))
                {
                    gapBetweenLines = 200; // Set the gap to 150 when "Who is responsible:" is found
                    foundKnownAndLikelyRisks = false; // Reset the flag
                }

                // Check if the current line contains "Service and Supports"
                if (currentLineText.Contains("Service and Supports"))
                {
                    gapBetweenLines = 250; // Reset the gap to the default

                }

                if (previousLine != null)
                {
                    // Check if the gap between the starting `x` values of two lines exceeds the current gap threshold
                    double gapBetweenLinesValue = lineBBox.x1 - previousLine.GetBBox().x1;
                    if (gapBetweenLinesValue > gapBetweenLines)
                    {
                        combinedLines.Add(" "); // Insert "BLANK CELL" when the gap is too large
                        positionLines.Add(" : "); // Add a blank position for the "BLANK CELL"
                        linePositions[" "] = new Rect(); // Add a blank BBox for the "BLANK CELL"
                    }
                }

                previousLine = line;
            }

            // Add the last line if any
            if (!string.IsNullOrEmpty(currentLineText))
            {
                string trimmedText = currentLineText.Trim();
                combinedLines.Add(trimmedText);

                if (currentLineBBox.x1 == 0 && currentLineBBox.y1 == 0 && currentLineBBox.x2 == 0 && currentLineBBox.y2 == 0)
                {
                    positionLines.Add($"{trimmedText}: [0, 0, 0, 0]");
                    linePositions[trimmedText] = new Rect(0, 0, 0, 0);
                }
                else
                {
                    positionLines.Add($"{trimmedText}: [{currentLineBBox.x1}, {currentLineBBox.y1}, {currentLineBBox.x2}, {currentLineBBox.y2}]");
                    linePositions[trimmedText] = currentLineBBox; // Add the last line's BBox to the dictionary
                }
            }

            return string.Join("\n", positionLines);
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

        List<KeyValuePair<string, Rect>> ConvertToList(string[] input)
        {
            List<KeyValuePair<string, Rect>> result = new List<KeyValuePair<string, Rect>>();

            foreach (string line in input)
            {
                // Split the string into the text and the rectangle values
                int separatorIndex = line.LastIndexOf(": ");
                if (separatorIndex > -1)
                {
                    string key = line.Substring(0, separatorIndex).Trim();
                    string rectValues = line.Substring(separatorIndex + 2).Trim();

                    // Parse the rectangle values
                    rectValues = rectValues.Trim('[', ']'); // Remove the square brackets
                    string[] values = rectValues.Split(',');

                    Rect rect;
                    if (values.Length == 4 &&
                        double.TryParse(values[0], out double x1) &&
                        double.TryParse(values[1], out double y1) &&
                        double.TryParse(values[2], out double x2) &&
                        double.TryParse(values[3], out double y2))
                    {
                        rect = new Rect(x1, y1, x2, y2);
                    }
                    else
                    {
                        rect = new Rect(0, 0, 0, 0); // Default rect if parsing fails
                    }

                    result.Add(new KeyValuePair<string, Rect>(key, rect));
                }
                else
                {
                    // Handle lines without a valid separator
                    result.Add(new KeyValuePair<string, Rect>(line.Trim(), new Rect(0, 0, 0, 0)));
                }
            }

            return result;
        }


        List<RiskAssessment> ProcessCombinedTextForRiskAssessment(
            string combinedText,
            string firstTwoLines,
            List<KeyValuePair<string, Rect>> linePositions)
        {
            var riskAssessmentsList = new List<RiskAssessment>();
            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string[] firstTwoLinesArray = firstTwoLines.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            var headerColumnBBoxes = new List<Rect>
        {
            new Rect(41, 0, 198, 0),   // Column 1: AssessmentArea
            new Rect(198, 0, 336, 0), // Column 2: WhatIsRisk
            new Rect(335, 0, 496, 0), // Column 3: WhatSupportMustLookLike
            new Rect(495, 0, 595, 0), // Column 4: RiskRequiresSupervision
            new Rect(594, 0, 658, 0),  // Column 5: WhoIsResponsible
        };

            for (int i = 0; i < lines.Length; i++)
            {
                // Get the current line's bbox
                var currentBBox = linePositions[i].Value;

                // Check for the start of the table (first header and bbox validation)
                if (lines[i].Contains(riskAssessmentHeaders[0]) &&
                    IsWithinBBox(currentBBox, headerColumnBBoxes[0]))
                {
                    // Validate subsequent headers
                    bool headersFound = true;
                    for (int j = 1; j < riskAssessmentHeaders.Count; j++)
                    {
                        if (i + j >= lines.Length ||
                            !lines[i + j].Contains(riskAssessmentHeaders[j]) ||
                            !IsWithinBBox(linePositions[i + j].Value, headerColumnBBoxes[j]))
                        {
                            headersFound = false;
                            break;
                        }
                    }

                    if (headersFound)
                    {
                        i += riskAssessmentHeaders.Count; // Move past headers

                        while (i < lines.Length)
                        {
                            var assessmentArea = lines[i].Trim();

                            // Check if the current line contains an assessment area within the first column bbox
                            if (!assessmentAreas.Contains(assessmentArea) ||
                                !IsWithinBBox(linePositions[i].Value, headerColumnBBoxes[0]))
                            {
                                // Before looking ahead for a valid assessment area,
                                // check if the current line fits in one of the header columns
                                if (riskAssessmentsList.Any())
                                {
                                    var lastRiskAssessment = riskAssessmentsList.Last();

                                    for (int columnIndex = 1; columnIndex < headerColumnBBoxes.Count; columnIndex++)
                                    {
                                        if (IsWithinBBox(linePositions[i].Value, headerColumnBBoxes[columnIndex]))
                                        {
                                            // Append the current line to the corresponding property
                                            switch (columnIndex)
                                            {
                                                case 1:
                                                    lastRiskAssessment.WhatIsRisk += " " + lines[i].Trim();
                                                    break;
                                                case 2:
                                                    lastRiskAssessment.WhatSupportMustLookLike += " " + lines[i].Trim();
                                                    break;
                                                case 3:
                                                    lastRiskAssessment.RiskRequiresSupervision += " " + lines[i].Trim();
                                                    break;
                                                case 4:
                                                    lastRiskAssessment.WhoIsResponsible += " " + lines[i].Trim();
                                                    break;
                                            }
                                            break;
                                        }
                                    }
                                }

                                // Look ahead to the next 5 lines for a valid assessment area
                                bool foundNextAssessmentArea = false;
                                for (int j = 1; j <= 5 && i + j < lines.Length; j++)
                                {
                                    var nextLine = lines[i + j].Trim();
                                    if (assessmentAreas.Contains(nextLine) &&
                                        IsWithinBBox(linePositions[i + j].Value, headerColumnBBoxes[0]))
                                    {
                                        // Found a valid assessment area; adjust index and continue
                                        i += j;
                                        assessmentArea = nextLine;
                                        foundNextAssessmentArea = true;
                                        break;
                                    }
                                }

                                if (!foundNextAssessmentArea)
                                {
                                    // Exit the method if no valid assessment area is found
                                    return riskAssessmentsList;
                                }
                            }

                            // Create a new RiskAssessment object
                            var riskAssessment = new RiskAssessment
                            {
                                AssessmentArea = assessmentArea,
                                WhatIsRisk = GetNextLineIfInColumn(lines, linePositions, ref i, headerColumnBBoxes[1]),
                                WhatSupportMustLookLike = GetNextLineIfInColumn(lines, linePositions, ref i, headerColumnBBoxes[2]),
                                RiskRequiresSupervision = GetNextLineIfInColumn(lines, linePositions, ref i, headerColumnBBoxes[3]),
                                WhoIsResponsible = GetNextLineIfInColumn(lines, linePositions, ref i, headerColumnBBoxes[4])
                            };

                            riskAssessmentsList.Add(riskAssessment);

                            // Check if the last values of the risk assessment are null, empty strings, or " " values
                            if (string.IsNullOrWhiteSpace(riskAssessment.WhatIsRisk) ||
                                string.IsNullOrWhiteSpace(riskAssessment.WhatSupportMustLookLike) ||
                                string.IsNullOrWhiteSpace(riskAssessment.RiskRequiresSupervision) ||
                                string.IsNullOrWhiteSpace(riskAssessment.WhoIsResponsible))
                            {
                                // If last cell was blank dont go to the next line and start next loop from current position
                                if (i >= lines.Length ||
                                !assessmentAreas.Contains(lines[i].Trim()) ||
                                !IsWithinBBox(linePositions[i].Value, headerColumnBBoxes[0]))
                                {
                                    break;
                                }
                                    continue;
                            }

                            // Move to the next line to check if it's the start of a new assessment area
                            i++;
                            if (i >= lines.Length ||
                                !assessmentAreas.Contains(lines[i].Trim()) ||
                                !IsWithinBBox(linePositions[i].Value, headerColumnBBoxes[0]))
                            {
                                i--; // Step back as the current line doesn't start a new assessment area
                                break;
                            }
                        }
                    }

                }
            }

            return riskAssessmentsList;
        }

        // Helper: Check if a line's bbox is within the expected column bbox
        bool IsWithinBBox(Rect lineBBox, Rect columnBBox)
        {
            if (lineBBox.x1 >= columnBBox.x1 &&
                   lineBBox.x2 <= columnBBox.x2)
            {
                return true;
            }
            else { return false; }
        }

        // Helper: Get the next line's text only if it falls within the specified column bbox
        string GetNextLineIfInColumn(string[] lines, List<KeyValuePair<string, Rect>> linePositions, ref int index, Rect columnBBox)
        {
            index++;
            if (index < lines.Length && IsWithinBBox(linePositions[index].Value, columnBBox))
            {
                return lines[index].Trim();
            }

            return ""; // Return empty if no valid line is found within the bbox
        }


        List<Experiences> ProcessCombinedTextForExperiences(string combinedText, string firstTwoLines, List<KeyValuePair<string, Rect>> linePositions)
        {
            var experiencesList = new List<Experiences>();
            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string[] firstTwoLinesArray = firstTwoLines.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            var headerColumnBBoxes = new List<Rect>
            {
                new Rect(41, 0, 228, 0),   // Column 1: WhatNeedsToHappen
                new Rect(227, 0, 419, 0),  // Column 2: HowItShouldHappen
                new Rect(418, 0, 557, 0),  // Column 3: WhoIsResponsible
                new Rect(556, 0, 647, 0),  // Column 4: WhenHowOften
            };

            for (int i = 0; i < lines.Length; i++)
            {
                // Check if we reached the end of the section
                if (lines[i].Trim() == "Outcome/Experiences Review: What will progress look like/How will we know it is happening?")
                {
                    break;
                }

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
                        while (i < lines.Length)
                        {
                            i += experienceHeaders.Count; // Move past the headers

                            // Check if we reached the end of the section
                            if (lines[i].Trim() == "Outcome/Experiences Review: What will progress look like/How will we know it is happening?")
                            {
                                break;
                            }

                            var experience = new Experiences
                            {
                                WhatNeedsToHappen = lines[i],
                                HowItShouldHappen = GetNextLine(lines, ref i),
                                WhoIsResponsible = GetNextLine(lines, ref i),
                                WhenHowOften = GetNextLine(lines, ref i),
                            };

                            experiencesList.Add(experience);

                            // Check for `firstTwoLinesArray`
                            bool firstTwoLinesMatch = true;
                            for (int j = 0; j < firstTwoLinesArray.Length; j++)
                            {
                                if ((i + 1) + j >= lines.Length || lines[(i + 1) + j].Trim() != firstTwoLinesArray[j].Trim())
                                {
                                    firstTwoLinesMatch = false;
                                    break;
                                }
                            }

                            if (firstTwoLinesMatch)
                            {
                                i += firstTwoLinesArray.Length; // Move past the matched lines

                                //// Check if the next line indicates starting from the beginning
                                //if (i < lines.Length && lines[i].Trim().Contains("Experiences: In order to accomplish the outcome, what experiences does the person need to have? What needs to happen"))
                                //{
                                //    // Restart the outer loop from the next line
                                //    i--;
                                //    break;
                                //}

                                // Check the next 4 lines for values fitting in the header column bounding boxes
                                for (int j = 0; j <= 4; j++)
                                {
                                    int nextIndex = i + j;
                                    if (nextIndex < lines.Length)
                                    {
                                        var currentBBox = linePositions[nextIndex].Value;
                                        for (int columnIndex = 0; columnIndex < headerColumnBBoxes.Count; columnIndex++)
                                        {
                                            if (IsWithinBBox(currentBBox, headerColumnBBoxes[columnIndex]) && currentBBox.y1 > 537)
                                            {
                                                switch (columnIndex)
                                                {
                                                    case 0:
                                                        experience.WhatNeedsToHappen += " " + lines[nextIndex].Trim();
                                                        break;
                                                    case 1:
                                                        experience.HowItShouldHappen += " " + lines[nextIndex].Trim();
                                                        break;
                                                    case 2:
                                                        experience.WhoIsResponsible += " " + lines[nextIndex].Trim();
                                                        break;
                                                    case 3:
                                                        experience.WhenHowOften += " " + lines[nextIndex].Trim();
                                                        break;
                                                }
                                            }
                                        }
                                    }
                                }

                                i += 2; // Adjust index to account for processed lines
                            }

                            // Move to the next line and continue
                            i++;
                            if (i >= lines.Length || !lines[i].Trim().Contains(experienceHeaders[0]))
                            {
                                i--; // Step back as the current line doesn't start a new experience
                                break;
                            }
                        }
                    }
                }
            }

            return experiencesList;
        }

        List<PaidSupports> ProcessCombinedTextForPaidSupports(
            string combinedText,
            string firstTwoLines,
            List<KeyValuePair<string, Rect>> linePositions)
        {
            var paidSupportsList = new List<PaidSupports>();
            string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string[] firstTwoLinesArray = firstTwoLines.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string providerName = string.Empty;

            var headerColumnBBoxes = new List<Rect>
            {
                new Rect(41, 0, 126, 0),   // Column 1: AssessmentArea
                new Rect(125, 0, 269, 0),  // Column 2: ServiceName
                new Rect(268, 0, 427, 0),  // Column 3: ScopeOfService
                new Rect(426, 0, 521, 0),  // Column 4: HowOftenHowMuch
                new Rect(520, 0, 598, 0),  // Column 5: BeginDateEndDate
                new Rect(597, 0, 700, 0)   // Column 6: FundingSource
            };

            for (int i = 0; i < lines.Length; i++)
            {
                if (lines[i].Contains(paidSupportsHeaders[0]))
                {
                    // Check for all headers
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
                        for (int k = i - 1; k >= (i - 20); k--)
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

                        i += paidSupportsHeaders.Count; // Move past headers

                        // Check for `firstTwoLinesArray`
                        bool firstTwoLinesMatch = true;
                        for (int j = 0; j < firstTwoLinesArray.Length; j++)
                        {
                            if (i + j >= lines.Length || lines[i + j].Trim() != firstTwoLinesArray[j].Trim())
                            {
                                firstTwoLinesMatch = false;
                                break;
                            }
                        }

                        if (firstTwoLinesMatch)
                        {
                            i += firstTwoLinesArray.Length + 2; // Skip over the matched lines
                        }

                        // Check for a valid assessment area if `firstTwoLinesArray` doesn't match
                        if (i < lines.Length && !assessmentAreas.Contains(lines[i].Trim()))
                        {
                            continue; // Skip if the next line isn't a valid assessment area
                        }

                        while (i < lines.Length)
                        {
                            var assessmentArea = lines[i].Trim();
                            if (!assessmentAreas.Contains(assessmentArea))
                            {
                                break;
                            }

                            var paidSupport = new PaidSupports
                            {
                                ProviderName = providerName,
                                AssessmentArea = assessmentArea,
                                ServiceName = string.Empty,
                                ScopeOfService = string.Empty,
                                HowOftenHowMuch = string.Empty,
                                BeginDateEndDate = string.Empty,
                                FundingSource = string.Empty
                            };

                            int processedLinesCount = 0;
                            for (int j = 0; j <= 6 && processedLinesCount < 6; j++)
                            {
                                int nextIndex = i + j;
                                if (nextIndex < lines.Length)
                                {
                                    var currentBBox = linePositions[nextIndex].Value;
                                    for (int columnIndex = 0; columnIndex < headerColumnBBoxes.Count; columnIndex++)
                                    {
                                        if (IsWithinBBox(currentBBox, headerColumnBBoxes[columnIndex]))
                                        {
                                            switch (columnIndex)
                                            {
                                                case 1:
                                                    paidSupport.ServiceName += " " + lines[nextIndex].Trim();
                                                    break;
                                                case 2:
                                                    paidSupport.ScopeOfService += " " + lines[nextIndex].Trim();
                                                    break;
                                                case 3:
                                                    paidSupport.HowOftenHowMuch += " " + lines[nextIndex].Trim();
                                                    break;
                                                case 4:
                                                    paidSupport.BeginDateEndDate += " " + lines[nextIndex].Trim();
                                                    break;
                                                case 5:
                                                    paidSupport.FundingSource += " " + lines[nextIndex].Trim();
                                                    break;
                                            }
                                            processedLinesCount++;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (processedLinesCount == 6)
                            {
                                processedLinesCount--;
                            }

                            i += processedLinesCount;
                            paidSupportsList.Add(paidSupport);

                            // Check for new assessment area
                            i++;

                            // New check for `firstTwoLinesArray` before proceeding
                            // New check for `firstTwoLinesArray` before proceeding
                            bool firstTwoLinesMatch2 = true;
                            for (int j = 0; j < firstTwoLinesArray.Length; j++)
                            {
                                if (i + j >= lines.Length || lines[i + j].Trim() != firstTwoLinesArray[j].Trim())
                                {
                                    firstTwoLinesMatch2 = false;
                                    break;
                                }
                            }

                            if (firstTwoLinesMatch2)
                            {
                                i += firstTwoLinesArray.Length + 2; // Skip over the matched lines
                            }

                            // Check for a valid assessment area or process subsequent lines if not found
                            if (i >= lines.Length || !assessmentAreas.Contains(lines[i].Trim()))
                            {
                                // Look ahead at the next 7 lines to find a valid assessment area within the bbox
                                bool foundAssessmentArea = false;
                                int nextAssessmentAreaIndex = -1;

                                for (int j = 1; j <= 7 && (i + j) < lines.Length; j++)
                                {
                                    if (assessmentAreas.Contains(lines[i + j].Trim()) &&
                                        IsWithinBBox(linePositions[i + j].Value, headerColumnBBoxes[0]))
                                    {
                                        foundAssessmentArea = true;
                                        nextAssessmentAreaIndex = i + j; // Capture the index of the valid assessment area
                                        break;
                                    }
                                }

                                if (foundAssessmentArea && nextAssessmentAreaIndex != -1)
                                {
                                    // Process all lines from the current position (`i`) to the assessment area
                                    for (int k = i; k < nextAssessmentAreaIndex; k++)
                                    {
                                        //string processedLine = GetNextLineIfInColumn(lines, linePositions, ref k, headerColumnBBoxes[0]);

                                        // Append the processed line to the corresponding column of the previous paid support
                                        if (paidSupportsList.Count > 0)
                                        {
                                            var lastPaidSupport = paidSupportsList.Last();
                                            for (int colIndex = 1; colIndex < headerColumnBBoxes.Count; colIndex++)
                                            {
                                                if (IsWithinBBox(linePositions[k].Value, headerColumnBBoxes[colIndex]))
                                                {
                                                    switch (colIndex)
                                                    {
                                                        case 1:
                                                            lastPaidSupport.ServiceName += " " + lines[k].Trim();
                                                            break;
                                                        case 2:
                                                            lastPaidSupport.ScopeOfService += " " + lines[k].Trim();
                                                            break;
                                                        case 3:
                                                            lastPaidSupport.HowOftenHowMuch += " " + lines[k].Trim();
                                                            break;
                                                        case 4:
                                                            lastPaidSupport.BeginDateEndDate += " " + lines[k].Trim();
                                                            break;
                                                        case 5:
                                                            lastPaidSupport.FundingSource += " " + lines[k].Trim();
                                                            break;
                                                    }
                                                    break; // Stop further checks for this line
                                                }
                                            }
                                        }
                                    }

                                    // Set `i` to the line containing the next assessment area and restart the loop
                                    i = nextAssessmentAreaIndex;
                                    continue; // Restart the loop from the updated position
                                }
                                else
                                {
                                    // If no valid assessment area is found, exit this loop
                                    i--;
                                    break;
                                }
                            }

                        }
                    }
                }
            }

            return paidSupportsList;
        }

        List<AdditionalSupports> ProcessCombinedTextForAdditionalSupports(
            string combinedText,
            string firstTwoLines,
            List<KeyValuePair<string, Rect>> linePositions)
        {
                var additionalSupportsList = new List<AdditionalSupports>();
                string[] lines = combinedText.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
                string[] firstTwoLinesArray = firstTwoLines.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

                var headerColumnBBoxes = new List<Rect>
                    {
                        new Rect(41, 0, 257, 0),   // Column 1: AssessmentArea
                        new Rect(258, 0, 393, 0),  // Column 2: WhoSupports
                        new Rect(392, 0, 620, 0),  // Column 3: WhatSupportLooksLike
                        new Rect(619, 0, 715, 0),  // Column 4: WhenHowOften
                    };

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
                                var assessmentArea = lines[i].Trim();
                                if (!assessmentAreas.Contains(assessmentArea))
                                {
                                    break;
                                }

                                var additionalSupport = new AdditionalSupports
                                {
                                    AssessmentArea = assessmentArea,
                                    WhoSupports = GetNextLine(lines, ref i),
                                    WhatSupportLooksLike = GetNextLine(lines, ref i),
                                    WhenHowOften = GetNextLine(lines, ref i),
                                };

                                // Check for `firstTwoLinesArray`
                                bool firstTwoLinesMatch = true;
                                for (int j = 0; j < firstTwoLinesArray.Length; j++)
                                {
                                    if ((i + 1) + j >= lines.Length || lines[(i + 1) + j].Trim() != firstTwoLinesArray[j].Trim())
                                    {
                                        firstTwoLinesMatch = false;
                                        break;
                                    }
                                }

                                if (firstTwoLinesMatch)
                                {
                                    i += firstTwoLinesArray.Length; // Move past the matched lines

                                    // Check the next 4 lines for values fitting in the header column bounding boxes
                                    for (int j =2; j < 4; j++)
                                    {
                                        int nextIndex = i + j;
                                        if (nextIndex < lines.Length)
                                        {
                                            var currentBBox = linePositions[nextIndex].Value;
                                            for (int columnIndex = 0; columnIndex < headerColumnBBoxes.Count; columnIndex++)
                                            {
                                                if (IsWithinBBox(currentBBox, headerColumnBBoxes[columnIndex]))
                                                {
                                                    switch (columnIndex)
                                                    {
                                                        case 0:
                                                            additionalSupport.AssessmentArea += " " + lines[nextIndex].Trim();
                                                            break;
                                                        case 1:
                                                            additionalSupport.WhoSupports += " " + lines[nextIndex].Trim();
                                                            break;
                                                        case 2:
                                                            additionalSupport.WhatSupportLooksLike += " " + lines[nextIndex].Trim();
                                                            break;
                                                        case 3:
                                                            additionalSupport.WhenHowOften += " " + lines[nextIndex].Trim();
                                                            break;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // Adjust `i` to the last processed line
                                    i += 3; // Move past the lines appended to the additional support
                                }

                                additionalSupportsList.Add(additionalSupport);

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
                                objectiveStatement = importedTable.whatSupportMustLookLike ?? "";
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
                                objectiveRecurrance = (importedTable.howOftenText ?? "").Contains("Daily") ? "D" :
                                                      (importedTable.howOftenText ?? "").Contains("Weekly") ? "W" :
                                                      (importedTable.howOftenText ?? "").Contains("Monthly") ? "M" : null;
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

        private string ValidateAndTrimAssessmentArea(string input)
        {
            foreach (string area in assessmentAreas)
            {
                if (input.Contains(area))
                {
                    return area; // Return the matched value from the list
                }
            }
            return null; // Return null if no match is found
        }


    }
}
