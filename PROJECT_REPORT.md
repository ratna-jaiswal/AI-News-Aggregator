# AI-Driven News Aggregator

**Project report | Presentation date: 23 November**  
**Presentation format: 10 minutes — 8 minutes presentation + 2 minutes Q&A**

<div style="page-break-after: always;"></div>

## Page 1 of 2

## 1. Introduction

The AI-Driven News Aggregator is a full-stack application that collects current news, identifies articles covering the same event, and presents them as unified stories. It combines a Python FastAPI backend with a React web interface and artificial-intelligence services for semantic clustering, summarization, and translation.

The system is intended to help readers review important stories quickly while retaining access to multiple original sources. Instead of showing repeated articles separately, it groups similar coverage and displays the contributing sources together.

## 2. Problem statement

News readers face three main problems:

1. The same event is repeated across many news websites.
2. Important information is distributed across long articles and multiple sources.
3. News is not always available in the reader's preferred language.

Traditional news feeds generally organize articles by publisher or publication time, not by semantic similarity. This can produce duplicate stories, increase reading time, and make comparison difficult. The proposed system addresses these limitations by clustering related articles and adding AI-assisted summaries and translations.

## 3. Proposed solution

The application provides:

- Category-based news retrieval for general, business, entertainment, health, science, sports, and technology news.
- Semantic clustering of related headlines and descriptions.
- A unified story card containing a representative title, description, and source links.
- Article extraction and concise AI-generated summaries.
- Translation of summaries into Spanish, French, German, Hindi, and Simplified Chinese.
- A browser-based React interface connected to a FastAPI service.

The main API operations are:

| Endpoint | Function |
|---|---|
| `GET /` | Confirms that the API is running |
| `GET /news?category=<category>` | Retrieves and clusters news |
| `POST /query` | Summarizes, translates, or processes a user query |

## 4. Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, React Router 6, Axios, styled-components |
| Backend | Python 3.10, FastAPI, Pydantic, Uvicorn/Gunicorn |
| AI services | Google Gemini, LangChain, Sentence Transformers |
| External data | NewsAPI, Google Translate API, `newspaper3k` |
| Configuration | Environment variables loaded with `python-dotenv` |

The application does not currently use a database. It uses a local Sentence Transformer model cache and obtains live news and AI responses from external services.

<div style="page-break-after: always;"></div>

## Page 2 of 2

## 5. Approach and system workflow

The system follows this workflow:

1. The user selects a news category in the React frontend.
2. The frontend sends a request to the FastAPI `/news` endpoint.
3. The backend retrieves top headlines and category-related articles from NewsAPI.
4. Article titles and descriptions are converted into Sentence Transformer embeddings.
5. Cosine similarity is used to group articles with a similarity threshold greater than `0.8`.
6. Each group is returned as one story with its title, description, and source URLs.
7. When a reader opens a source, the backend extracts the article text.
8. Gemini generates a concise summary; Google Translate translates it when requested.

```text
React frontend
      |
      v
FastAPI /news and /query
      |
      +--> NewsAPI --> article collection
      |
      +--> Sentence Transformer --> similarity clustering
      |
      +--> Gemini --> summarization and agent queries
      |
      +--> Google Translate --> multilingual output
```

## 6. Experimental results

The following checks were performed on 22 October 2026:

| Experiment/check | Result |
|---|---|
| Python source compilation | Passed |
| React production build | Passed |
| Frontend test suite | 1 test failed |
| Backend automated tests | Not available |
| Live API smoke test | Not run; external API keys required |

The React production build completed successfully and generated an optimized deployable bundle. Python source files also compiled without syntax errors. The existing frontend test failed because it still expects the default Create React App “learn react” text, which is no longer part of the application. This is a stale test assertion rather than a production build failure.

The dependency review identified compatible updates for Testing Library, Axios, React Icons, and styled-components. It also identified major updates for React 19, React Router 7, and related packages. These should be upgraded only after compatibility testing.

## 7. Limitations and future improvements

- Python dependencies are not pinned, which can make deployments non-reproducible.
- No backend automated test suite is currently included.
- Backend modules are duplicated under the frontend directory.
- The frontend API URL is hardcoded to `http://localhost:8000`.
- Live news and AI responses depend on external services, API keys, rate limits, and network availability.
- News clustering and model initialization may increase first-request latency.

Recommended next steps are to repair the stale frontend test, add backend API tests, consolidate duplicated modules, pin Python dependencies, externalize deployment configuration, and add caching and retry policies for external services.

## 8. Conclusion

The AI-Driven News Aggregator demonstrates a practical use of natural-language processing and generative AI in a news-reading workflow. Its main contribution is combining semantic story clustering with article summarization and multilingual translation in one application. The current implementation has a working production frontend build and a clear extension path. Improving test coverage, dependency reproducibility, configuration management, and service resilience will make it more suitable for reliable deployment.

<div style="page-break-after: always;"></div>

# References

1. FastAPI documentation. *FastAPI — Modern, Fast Web Framework for Building APIs with Python*. https://fastapi.tiangolo.com/
2. React documentation. *React — The Library for Web and Native User Interfaces*. https://react.dev/
3. LangChain documentation. *LangChain Python Documentation*. https://python.langchain.com/
4. Google AI for Developers. *Gemini API Documentation*. https://ai.google.dev/gemini-api/docs
5. NewsAPI. *News API Documentation*. https://newsapi.org/docs
6. Sentence Transformers documentation. *Sentence-Transformers: Multilingual and Multimodal Embeddings*. https://www.sbert.net/
7. Google Cloud. *Cloud Translation Documentation*. https://cloud.google.com/translate/docs
8. Project source code and README: [`README.md`](./README.md)
9. Dependency assessment: [`js-assessment-report.md`](./.github/modernize/assessment/reports/report-20261022165236/js-assessment-report.md)
