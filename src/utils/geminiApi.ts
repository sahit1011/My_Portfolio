// Gemini API integration
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logToFile, createAnalysisLogFile } from './logger';
import projectsData from '@/data/projects.json';

// Initialize the Gemini API with your API key
const getGeminiAPI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Gemini API key is not set. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.");
    return null;
  }

  return new GoogleGenerativeAI(apiKey);
};

interface SkillMatch {
  skill: string;
  match: number;
  required: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  skills: string[];
  image: string;
  link: string;
  github: string;
  relevanceScore?: number;
}

interface ResumeAnalysisResult {
  overallMatch: number;
  skillsMatch: SkillMatch[];
  missingSkills: string[];
  candidateSummary: string;
  recommendedProjects: Project[];
}

export async function analyzeJobDescription(jobDescription: string): Promise<ResumeAnalysisResult> {
  // Create a new log file for this analysis session
  const logFilename = await createAnalysisLogFile();

  // Log the start of the analysis
  const startMessage = "🔍🔍🔍 STARTING JOB DESCRIPTION ANALYSIS 🔍🔍🔍";
  console.log("\n\n" + startMessage);
  await logToFile(startMessage, logFilename);

  const lengthMessage = `Job description length: ${jobDescription.length} characters`;
  console.log(lengthMessage);
  await logToFile(lengthMessage, logFilename);

  // Get the Gemini API instance
  const genAI = getGeminiAPI();

  // If API key is not set, fall back to simulated response
  if (!genAI) {
    const noApiKeyMessage = "⚠️⚠️⚠️ NO API KEY FOUND - USING SIMULATED RESPONSE ⚠️⚠️⚠️";
    console.log(noApiKeyMessage);
    await logToFile(noApiKeyMessage, logFilename);
    return getSimulatedResponse(jobDescription, logFilename);
  }

  const apiKeyFoundMessage = "✅ API key found, proceeding with Gemini API call";
  console.log(apiKeyFoundMessage);
  await logToFile(apiKeyFoundMessage, logFilename);

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Define the resume content (this would be your actual resume)
    const resumeContent = `
      VALLEPU ANIL SAHITH
      Software Engineer | AI/ML Engineer | Data Scientist

      SKILLS:
      - Languages: Python, JavaScript, TypeScript, Java, SQL
      - Frontend: React, Next.js, HTML/CSS, Tailwind CSS, Redux
      - Backend: Node.js, Express, Django, Flask, GraphQL
      - Databases: MongoDB, PostgreSQL, MySQL, Redis
      - AI/ML: TensorFlow, PyTorch, scikit-learn, NLP, Computer Vision
      - DevOps: Docker, Kubernetes, AWS, GCP, CI/CD

      EXPERIENCE:
      Senior Software Engineer | Tech Innovations Inc.
      Jan 2021 - Present
      - Developed and maintained microservices architecture using Node.js and Python
      - Implemented machine learning models for product recommendation system
      - Led a team of 5 engineers for the development of a new data pipeline
      - Reduced API response time by 40% through optimization techniques

      Software Engineer | DataTech Solutions
      Jun 2020 - Dec 2020
      - Built RESTful APIs using Express.js and MongoDB
      - Developed front-end components with React and Redux
      - Implemented CI/CD pipelines using GitHub Actions

      EDUCATION:
      Master of Science in Computer Science
      Stanford University | 2018 - 2020

      Bachelor of Technology in Computer Science
      Indian Institute of Technology | 2014 - 2018
    `;

    // Create the prompt for Gemini
    const prompt = `
      You are an AI assistant that helps analyze job descriptions and compare them to a candidate's resume.

      JOB DESCRIPTION:
      ${jobDescription}

      RESUME:
      ${resumeContent}

      Please analyze how well the candidate's skills and experience match the job description.
      Return your analysis in the following JSON format without any markdown formatting, explanations, or code blocks:
      {
        "overallMatch": number between 0-100 representing overall match percentage,
        "skillsMatch": [
          {
            "skill": "skill name",
            "match": number between 0-100 representing match percentage,
            "required": boolean indicating if the skill is required for the job
          }
        ],
        "missingSkills": ["skill1", "skill2"],
        "candidateSummary": "A positive, personalized summary (2-3 sentences) of how well Anil Sahith's profile fits this job role. Highlight his strengths and relevance to impress the recruiter."
      }

      IMPORTANT: Return ONLY the raw JSON object. Do not include any markdown formatting. Do not include any explanations before or after the JSON. The response should start with { and end with }.
    `;

    // Generate content
    const sendingPromptMessage = "🚀 Sending prompt to Gemini API...";
    console.log("\n" + sendingPromptMessage);
    await logToFile(sendingPromptMessage, logFilename);

    // Log the prompt for debugging
    await logToFile("PROMPT SENT TO API:\n" + prompt, logFilename);

    const result = await model.generateContent(prompt);

    const receivedResponseMessage = "✅ Received response from Gemini API";
    console.log(receivedResponseMessage);
    await logToFile(receivedResponseMessage, logFilename);

    const response = result.response;
    const text = response.text();

    // Debug output to see the raw LLM response
    const rawResponseStartMessage = "🤖🤖🤖 RAW LLM RESPONSE START 🤖🤖🤖";
    console.log("\n\n" + rawResponseStartMessage);
    await logToFile(rawResponseStartMessage, logFilename);

    const separator = "==================================================";
    console.log(separator);
    await logToFile(separator, logFilename);

    console.log(text);
    await logToFile(text, logFilename);

    console.log(separator);
    await logToFile(separator, logFilename);

    const rawResponseEndMessage = "🤖🤖🤖 RAW LLM RESPONSE END 🤖🤖🤖\n\n";
    console.log(rawResponseEndMessage);
    await logToFile(rawResponseEndMessage, logFilename);

    // The raw LLM response is logged above for debugging purposes

    // Parse the JSON response
    try {
      // Clean up the response if it contains markdown formatting
      let cleanText = text;

      // Remove markdown code block formatting if present
      if (text.includes('```json')) {
        cleanText = text.replace(/```json\n|```/g, '');
      }

      // Remove any other markdown formatting or text before/after the JSON
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }

      const cleanedTextMessage = `🔧 Cleaned text for parsing: ${cleanText}`;
      console.log(cleanedTextMessage);
      await logToFile(cleanedTextMessage, logFilename);

      const jsonResponse = JSON.parse(cleanText);
      const parsedMessage = "✅ Successfully parsed JSON response";
      console.log(parsedMessage);
      await logToFile(parsedMessage, logFilename);

      // Extract skills from the job description and find recommended projects
      const extractedSkills = extractSkillsFromJobDescription(jobDescription);
      const recommendedProjects = findRecommendedProjects(extractedSkills);

      const result = {
        overallMatch: jsonResponse.overallMatch || 70,
        skillsMatch: jsonResponse.skillsMatch || [],
        missingSkills: jsonResponse.missingSkills || [],
        candidateSummary: jsonResponse.candidateSummary || "Anil Sahith appears to be a strong match for this position with a diverse skill set in software engineering, AI/ML, and data science. His experience with modern technologies and frameworks aligns well with the requirements of this role.",
        recommendedProjects
      };

      const resultMessage = `🎉 Analysis complete! Results: ${JSON.stringify(result, null, 2)}`;
      console.log("🎉 Analysis complete! Returning results.");
      await logToFile(resultMessage, logFilename);

      return result;
    } catch (parseError) {
      const parseErrorMessage = `❌❌❌ ERROR PARSING GEMINI API RESPONSE: ${parseError}`;
      console.error(parseErrorMessage);
      await logToFile(parseErrorMessage, logFilename);

      const rawResponseMessage = `Raw response: ${text}`;
      console.log(rawResponseMessage);
      await logToFile(rawResponseMessage, logFilename);

      const fallbackMessage = "⚠️ Falling back to simulated response";
      console.log(fallbackMessage);
      await logToFile(fallbackMessage, logFilename);

      return getSimulatedResponse(jobDescription, logFilename);
    }
  } catch (error) {
    const apiErrorMessage = `❌❌❌ ERROR CALLING GEMINI API: ${error}`;
    console.error(apiErrorMessage);
    await logToFile(apiErrorMessage, logFilename);

    const fallbackMessage = "⚠️ Falling back to simulated response";
    console.log(fallbackMessage);
    await logToFile(fallbackMessage, logFilename);

    return getSimulatedResponse(jobDescription, logFilename);
  }
}

