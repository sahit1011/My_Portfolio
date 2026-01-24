// Gemini API integration
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logToFile, createAnalysisLogFile } from './logger';
import {
  getPersonalInfo,
  getExperiences,
  getEducation,
  getSkills,
  getProjects,
  getResumeInfo,
  Project
} from './content';

// OpenRouter API integration - moved to server-side API route
// These constants are no longer used as we call /api/analyze-resume instead

// Initialize the Gemini API with your API key
const getGeminiAPI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("Gemini API key is not set. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.");
    return null;
  }

  return new GoogleGenerativeAI(apiKey);
};

// Function to generate comprehensive resume content from portfolio data
function generateResumeContent(): string {
   const personalInfo = getPersonalInfo();
   const experiences = getExperiences();
   const education = getEducation();
   const projects = getProjects();

  let resumeContent = `${personalInfo.name}\n`;
  resumeContent += `${personalInfo.titles.join(' | ')}\n\n`;

  // Add detailed skills from content.json
  const allSkills = getSkills();
  resumeContent += '\nDETAILED TECHNICAL SKILLS:\n';
  Object.entries(allSkills).forEach(([category, skillList]) => {
    const skillNames = skillList.map(s => s.name).join(', ');
    resumeContent += `- ${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${skillNames}\n`;
  });
  resumeContent += '\n';

  // Experience section
  resumeContent += 'EXPERIENCE:\n';
  experiences.forEach(exp => {
    resumeContent += `${exp.title} | ${exp.company}\n`;
    resumeContent += `${exp.period}\n`;
    exp.description.forEach(desc => {
      resumeContent += `- ${desc}\n`;
    });
    resumeContent += `Skills: ${exp.skills.join(', ')}\n\n`;
  });

  // Education section
  resumeContent += 'EDUCATION:\n';
  education.forEach(edu => {
    resumeContent += `${edu.degree}\n`;
    resumeContent += `${edu.institution} | ${edu.location}\n`;
    if (edu.gpa) resumeContent += `GPA: ${edu.gpa}\n`;
    resumeContent += '\n';
  });

  // Projects section
  resumeContent += 'PROJECTS:\n';
  projects.forEach(project => {
    resumeContent += `${project.title}\n`;
    project.description.forEach(desc => {
      resumeContent += `- ${desc}\n`;
    });
    resumeContent += `Technologies: ${project.technologies.join(', ')}\n`;
    if (project.github && project.github !== '#') {
      resumeContent += `GitHub: ${project.github}\n`;
    }
    resumeContent += '\n';
  });

  return resumeContent;
}

// Define the resume content
const resumeContent = generateResumeContent();

// Function to create the analysis prompt
// Function to validate if text is a job description
function isValidJobDescription(text: string): { isValid: boolean; reason?: string } {
  if (!text || text.trim().length < 50) {
    return { isValid: false, reason: 'Job description is too short or empty' };
  }

  // Check for resume indicators (should NOT be present in a job description)
  const resumeIndicators = [
    'portfolio:', 'linkedin:', 'github:', 'professional summary',
    'anilsahithvallepu@gmail.com', 'sahit1011', 'anil-sahith',
    'vallepu anil sahith', 'resume', 'cv', 'curriculum vitae',
    'software engineer | ai/ml engineer', 'nit warangal', 'matters.ai',
    'noccarc robotics', 'carelon global solutions'
  ];
  
  const textLower = text.toLowerCase();
  const hasResumeIndicators = resumeIndicators.some(indicator => 
    textLower.includes(indicator.toLowerCase())
  );
  
  if (hasResumeIndicators) {
    return { isValid: false, reason: 'The provided text appears to be a resume, not a job description' };
  }

  // Check for job description indicators (should be present)
  const jobDescriptionIndicators = [
    'job description', 'job requirements', 'qualifications', 'responsibilities',
    'we are looking for', 'required skills', 'must have', 'nice to have',
    'position:', 'role:', 'apply', 'candidate should', 'the ideal candidate',
    'about the role', 'what you\'ll do', 'what we need', 'requirements:'
  ];
  
  const hasJobIndicators = jobDescriptionIndicators.some(indicator => 
    textLower.includes(indicator.toLowerCase())
  );
  
  if (!hasJobIndicators && text.length < 200) {
    // If it's short and has no job indicators, it might not be a valid JD
    return { isValid: false, reason: 'The text does not appear to be a valid job description. Please provide a complete job posting with requirements and responsibilities.' };
  }

  return { isValid: true };
}

