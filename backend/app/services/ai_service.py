"""AI Family Hub - Gemini AI Service"""
import google.generativeai as genai
from app.core.config import get_settings
from app.core.rate_limiter import rate_limiter
from app.templates.ai_prompts import SYSTEM_PROMPT
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not set. AI features will use fallbacks.")

class AIService:
    def __init__(self):
        self.model_name = settings.GEMINI_MODEL
        self.rate_limiter = rate_limiter

    async def _generate_content(self, prompt: str, system_instruction: str = SYSTEM_PROMPT) -> str:
        """Helper to generate content with rate limiting and fallbacks."""
        if not settings.GEMINI_API_KEY:
            return "AI service is currently unavailable (API key missing). Please try again later."

        if not self.rate_limiter.can_make_request():
            wait_time = self.rate_limiter.get_wait_time()
            return f"The AI assistant is taking a short break. Please try again in {int(wait_time)} seconds."

        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction
            )
            
            # Record request for rate limiting
            self.rate_limiter.record_request()
            
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            return "I'm having trouble connecting to my AI brain right now. Let me try again in a bit!"

    async def get_chore_suggestions(self, family_context: str, tasks: str, members: str) -> str:
        from app.templates.ai_prompts import CHORE_OPTIMIZATION_PROMPT
        prompt = CHORE_OPTIMIZATION_PROMPT.format(
            family_context=family_context,
            task_list=tasks,
            member_list=members
        )
        return await self._generate_content(prompt)

    async def get_wellness_insight(self, history: str, current: str) -> str:
        from app.templates.ai_prompts import WELLNESS_INSIGHT_PROMPT
        prompt = WELLNESS_INSIGHT_PROMPT.format(
            wellness_history=history,
            current_entry=current
        )
        return await self._generate_content(prompt)

    async def get_activity_suggestions(self, members: str, time: int, budget: float, interests: str) -> str:
        from app.templates.ai_prompts import ACTIVITY_SUGGESTION_PROMPT
        prompt = ACTIVITY_SUGGESTION_PROMPT.format(
            family_members=members,
            time_minutes=time,
            budget=budget,
            interests=interests
        )
        return await self._generate_content(prompt)

    async def get_memory_story(self, title: str, description: str, mtype: str, date: str) -> str:
        from app.templates.ai_prompts import MEMORY_STORY_PROMPT
        prompt = MEMORY_STORY_PROMPT.format(
            title=title,
            description=description,
            memory_type=mtype,
            date=date
        )
        return await self._generate_content(prompt)

    async def get_safety_tips(self, topic: str, audience: str) -> str:
        from app.templates.ai_prompts import SAFETY_TIPS_PROMPT
        prompt = SAFETY_TIPS_PROMPT.format(topic=topic, audience=audience)
        return await self._generate_content(prompt)

    async def get_weekly_summary(self, family_data: str) -> str:
        from app.templates.ai_prompts import WEEKLY_SUMMARY_PROMPT
        prompt = WEEKLY_SUMMARY_PROMPT.format(family_data=family_data)
        return await self._generate_content(prompt)

    async def chat_with_assistant(self, message: str, context: str = "") -> str:
        prompt = f"Context: {context}\nUser: {message}"
        return await self._generate_content(prompt)

ai_service = AIService()