// Fallback function to get a simulated response
async function getSimulatedResponse(jobDescription: string, logFilename: string): Promise<ResumeAnalysisResult> {
  const simulatedResponseMessage = "💻💻💻 GENERATING SIMULATED RESPONSE 💻💻💻";
  console.log("\n\n" + simulatedResponseMessage);
  await logToFile(simulatedResponseMessage, logFilename);

  // Extract skills from job description
  const skills = extractSkillsFromJobDescription(jobDescription);
  const extractedSkillsMessage = `🔍 Extracted skills from job description: ${JSON.stringify(skills)}`;
  console.log(extractedSkillsMessage);
  await logToFile(extractedSkillsMessage, logFilename);

  // Generate a simulated response
  // Find recommended projects based on the extracted skills
  const recommendedProjects = findRecommendedProjects(skills);

  // Create the simulated response
  const result = {
    overallMatch: Math.floor(Math.random() * 30) + 65, // Random number between 65-95
    skillsMatch: skills.map(skill => ({
      skill,
      match: Math.floor(Math.random() * 40) + 60, // Random number between 60-100
      required: Math.random() > 0.5, // Randomly mark as required
    })),
    missingSkills: ['GraphQL', 'Kubernetes', 'Swift', 'Kotlin', 'Rust']
      .filter(() => Math.random() > 0.6), // Randomly include missing skills
    candidateSummary: `Anil Sahith demonstrates strong expertise in ${skills.slice(0, 3).join(', ')} and other technologies relevant to this position. With a background in both software engineering and AI/ML, he brings a versatile skill set that would be valuable for this role. His experience with modern development frameworks and methodologies indicates he would adapt quickly to your team's environment.`,
    recommendedProjects
  };

  // Log the simulated response for debugging purposes
  const responseMessage = `💻 SIMULATED RESPONSE: ${JSON.stringify(result, null, 2)}`;
  console.log(responseMessage);
  await logToFile(responseMessage, logFilename);

  const successMessage = "🎉 Simulated response generated successfully!";
  console.log(successMessage);
  await logToFile(successMessage, logFilename);

  return result;
}