function createAnalysisPrompt(jobDescription: string): string {
  const personalInfo = getPersonalInfo();
  const experiences = getExperiences();
  const projects = getProjects();

  // Create a comprehensive context about the candidate
  const candidateContext = `
CANDIDATE PROFILE:
Name: ${personalInfo.name}
Titles: ${personalInfo.titles.join(', ')}
Location: ${personalInfo.location}
Email: ${personalInfo.email}

PROFESSIONAL SUMMARY:
${getResumeInfo().summary}

KEY EXPERIENCES:
${experiences.map(exp => `- ${exp.title} at ${exp.company} (${exp.period}): ${exp.description.join(' ')}`).join('\n')}

NOTABLE PROJECTS:
${projects.slice(0, 5).map(proj => `- ${proj.title}: ${proj.description.join(' ')} (Tech: ${proj.technologies.join(', ')})`).join('\n')}

FULL RESUME DETAILS:
${resumeContent}

CANDIDATE PREFERENCES:
- Work Arrangement: Prefers remote/hybrid work arrangements. Open to on-site work only in Bangalore or Hyderabad.
- Location Flexibility: Based in India, prefers work-from-home or hybrid setups for optimal work-life balance.
- Experience Level: 1+ years through internships and freelance projects.
`;

  return `
    You are an expert AI recruiter specializing in technical roles. You have access to a comprehensive candidate profile including their real work experience, projects, and skills.

    IMPORTANT VALIDATION: Before proceeding with analysis, verify that the JOB DESCRIPTION section below contains a valid job posting with requirements, responsibilities, and qualifications. If it appears to be a resume, candidate profile, or invalid content, you MUST return an error response instead of analysis.

    CANDIDATE CONTEXT:
    ${candidateContext}

    JOB DESCRIPTION:
    ${jobDescription}

    VALIDATION CHECK: First, verify the job description is valid:
    - Does it contain job requirements, responsibilities, or qualifications?
    - Is it clearly a job posting and NOT a resume or candidate profile?
    - Is it substantial enough (at least 100+ characters of meaningful content)?
    
    If the job description is INVALID, return this JSON format:
    {
      "error": true,
      "errorMessage": "The provided text does not appear to be a valid job description. Please provide a complete job posting with requirements and responsibilities.",
      "suggestion": "Please copy and paste the full job description from the job posting, including requirements, responsibilities, and qualifications."
    }

    If the job description is VALID, proceed with the analysis task below.

    TASK: Analyze how well this candidate matches the job description using the weighted scoring framework below.

    ANALYSIS FRAMEWORK (Weights):
    - TECHNICAL SKILLS MATCH (40%): Average match percentage across all job-required skills found in candidate's profile
    - EXPERIENCE LEVEL MATCH (25%): Alignment between candidate's 1+ years experience and job requirements
    - LOCATION & WORK PREFERENCE MATCH (20%): How well job arrangements match candidate preferences
    - PROJECT PORTFOLIO RELEVANCE (10%): How well projects demonstrate required skills
    - CULTURAL/ROLE FIT (5%): Overall alignment with role expectations

    SCORING GUIDELINES:
    Experience Level Matching (candidate has 1+ years from internships/freelance):
    - Junior roles (0-1 years required): 85-100% match
    - Mid-level roles (1-3 years required): 60-80% match
    - Senior roles (4+ years required): 40-60% match
    - If JD emphasizes potential over experience: 90-100% match

    Work Arrangement Matching:
    - Remote/hybrid jobs: 90-100% match (+bonus)
    - On-site in Bangalore/Hyderabad: 70-85% match
    - On-site outside preferred locations: 30-50% match (-penalty)
    - Unclear location requirements: 70% default match

    ANALYSIS REQUIREMENTS:
    1. Extract all technical skills, tools, and technologies from the job description
    2. Determine experience level requirements from JD (junior/mid/senior or years specified)
    3. Analyze work arrangement preferences (remote/hybrid/on-site) and location requirements
    4. For each extracted skill, evaluate match percentage based on candidate's actual experience/projects
    5. Calculate weighted overall match score
    6. Include warnings only for significant mismatches:
       - Experience mismatch: Only if JD requires 3+ years OR candidate experience match <= 80%
       - Work preference mismatch: Only if job requires on-site outside Bangalore/Hyderabad
    7. Select 2-4 most relevant project IDs that demonstrate required skills

    Return your analysis in the following JSON format without any markdown formatting or explanations:
    {
      "overallMatch": number between 0-100,
      "matchBreakdown": {
        "technicalSkills": number between 0-100,
        "experienceLevel": number between 0-100,
        "locationPreference": number between 0-100,
        "projectRelevance": number between 0-100
      },
      "warnings": [
        "Specific warnings only for significant mismatches"
      ],
      "skillsMatch": [
        {
          "skill": "skill name from job description",
          "match": number between 0-100,
          "required": boolean
        }
      ],
      "missingSkills": ["skills required by job but absent from candidate profile"],
      "candidateSummary": "2-3 sentence factual summary of candidate's skills and experience",
      "recommendedProjectIds": [1, 2, 3]
    }

    IMPORTANT: Base analysis strictly on candidate's documented 1+ years experience. Return ONLY the JSON object.
  `;
}

