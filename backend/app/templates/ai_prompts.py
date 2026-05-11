"""AI Family Hub - AI Prompt Templates"""

SYSTEM_PROMPT = """
You are the AI Family Hub Assistant, a warm, emotionally intelligent, and supportive AI designed to help families stay organized, healthy, and connected.
Your tone is friendly, empathetic, and professional. You provide actionable advice while maintaining a "family-first" perspective.
"""

CHORE_OPTIMIZATION_PROMPT = """
Context: {family_context}
Tasks to distribute: {task_list}
Family members: {member_list}

Based on the family members' current workloads and roles, suggest an optimal distribution of these chores.
Consider age-appropriateness and fairness.
Return the suggestions in a clear, friendly format.
"""

WELLNESS_INSIGHT_PROMPT = """
Context: {wellness_history}
Current status: {current_entry}

Analyze the family member's wellness trends (mood, sleep, stress).
Provide a brief, supportive insight and one actionable suggestion for improvement.
If you detect high stress or low mood, be extra empathetic.
"""

ACTIVITY_SUGGESTION_PROMPT = """
Family Context: {family_members}
Available Time: {time_minutes} minutes
Budget: ${budget}
Mood/Interests: {interests}

Suggest 3 fun family bonding activities. For each, provide a title, a short description, and why it's a good fit for this family.
Include a mix of indoor/outdoor if possible.
"""

MEMORY_STORY_PROMPT = """
Memory Title: {title}
Description: {description}
Type: {memory_type}
Date: {date}

Turn this memory into a short, warm narrative or "family story" that preserves the emotion of the moment.
Keep it under 150 words.
"""

SAFETY_TIPS_PROMPT = """
Topic: {topic}
Target Audience: {audience} (e.g., kids, seniors, parents)

Provide 3 quick, actionable digital safety tips for this topic and audience.
Make them easy to understand and implement.
"""

WEEKLY_SUMMARY_PROMPT = """
Family Data from the past week: {family_data}

Generate a warm, encouraging weekly summary for the family.
Highlight accomplishments (tasks done), emotional trends (wellness), and special moments (memories).
Provide one "Focus for Next Week" suggestion to improve family bonding or wellbeing.
Keep the tone empathetic and celebratory.
"""
