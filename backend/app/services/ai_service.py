"""AI Family Hub - Gemini AI Service"""
import google.generativeai as genai
from app.core.config import get_settings
from app.core.rate_limiter import rate_limiter
from app.templates.ai_prompts import SYSTEM_PROMPT
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.model_name = settings.GEMINI_MODEL
        self.rate_limiter = rate_limiter
        self._configured = False

    def _ensure_configured(self):
        if not self._configured and settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self._configured = True

    async def _generate_content(self, prompt: str, system_instruction: str = SYSTEM_PROMPT) -> str:
        """Helper to generate content with rate limiting and fallbacks."""
        self._ensure_configured()
        
        if not settings.GEMINI_API_KEY:
            return "AI service is currently unavailable (API key missing). Please try again later."

        if not self.rate_limiter.can_make_request():
            wait_time = self.rate_limiter.get_wait_time()
            return f"The AI assistant is taking a short break. Please try again in {int(wait_time)} seconds."

        # Try primary model, fallback if not found
        models_to_try = [
            self.model_name,
            "gemini-3.1-flash-lite",
            "gemini-2.5-flash-lite",
            "gemini-2.5-flash",
            "gemini-2.5-pro",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro"
        ]
        
        # Add prefixed versions
        full_list = []
        for m in models_to_try:
            full_list.append(m)
            if not m.startswith("models/"):
                full_list.append(f"models/{m}")
        
        last_error = None

        for model_name in full_list:
            try:
                # Some environments/models have issues with system_instruction in GenerativeModel constructor
                # We'll use a simpler initialization for now to isolate the 404 issue
                model = genai.GenerativeModel(model_name=model_name)
                
                # Combine system prompt with user prompt for maximum compatibility
                full_prompt = f"{system_instruction}\n\nUser Request: {prompt}"
                
                # Use async version of generate_content
                response = await model.generate_content_async(full_prompt)
                
                if not response or not response.text:
                    continue

                # Record successful request for rate limiting
                self.rate_limiter.record_request()
                return response.text
            except Exception as e:
                last_error = e
                logger.warning(f"Gemini model {model_name} failed: {str(e)}. Trying next...")
                continue

        logger.error(f"All Gemini models failed. Last error: {str(last_error)}")
        return f"AI Error: {str(last_error)}. Please check your GEMINI_API_KEY and model availability."

    async def get_chat_response(self, message: str, context: str = "") -> str:
        """Alias for chat_with_assistant for backward compatibility."""
        return await self.chat_with_assistant(message, context)

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