// Function to call OpenRouter API as fallback (via server-side API route)
async function callOpenRouterAPI(prompt: string, logFilename: string): Promise<string> {
  const openRouterMessage = "🔄🔄🔄 FALLING BACK TO OPENROUTER API 🔄🔄🔄";
  console.log("\n" + openRouterMessage);
  await logToFile(openRouterMessage, logFilename);

  try {
    // Call our server-side API route instead of calling OpenRouter directly
    const response = await fetch('/api/analyze-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorData.error || errorData.details || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.text;

    if (!text) {
      throw new Error("No response content from OpenRouter API");
    }

    const successMessage = "✅ Received response from OpenRouter API";
    console.log(successMessage);
    await logToFile(successMessage, logFilename);

    return text;
  } catch (error) {
    const errorMessage = `❌ OpenRouter API call failed: ${error}`;
    console.error(errorMessage);
    await logToFile(errorMessage, logFilename);
    throw error;
  }
}

// Function to fix truncated JSON by closing open structures
function fixTruncatedJSON(jsonString: string): string {
  let fixed = jsonString.trim();
  
  // Count open/close braces and brackets
  const openBraces = (fixed.match(/\{/g) || []).length;
  let closeBraces = (fixed.match(/\}/g) || []).length;
  const openBrackets = (fixed.match(/\[/g) || []).length;
  let closeBrackets = (fixed.match(/\]/g) || []).length;
  
  // If we're in the middle of a string, try to close it
  // Check if the last non-whitespace character is inside quotes
  const lastChar = fixed.trim().slice(-1);
  if (lastChar !== '"' && lastChar !== '}' && lastChar !== ']') {
    // We might be in the middle of a string or value
    // If we're in an array and the last thing is an object, close it
    const lastOpenBrace = fixed.lastIndexOf('{');
    const lastOpenBracket = fixed.lastIndexOf('[');
    
    if (lastOpenBrace > lastOpenBracket && openBraces > closeBraces) {
      // Remove any trailing incomplete content after last complete object
      const lastCompleteObject = fixed.lastIndexOf('}');
      if (lastCompleteObject > 0) {
        fixed = fixed.substring(0, lastCompleteObject + 1);
      }
    }
  }
  
  // Close any open arrays
  while (openBrackets > closeBrackets) {
    fixed += ']';
    closeBrackets++;
  }
  
  // Close any open objects
  while (openBraces > closeBraces) {
    fixed += '}';
    closeBraces++;
  }
  
  return fixed;
}

// Function to clean and parse LLM response with truncation handling
function cleanAndParseResponse(text: string): ResumeAnalysisResult {
  let cleanText = text;

  // Remove markdown code block formatting if present
  if (text.includes('```json')) {
    cleanText = text.replace(/```json\n|```/g, '');
  } else if (text.includes('```')) {
    cleanText = text.replace(/```\n|```/g, '');
  }

  // Remove any other markdown formatting or text before/after the JSON
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanText = jsonMatch[0];
  }

  // Try to parse the JSON
  try {
    return JSON.parse(cleanText) as ResumeAnalysisResult;
  } catch (error: unknown) {
    // If parsing fails, try to fix truncated JSON
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
    console.warn('Initial JSON parse failed, attempting to fix truncated JSON:', errorMessage);
    
    try {
      const fixedJson = fixTruncatedJSON(cleanText);
      const parsed = JSON.parse(fixedJson) as ResumeAnalysisResult;
      
      // Validate and fill in missing required fields
      if (!parsed.overallMatch) parsed.overallMatch = 70;
      if (!parsed.matchBreakdown) {
        parsed.matchBreakdown = {
          technicalSkills: 70,
          experienceLevel: 70,
          locationPreference: 70,
          projectRelevance: 70
        };
      }
      if (!parsed.warnings) parsed.warnings = [];
      if (!parsed.skillsMatch) parsed.skillsMatch = [];
      if (!parsed.missingSkills) parsed.missingSkills = [];
      if (!parsed.candidateSummary) parsed.candidateSummary = "Analysis completed with partial data.";
      if (!parsed.recommendedProjects) parsed.recommendedProjects = [];
      
      console.log('Successfully parsed fixed/truncated JSON');
      return parsed;
    } catch (fixError: unknown) {
      // If fixing also fails, try to extract partial data
      const fixErrorMessage = fixError instanceof Error ? fixError.message : 'Unknown error';
      console.error('Failed to fix truncated JSON:', fixErrorMessage);
      
      // Try to extract at least the overall match and basic structure
      const overallMatchMatch = cleanText.match(/"overallMatch"\s*:\s*(\d+)/);
      const overallMatch = overallMatchMatch ? parseInt(overallMatchMatch[1]) : 70;
      
      // Extract skills match array (even if incomplete)
      const skillsMatchStart = cleanText.indexOf('"skillsMatch"');
      const skillsMatch: SkillMatch[] = [];
      if (skillsMatchStart > 0) {
        const skillsArrayStart = cleanText.indexOf('[', skillsMatchStart);
        if (skillsArrayStart > 0) {
          // Try to extract complete skill objects
          const skillPattern = /\{\s*"skill"\s*:\s*"([^"]+)"\s*,\s*"match"\s*:\s*(\d+)\s*,\s*"required"\s*:\s*(true|false)\s*\}/g;
          let match;
          while ((match = skillPattern.exec(cleanText)) !== null) {
            skillsMatch.push({
              skill: match[1],
              match: parseInt(match[2]),
              required: match[3] === 'true'
            });
          }
        }
      }
      
      // Return partial result
      return {
        overallMatch,
        matchBreakdown: {
          technicalSkills: 70,
          experienceLevel: 70,
          locationPreference: 70,
          projectRelevance: 70
        },
        warnings: ['Response was truncated, showing partial analysis'],
        skillsMatch,
        missingSkills: [],
        candidateSummary: "Analysis completed with partial data due to response truncation.",
        recommendedProjects: []
      };
    }
  }
}