// Helper function to extract skills from job description
function extractSkillsFromJobDescription(jobDescription: string): string[] {
  // In a real implementation, this would use NLP or the Gemini API to extract skills
  // For now, we'll check for common tech skills in the job description

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

  // Filter skills that appear in the job description
  const foundSkills = commonSkills.filter(skill =>
    jobDescription.toLowerCase().includes(skill.toLowerCase())
  );

  // If no skills found, return a default set
  if (foundSkills.length === 0) {
    return ['React', 'JavaScript', 'Node.js', 'MongoDB', 'AWS'];
  }

  return foundSkills;
}

// Function to find recommended projects based on job skills
function findRecommendedProjects(jobSkills: string[]): Project[] {
  const projects = projectsData.projects as Project[];

  // Calculate relevance score for each project
  const projectsWithScores = projects.map(project => {
    // Count how many job skills match with project skills
    const matchingSkills = project.skills.filter(skill =>
      jobSkills.some(jobSkill =>
        jobSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    // Calculate relevance score (percentage of job skills that match)
    const relevanceScore = matchingSkills.length > 0
      ? (matchingSkills.length / project.skills.length) * 100
      : 0;

    return {
      ...project,
      relevanceScore
    };
  });

  // Sort projects by relevance score (descending)
  const sortedProjects = projectsWithScores
    .filter(project => project.relevanceScore > 0) // Only include projects with matching skills
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  // Return top 3 most relevant projects
  return sortedProjects.slice(0, 3);
}

// In a real implementation, you would also have functions for:
// - Setting up the Gemini API client
// - Handling API errors and rate limiting
// - Caching responses
// - Processing and formatting the API responses
