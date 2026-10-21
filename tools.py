import validators
from newspaper import Article
import os
import requests
import logging
import re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_article_text(url: str) -> str:
    """Extract main article text from a news URL."""
    url = url.strip().strip("'\"")  # Remove whitespace and quotes
    if not validators.url(url):
        return "Error: Invalid URL provided."
    logger.info(f"Extracting article from URL: {url}")
    try:
        article = Article(url, config=None)
        article.config.request_timeout = 10
        article.download()
        article.parse()
        return article.text
    except Exception as e:
        logger.error(f"Error extracting article: {str(e)}")
        return f"Error extracting article: {str(e)}"

def summarize_text(text: str) -> str:
    """Create an abstractive summary with Gemini and retain a local fallback."""
    cleaned_text = re.sub(r'\s+', ' ', text).strip()
    promotional_patterns = (
        r'live events.*?trusted news source.*?(?:now!|$)',
        r'you can now subscribe.*?(?:channel|$)',
        r'subscribe to our.*?(?:channel|$)',
    )
    for pattern in promotional_patterns:
        cleaned_text = re.sub(pattern, ' ', cleaned_text, flags=re.IGNORECASE)
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
    if not cleaned_text:
        return 'No article content was available to summarize.'

    try:
        llm = ChatGoogleGenerativeAI(
            model='gemini-flash-latest',
            temperature=0.2,
            google_api_key=os.getenv('GOOGLE_API_KEY'),
        )
        prompt = (
            'Summarize the following news article for a busy reader.\n'
            'Return exactly 3 concise bullet points and one sentence titled '
            '"Bottom line:". Preserve names, numbers, dates, and uncertainty. '
            'Do not invent facts or add opinions.\n\n'
            f'Article:\n{cleaned_text}'
        )
        response = llm.invoke(prompt)
        summary = response.content if isinstance(response.content, str) else str(response.content)
        summary = summary.strip()
        if summary:
            return summary
    except Exception as error:
        logger.warning('Abstractive summarization failed; using local fallback: %s', error)

    sentences = re.split(r'(?<=[!?])\s+|(?<=[.!?])\s+(?=[A-Z])|(?<=[.!?])(?=[A-Z])', cleaned_text)
    bullet_points = ['• ' + sentence.strip() for sentence in sentences[:3] if sentence.strip()]
    return '\n'.join(bullet_points)

def translate_text(text: str, target_language: str) -> str:
    """Translate text into the desired language."""
    try:
        api_key = os.getenv("TRANSLATE_API")
        target_language = target_language.strip().lower()
        language_map = {
            'spanish': 'es',
            'french': 'fr',
            'german': 'de',
            'hindi': 'hi',
            'chinese (simplified)': 'zh-CN',
            'english': 'en'
        }
        target_code = language_map.get(target_language, target_language)

        if not api_key:
            return "Error: Add TRANSLATE_API to .env to enable translation."

        url = "https://translation.googleapis.com/language/translate/v2"
        logger.info(f"Sending translation request for text to {target_code}")
        chunks = [text[index:index + 4000] for index in range(0, len(text), 4000)]
        translated_chunks = []
        for chunk in chunks:
            response = requests.post(
                url,
                params={'key': api_key},
                data={'q': chunk, 'target': target_code, 'format': 'text'},
                timeout=20,
            )
            if response.status_code != 200:
                error_message = response.text[:300].replace('\n', ' ')
                logger.error(f"Translation API error: Status code {response.status_code}, Response: {error_message}")
                return f"Error: Translation API returned status code {response.status_code}: {error_message}"
            translated_chunks.append(response.json()['data']['translations'][0]['translatedText'])
        logger.info("Translation successful")
        return '\n'.join(translated_chunks)
    except Exception as e:
        logger.error(f"Error in translation: {str(e)}")
        return f"Error in translation: {str(e)}"