interface SkillMatch {
  skill: string;
  match: number;
  required: boolean;
}


interface MatchBreakdown {
  technicalSkills: number;
  experienceLevel: number;
  locationPreference: number;
  projectRelevance: number;
}

interface ResumeAnalysisResult {
  overallMatch: number;
  matchBreakdown: MatchBreakdown;
  warnings: string[];
  skillsMatch: SkillMatch[];
  missingSkills: string[];
  candidateSummary: string;
  recommendedProjects: Project[];
  recommendedProjectIds?: number[];
  error?: boolean;
  errorMessage?: string;
  suggestion?: string;
}

export async function analyzeJobDescription(jobDescription: string): Promise<ResumeAnalysisResult> {
  const logFilename = await createAnalysisLogFile();

  const startMessage = "🔍🔍🔍 STARTING JOB DESCRIPTION ANALYSIS 🔍🔍🔍";
  console.log("\n\n" + startMessage);
  await logToFile(startMessage, logFilename);

  // Validate that we have actual job description content, not an error message
  if (!jobDescription || jobDescription.trim().length < 50) {
    const errorMsg = "❌ Job description is too short or empty";
    console.error(errorMsg);
    await logToFile(errorMsg, logFilename);
    throw new Error("Job description is too short or empty. Please provide a complete job description.");
  }

  // Check if the job description is actually an error message from file extraction
  if (jobDescription.includes('[File content could not be automatically extracted')) {
    const errorMsg = "❌ Job description appears to be an error message, not actual content";
    console.error(errorMsg);
    await logToFile(errorMsg, logFilename);
    throw new Error("Failed to extract job description. Please copy and paste the job description text directly.");
  }

  // Validate job description using our validation function
  const validation = isValidJobDescription(jobDescription);
  if (!validation.isValid) {
    const errorMsg = `❌ Job description validation failed: ${validation.reason}`;
    console.error(errorMsg);
    await logToFile(errorMsg, logFilename);
    throw new Error(validation.reason || "Invalid job description. Please provide a complete job posting with requirements and responsibilities.");
  }

  const lengthMessage = `Job description length: ${jobDescription.length} characters`;
  console.log(lengthMessage);
  await logToFile(lengthMessage, logFilename);
  
  // Log first 200 characters of job description for debugging
  const previewMessage = `Job description preview: ${jobDescription.substring(0, 200)}...`;
  console.log(previewMessage);
  await logToFile(previewMessage, logFilename);

  // Create the prompt once
  const prompt = createAnalysisPrompt(jobDescription);

  // Log the full resume context being sent to LLM
  const resumeContextMessage = "📄📄📄 FULL RESUME CONTEXT BEING SENT TO LLM 📄📄📄";
  console.log("\n\n" + resumeContextMessage);
  await logToFile(resumeContextMessage, logFilename);
  console.log("==================================================");
  console.log(resumeContent);
  await logToFile(resumeContent, logFilename);
  console.log("==================================================");
  console.log("📄📄📄 END RESUME CONTEXT 📄📄📄\n\n");

  // Log the complete prompt being sent to LLM
  const promptLogMessage = "🤖🤖🤖 COMPLETE PROMPT BEING SENT TO LLM 🤖🤖🤖";
  console.log("\n\n" + promptLogMessage);
  await logToFile(promptLogMessage, logFilename);
  console.log("==================================================");
  console.log(prompt);
  await logToFile(prompt, logFilename);
  console.log("==================================================");
  console.log("🤖🤖🤖 END COMPLETE PROMPT 🤖🤖🤖\n\n");

  // Get the Gemini API instance
  const genAI = getGeminiAPI();

  // Try Gemini API first
  if (genAI) {
    const apiKeyFoundMessage = "✅ Gemini API key found, attempting Gemini API call";
    console.log(apiKeyFoundMessage);
    await logToFile(apiKeyFoundMessage, logFilename);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const sendingPromptMessage = "🚀 Sending prompt to Gemini API...";
      console.log("\n" + sendingPromptMessage);
      await logToFile(sendingPromptMessage, logFilename);

      const result = await model.generateContent(prompt);

      const receivedResponseMessage = "✅ Received response from Gemini API";
      console.log(receivedResponseMessage);
      await logToFile(receivedResponseMessage, logFilename);

      const response = result.response;
      const text = response.text();

      const rawResponseStartMessage = "🤖🤖🤖 RAW GEMINI RESPONSE START 🤖🤖🤖";
      console.log("\n\n" + rawResponseStartMessage);
      await logToFile(rawResponseStartMessage, logFilename);
      console.log("==================================================");
      console.log(text);
      await logToFile(text, logFilename);
      console.log("==================================================");
      console.log("🤖🤖🤖 RAW GEMINI RESPONSE END 🤖🤖🤖\n\n");

      try {
        const jsonResponse = cleanAndParseResponse(text);
        
        // Check if LLM returned an error response
        if (jsonResponse.error === true) {
          const errorMsg = `❌ LLM validation error: ${jsonResponse.errorMessage || 'Invalid job description'}`;
          console.error(errorMsg);
          await logToFile(errorMsg, logFilename);
          throw new Error(jsonResponse.errorMessage || 'The provided text does not appear to be a valid job description. Please provide a complete job posting with requirements and responsibilities.');
        }
        
        const parsedMessage = "✅ Successfully parsed Gemini JSON response";
        console.log(parsedMessage);
        await logToFile(parsedMessage, logFilename);

        const extractedSkills = extractSkillsFromJobDescription(jobDescription);
        const allProjects = getProjects();

        // Use LLM-recommended projects if available, otherwise fall back to skill-based matching
        let recommendedProjects: Project[] = [];
        if (jsonResponse.recommendedProjectIds && jsonResponse.recommendedProjectIds.length > 0) {
          const foundProjects = jsonResponse.recommendedProjectIds
            .map((id: number) => allProjects.find((p: Project) => p.id === id))
            .filter((p): p is Project => p !== undefined) as Project[];
          recommendedProjects = foundProjects;
        } else {
          recommendedProjects = findRecommendedProjects(extractedSkills);
        }

        const result = {
          overallMatch: jsonResponse.overallMatch || 70,
          matchBreakdown: jsonResponse.matchBreakdown || {
            technicalSkills: 70,
            experienceLevel: 70,
            locationPreference: 70,
            projectRelevance: 70
          },
          warnings: jsonResponse.warnings || [],
          skillsMatch: jsonResponse.skillsMatch || [],
          missingSkills: jsonResponse.missingSkills || [],
          candidateSummary: jsonResponse.candidateSummary || "Anil Sahith appears to be a strong match for this position.",
          recommendedProjects
        };

        console.log("🎉 Gemini analysis complete! Returning results.");
        await logToFile(`🎉 Analysis complete! Results: ${JSON.stringify(result, null, 2)}`, logFilename);

        return result;
      } catch (parseError) {
        const parseErrorMessage = `⚠️ Failed to parse Gemini response: ${parseError}`;
        console.warn(parseErrorMessage);
        await logToFile(parseErrorMessage, logFilename);
        // Continue to OpenRouter fallback
      }
    } catch (error) {
      const geminiErrorMessage = `⚠️ Gemini API error: ${error}`;
      console.warn(geminiErrorMessage);
      await logToFile(geminiErrorMessage, logFilename);
      // Continue to OpenRouter fallback
    }
  } else {
    const noGeminiKeyMessage = "⚠️ No Gemini API key found";
    console.log(noGeminiKeyMessage);
    await logToFile(noGeminiKeyMessage, logFilename);
  }

  // Try OpenRouter as fallback
  try {
    const openRouterFallbackMessage = "🔄 Attempting OpenRouter fallback...";
    console.log(openRouterFallbackMessage);
    await logToFile(openRouterFallbackMessage, logFilename);

    const openRouterText = await callOpenRouterAPI(prompt, logFilename);

    const rawResponseStartMessage = "🤖🤖🤖 RAW OPENROUTER RESPONSE START 🤖🤖🤖";
    console.log("\n\n" + rawResponseStartMessage);
    await logToFile(rawResponseStartMessage, logFilename);
    console.log("==================================================");
    console.log(openRouterText);
    await logToFile(openRouterText, logFilename);
    console.log("==================================================");
    console.log("🤖🤖🤖 RAW OPENROUTER RESPONSE END 🤖🤖🤖\n\n");

    try {
      const jsonResponse = cleanAndParseResponse(openRouterText);
      
      // Check if LLM returned an error response
      if (jsonResponse.error === true) {
        const errorMsg = `❌ LLM validation error: ${jsonResponse.errorMessage || 'Invalid job description'}`;
        console.error(errorMsg);
        await logToFile(errorMsg, logFilename);
        throw new Error(jsonResponse.errorMessage || 'The provided text does not appear to be a valid job description. Please provide a complete job posting with requirements and responsibilities.');
      }
      
      const parsedMessage = jsonResponse.warnings?.includes('Response was truncated') 
        ? "✅ Successfully parsed OpenRouter JSON response (recovered from truncation)"
        : "✅ Successfully parsed OpenRouter JSON response";
      console.log(parsedMessage);
      await logToFile(parsedMessage, logFilename);
      
      if (jsonResponse.warnings?.includes('Response was truncated')) {
        const truncationWarning = "⚠️ Note: Response was truncated but partial data was successfully extracted";
        console.warn(truncationWarning);
        await logToFile(truncationWarning, logFilename);
      }

      const extractedSkills = extractSkillsFromJobDescription(jobDescription);
      const allProjects = getProjects();

      // Use LLM-recommended projects if available, otherwise fall back to skill-based matching
      let recommendedProjects: Project[] = [];
      if (jsonResponse.recommendedProjectIds && jsonResponse.recommendedProjectIds.length > 0) {
        const foundProjects = jsonResponse.recommendedProjectIds
          .map((id: number) => allProjects.find((p: Project) => p.id === id))
          .filter((p: Project | undefined): p is Project => p !== undefined);
        recommendedProjects = foundProjects;
      } else {
        recommendedProjects = findRecommendedProjects(extractedSkills);
      }

      const result = {
        overallMatch: jsonResponse.overallMatch || 70,
        matchBreakdown: jsonResponse.matchBreakdown || {
          technicalSkills: 70,
          experienceLevel: 70,
          locationPreference: 70,
          projectRelevance: 70
        },
        warnings: jsonResponse.warnings || [],
        skillsMatch: jsonResponse.skillsMatch || [],
        missingSkills: jsonResponse.missingSkills || [],
        candidateSummary: jsonResponse.candidateSummary || "Anil Sahith appears to be a strong match for this position.",
        recommendedProjects
      };

      console.log("🎉 OpenRouter analysis complete! Returning results.");
      await logToFile(`🎉 OpenRouter analysis complete! Results: ${JSON.stringify(result, null, 2)}`, logFilename);

      return result;
    } catch (parseError) {
      const parseErrorMessage = `⚠️ Failed to parse OpenRouter response: ${parseError}`;
      console.warn(parseErrorMessage);
      await logToFile(parseErrorMessage, logFilename);
      // Continue to simulated response
    }
  } catch (openRouterError) {
    const openRouterErrorMessage = `⚠️ OpenRouter fallback failed: ${openRouterError}`;
    console.warn(openRouterErrorMessage);
    await logToFile(openRouterErrorMessage, logFilename);
    // Continue to simulated response
  }

  // Final fallback: simulated response
  const fallbackMessage = "⚠️ All API methods failed, using simulated response";
  console.log(fallbackMessage);
  await logToFile(fallbackMessage, logFilename);
  return getSimulatedResponse(jobDescription, logFilename);
}

