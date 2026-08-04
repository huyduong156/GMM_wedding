---
name: web-research-agent
description: Delegate internet research to a dedicated sub-agent and return a compact, cited evidence brief. Use whenever a task requires Google/web search, current information, external documentation, product or image research, source verification, links, licensing checks, or facts not available in the repository. Do not use for facts fully answerable from local project files.
---

# Web Research Agent

## Overview

Keep raw web results out of the main task context by assigning research to a dedicated sub-agent.

## Workflow

1. Define one bounded research question, freshness needs, source preferences, exclusions, and the decision the result must support.
2. Spawn one dedicated sub-agent before browsing and pass only task-relevant context.
3. Require primary/official sources where possible, claim verification, dates, direct URLs, sourced-fact versus inference labels, and no long quotes or page dumps.
4. Continue useful local work while research runs. Do not duplicate the same web search in the main agent.
5. Ask one focused follow-up only if a material claim lacks evidence.
6. Use only relevant conclusions in implementation and cite sources when research influenced the result.

## Required output

Keep the sub-agent brief under roughly 1,200 words unless the task requires more:

```text
Recommendation
Evidence: claim — source, publisher, date, direct URL
Risks / uncertainty
Implementation notes
```

For image research, also require page URL, direct asset URL when available, author, license page, crop suitability, readable text or PII risk, and one recommended choice.

## Guardrails

- This is orchestration, not a separately trained model. Use the available sub-agent model unless the user explicitly requests another model.
- Do not treat snippets or AI summaries as sufficient evidence for high-stakes claims.
- Do not download or commit an asset until its license and source page are recorded.
- If no agent slot is available, perform a narrowly scoped search locally and state that delegation was unavailable.

<!-- Inert scaffold notes retained because the Windows sync provider prevented atomic deletion during initialization.

## Structuring This Skill

[TODO: Choose the structure that best fits this skill's purpose. Common patterns:

**1. Workflow-Based** (best for sequential processes)
- Works well when there are clear step-by-step procedures
- Example: DOCX skill with "Workflow Decision Tree" -> "Reading" -> "Creating" -> "Editing"
- Structure: ## Overview -> ## Workflow Decision Tree -> ## Step 1 -> ## Step 2...

**2. Task-Based** (best for tool collections)
- Works well when the skill offers different operations/capabilities
- Example: PDF skill with "Quick Start" -> "Merge PDFs" -> "Split PDFs" -> "Extract Text"
- Structure: ## Overview -> ## Quick Start -> ## Task Category 1 -> ## Task Category 2...

**3. Reference/Guidelines** (best for standards or specifications)
- Works well for brand guidelines, coding standards, or requirements
- Example: Brand styling with "Brand Guidelines" -> "Colors" -> "Typography" -> "Features"
- Structure: ## Overview -> ## Guidelines -> ## Specifications -> ## Usage...

**4. Capabilities-Based** (best for integrated systems)
- Works well when the skill provides multiple interrelated features
- Example: Product Management with "Core Capabilities" -> numbered capability list
- Structure: ## Overview -> ## Core Capabilities -> ### 1. Feature -> ### 2. Feature...

Patterns can be mixed and matched as needed. Most skills combine patterns (e.g., start with task-based, add workflow for complex operations).

Delete this entire "Structuring This Skill" section when done - it's just guidance.]

## [TODO: Replace with the first main section based on chosen structure]

[TODO: Add content here. See examples in existing skills:
- Code samples for technical skills
- Decision trees for complex workflows
- Concrete examples with realistic user requests
- References to scripts/templates/references as needed]

## Resources (optional)

Create only the resource directories this skill actually needs. Delete this section if no resources are required.

### scripts/
Executable code (Python/Bash/etc.) that can be run directly to perform specific operations.

**Examples from other skills:**
- PDF skill: `fill_fillable_fields.py`, `extract_form_field_info.py` - utilities for PDF manipulation
- DOCX skill: `document.py`, `utilities.py` - Python modules for document processing

**Appropriate for:** Python scripts, shell scripts, or any executable code that performs automation, data processing, or specific operations.

**Note:** Scripts may be executed without loading into context, but can still be read by Codex for patching or environment adjustments.

### references/
Documentation and reference material intended to be loaded into context to inform Codex's process and thinking.

**Examples from other skills:**
- Product management: `communication.md`, `context_building.md` - detailed workflow guides
- BigQuery: API reference documentation and query examples
- Finance: Schema documentation, company policies

**Appropriate for:** In-depth documentation, API references, database schemas, comprehensive guides, or any detailed information that Codex should reference while working.

### assets/
Files not intended to be loaded into context, but rather used within the output Codex produces.

**Examples from other skills:**
- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Not every skill requires all three types of resources.**

-->
