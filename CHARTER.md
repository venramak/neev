# The Neev charter

The test for every feature: after it acts, is a real human-to-human moment more likely or less? If less, it is cut.

## The AI never

1. Sends a message for the person. They always send.
2. Chats as a companion, or imitates anyone, living or dead.
3. Diagnoses, labels, or gives therapy or advice on what to do about a person.
4. Scores people or relationships, or shows streaks.
5. Times notifications to pull the person back.
6. Sends a name, an alias or a sentence the person wrote off the phone.
7. Trains on anyone's data.
8. Says something about the person that does not come from their own answers. Universal lines are marked as universal.

## Enforced in code

| Rule | Where | Test |
| --- | --- | --- |
| Outputs pass the banned list, word limit, and keep the ___ | `packages/core/src/charter.ts` | `charter` suite |
| No engine sees a name; cloud payloads are checked for leaks | `redact.ts`, `ai.ts` | `device boundary`, `draft orchestration` |
| The server accepts only the structure-only shape | `workers/api/src/index.ts` | `api.test.ts` |
| Every AI surface works with no model: templates are the floor | `ai.ts` | `falls back to the template` |
| Unsafe, private-smaller, switched-off, grouped and lost ties are never suggested | `rings.ts`, `kindest.ts` | `kindest gap` |
| Crisis phrases in English, Hindi (both scripts) open the helplines | `gate.ts` | `crisis gate` |

## Before public launch

- A qualified counsellor reviews the crisis flow, the helpline copy, and each language's crisis list.
- A native speaker reviews every language's canon (questions, acts, reasons), not only the interface.
