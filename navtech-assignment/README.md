# Resume Parser with Transformer Models

## NavTech Assignment - AI/ML Engineer Role

A comprehensive resume parser that extracts structured information from PDF, DOC, and DOCX files using various LLM providers and transformer models.

## Features

- **Multiple File Format Support**: PDF, DOC, DOCX
- **Multiple LLM Options**:
  - Google Gemini
  - OpenAI GPT-3.5/4
  - OpenRouter (Free APIs)
  - Local Transformer Models (BERT, RoBERTa)
- **Structured JSON Output**: Standardized format for easy integration
- **Hybrid Extraction**: Combines LLM intelligence with rule-based patterns
- **Validation & Error Handling**: Robust output validation

## Output Format

```json
{
    "first_name": "string",
    "last_name": "string", 
    "email": "string",
    "phone": "string",
    "address": {
        "city": "string",
        "state": "string", 
        "country": "string"
    },
    "summary": "string",
    "skills": [{"skill": "string"}],
    "education_history": [{
        "name": "string",
        "degree": "string",
        "from_date": "string",
        "to_date": "string"
    }],
    "work_history": [{
        "company": "string",
        "title": "string", 
        "description": "string",
        "from_date": "string",
        "to_date": "string"
    }]
}
```

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Command Line
```bash
python src/main.py --file sample_resumes/resume.pdf --llm gemini
```

### Google Colab
Open `notebooks/Resume_Parser_Colab.ipynb` in Google Colab for interactive usage.

## Configuration

Create a `.env` file with your API keys:
```
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key
```

## 🚨 Troubleshooting API Issues

**Getting "API key invalid" errors?** This is usually a quota issue, not an invalid key.

**Quick Solutions:**
1. 🆓 **Get OpenRouter free key** (5 min): https://openrouter.ai/
2. ⏰ **Wait 24h** for Gemini quota reset
3. 🤖 **Use transformer provider** (offline)

**Detailed troubleshooting**: See [API_STATUS_README.md](API_STATUS_README.md)

## Web Interface

Start the web application:
```bash
python app.py
```

Visit:
- http://localhost:5000/ - Main interface
- http://localhost:5000/status - API status
- http://localhost:5000/providers - Provider status

## Project Structure

```
navtech-assignment/
├── config/           # Configuration files
├── src/             # Source code
│   ├── file_processors/  # File format handlers
│   ├── llm_providers/    # LLM integrations
│   ├── extractors/       # Information extractors
│   └── utils/           # Utility functions
├── notebooks/       # Jupyter notebooks
├── sample_resumes/  # Test files
└── tests/          # Unit tests
```

## License

This project is created for the NavTech assignment and is for educational purposes.
