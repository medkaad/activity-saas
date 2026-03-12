import json

import requests

OLLAMA_URL = "http://192.168.1.220:11434/api/generate"


def extract_json_from_text(text: str) -> dict:
    cleaned = text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned.removeprefix("```json").strip()
    elif cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```").strip()

    if cleaned.endswith("```"):
        cleaned = cleaned.removesuffix("```").strip()

    return json.loads(cleaned)


def generate_activity(level: str, domain: str, theme: str) -> dict:
    prompt = f"""
Tu es un professeur expert de maternelle.

Génère une activité simple et adaptée pour :
- niveau : {level}
- domaine : {domain}
- thème : {theme}

Réponds uniquement en JSON valide avec les clés :
title
duration_minutes
materials
description
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False,
        },
        timeout=120,
    )
    response.raise_for_status()

    data = response.json()
    content = data["response"]

    return extract_json_from_text(content)