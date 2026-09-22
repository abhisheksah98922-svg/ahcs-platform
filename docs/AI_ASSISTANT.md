# AHCS — Safe AI Health Assistant & Clinical Guardrails

## 1. Safety Mandate & Boundaries
The AHCS AI Health Assistant (`POST /api/v1/ai/explain`) is engineered exclusively for **medical terminology education, patient lab value explanation, and consultation preparation**.

Under NO circumstances will the AI:
- Diagnose clinical illnesses or medical conditions.
- Prescribe, modify, or discontinue medications or dosages.
- Override a licensed physician's clinical directive.

## 2. Hard Intervention Trigger Guardrails
Any query containing intent to diagnose symptoms, change prescription dosages, or seek emergency replacement directives triggers an immediate safety refusal:
```json
{
  "success": true,
  "refused": true,
  "mode": "SAFETY_INTERVENTION",
  "explanation": "Medical Safety Notice: The AHCS AI Health Assistant is strictly an educational tool and cannot diagnose or prescribe medications, change dosages, or modify your treatment plan. Please consult your verified physician for clinical guidance.",
  "disclaimer": "For educational purposes only. AHCS AI cannot diagnose or prescribe."
}
```

## 3. Record-Grounded Summaries
When summarizing a patient's historical visit or lab document, the AI assistant verifies on the server that the caller possesses active consent or ownership for the referenced `recordId`. Unauthorized requests are blocked with HTTP 403 Forbidden.