// Fallback function to get a simulated response
async function getSimulatedResponse(jobDescription: string, logFilename: string): Promise<ResumeAnalysisResult> {
  const simulatedResponseMessage = "💻💻💻 GENERATING SIMULATED RESPONSE 💻💻💻";
  console.log("\n\n" + simulatedResponseMessage);
  await logToFile(simulatedResponseMessage, logFilename);

  const skills = extractSkillsFromJobDescription(jobDescription);
  const extractedSkillsMessage = `🔍 Extracted skills: ${JSON.stringify(skills)}`;
  console.log(extractedSkillsMessage);
  await logToFile(extractedSkillsMessage, logFilename);

  const recommendedProjects = findRecommendedProjects(skills);

  const result = {
    overallMatch: Math.floor(Math.random() * 30) + 65,
    matchBreakdown: {
      technicalSkills: Math.floor(Math.random() * 40) + 60,
      experienceLevel: Math.floor(Math.random() * 40) + 60,
      locationPreference: Math.floor(Math.random() * 40) + 60,
      projectRelevance: Math.floor(Math.random() * 40) + 60
    },
    warnings: [],
    skillsMatch: skills.map(skill => ({
      skill,
      match: Math.floor(Math.random() * 40) + 60,
      required: Math.random() > 0.5,
    })),
    missingSkills: ['GraphQL', 'Kubernetes', 'Swift', 'Kotlin', 'Rust']
      .filter(() => Math.random() > 0.6),
    candidateSummary: `Anil Sahith demonstrates strong expertise in ${skills.slice(0, 3).join(', ')} and other technologies relevant to this position. With a background in both software engineering and AI/ML, he brings a versatile skill set that would be valuable for this role.`,
    recommendedProjects
  };

  console.log("🎉 Simulated response generated successfully!");
  await logToFile(`💻 SIMULATED RESPONSE: ${JSON.stringify(result, null, 2)}`, logFilename);

  return result;
}

