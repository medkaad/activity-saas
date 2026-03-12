import json

import requests


OLLAMA_URL = "http://192.168.1.220:11434/api/generate"


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

    return {"raw": content}