function extractSkillsFromJobDescription(jobDescription: string): string[] {
  const commonSkills = [
    'React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'Node.js',
    'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
    'Git', 'REST API', 'GraphQL', 'Microservices', 'DevOps',
    'Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'NLP',
    'Data Science', 'Data Analysis', 'Pandas', 'NumPy', 'Scikit-learn',
    'Next.js', 'Express', 'Django', 'Flask', 'Spring Boot',
    'Redux', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'SASS',
    'Blockchain', 'Smart Contracts', 'Solidity', 'Web3.js', 'Ethereum',
    'Mobile Development', 'React Native', 'Flutter', 'iOS', 'Android',
    'Testing', 'Jest', 'Mocha', 'Cypress', 'Selenium',
    'Agile', 'Scrum', 'Kanban', 'Project Management', 'JIRA'
  ];

  const foundSkills = commonSkills.filter(skill =>
    jobDescription.toLowerCase().includes(skill.toLowerCase())
  );

  if (foundSkills.length === 0) {
    return ['React', 'JavaScript', 'Node.js', 'MongoDB', 'AWS'];
  }

  return foundSkills;
}

function findRecommendedProjects(jobSkills: string[]): Project[] {
  const projects = getProjects();

  const projectsWithScores = projects.map(project => {
    const projectSkills = project.technologies || [];
    const matchingSkills = projectSkills.filter(skill =>
      jobSkills.some(jobSkill =>
        jobSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    const relevanceScore = matchingSkills.length > 0
      ? (matchingSkills.length / projectSkills.length) * 100
      : 0;

    return {
      ...project,
      relevanceScore
    };
  });

  const sortedProjects = projectsWithScores
    .filter(project => project.relevanceScore > 0)
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  return sortedProjects.slice(0, 3);
}

