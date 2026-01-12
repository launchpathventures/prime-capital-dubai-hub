# Audio Intro Generator

Generate a focused 60-90 second audio introduction for LMS modules.

---

## System Prompt

```
You are a voice coach creating audio introductions for Prime Capital's real estate training program. Your role is to create concise, impactful audio scripts that help consultants quickly grasp why a module matters and what they need to remember.

VOICE & TONE:
- Direct and confident, not corporate
- Conversational, as if speaking to a colleague
- No filler phrases ("In this module, we'll explore...")
- Get to the point immediately

STRUCTURE (60-90 seconds when spoken):
1. WHY THIS MATTERS (15-20 sec): Real-world stakes. What goes wrong if they don't learn this?
2. THE ESSENTIALS (30-40 sec): 3-4 key points. "If you remember nothing else..."
3. KEY TAKEAWAY (15-20 sec): The single most important insight

CONSTRAINTS:
- Maximum 200 words total
- No bullet points or formatting (this will be spoken)
- No markdown syntax
- No "Welcome to..." or "In this module..."
- Start with impact, not introduction
- Use "you" not "the consultant"
- Reference real Dubai real estate context where relevant
```

---

## User Prompt Template

```
Generate an audio introduction script for this training module:

MODULE: {{title}}
NUMBER: {{moduleNumber}}
COMPETENCY: {{competency}}
DESCRIPTION: {{description}}

LEARNING OBJECTIVES:
{{learningObjectives}}

MODULE CONTENT SUMMARY:
{{contentSummary}}

Generate a 60-90 second audio intro following the WHY/ESSENTIALS/TAKEAWAY structure.
```

---

## Example Input

```
MODULE: Prime Capital Positioning
NUMBER: 1.2
COMPETENCY: Market Intelligence
DESCRIPTION: Learn to articulate Prime Capital's unique positioning as the 'antidote to Dubai hustle' and differentiate our advisory approach from transactional agencies.

LEARNING OBJECTIVES:
- Articulate Prime Capital's brand positioning clearly and authentically
- Differentiate the advisory model from transactional real estate approaches
- Handle common client questions about agency differences
- Demonstrate the Prime Capital approach in initial conversations

MODULE CONTENT SUMMARY:
Dubai has over 10,000 registered agents. Many investors have experienced aggressive tactics, inflated promises, and transactional relationships. Prime Capital is positioned as the "antidote to Dubai hustle" - advisory over sales, selective clients, market expertise. Key differentiators: we provide intelligence not sales pressure, we're relationship-focused not transaction-focused, we align with client interests not developer incentives.
```

---

## Example Output

```
Dubai has over ten thousand registered agents. Most sound exactly the same—pushing properties, creating urgency, promising returns they can't guarantee. If you can't articulate what makes Prime Capital different in the first thirty seconds, you've already been mentally filed away as "another Dubai agent."

Here's what you need to know.

First—we're advisors, not salespeople. We provide intelligence and access. We don't convince anyone to buy anything.

Second—sophisticated clients are scanning for red flags. Generic enthusiasm, pressure tactics, vague promises—these signal you're like everyone else. Calm confidence signals expertise.

Third—our positioning isn't about listing our services. It's about naming the problem: investors have been burned by the Dubai hustle. We're the antidote.

Fourth—alignment matters. We work for the client's interests, not developer incentives. Say this explicitly.

The key takeaway: When someone asks what you do, don't describe services. Describe the problem you solve. "We help international investors navigate Dubai real estate without the pressure and misinformation they've encountered elsewhere."

That's your opening. Make it count.
```

---

## Batch Processing Instructions

To generate all 68 audio intros:

1. **Extract module metadata**: Run script to pull frontmatter from all `.md` files
2. **Summarize content**: For each module, extract first 500 words or key sections
3. **Generate intros**: Feed each module through the prompt template
4. **Review output**: Check for consistency, tone, and accuracy
5. **Save as**: `{moduleNumber}-{slug}.intro.txt` (e.g., `1.2-competitive-landscape.intro.txt`)

### Quick Script (Node.js)

```javascript
// scripts/generate-audio-intros.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const LMS_DIR = 'content/lms'

async function extractModules() {
  const modules = []
  
  // Walk through competency folders
  const competencies = fs.readdirSync(LMS_DIR)
    .filter(f => fs.statSync(path.join(LMS_DIR, f)).isDirectory())
    .filter(f => /^\d+-/.test(f))
  
  for (const comp of competencies) {
    const files = fs.readdirSync(path.join(LMS_DIR, comp))
      .filter(f => f.endsWith('.md'))
      .filter(f => !f.startsWith('_'))
      .filter(f => !f.startsWith('quiz-'))
      .filter(f => !['README.md', 'AUDIT.md'].includes(f))
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(LMS_DIR, comp, file), 'utf-8')
      const { data, content: body } = matter(content)
      
      modules.push({
        file,
        title: data.title,
        moduleNumber: data.moduleNumber,
        competency: data.competency,
        description: data.description,
        learningObjectives: data.learningObjectives || [],
        contentSummary: body.slice(0, 1500) // First ~500 words
      })
    }
  }
  
  return modules
}

// Generate prompt for each module
function buildPrompt(module) {
  return `Generate an audio introduction script for this training module:

MODULE: ${module.title}
NUMBER: ${module.moduleNumber}
COMPETENCY: ${module.competency}
DESCRIPTION: ${module.description}

LEARNING OBJECTIVES:
${module.learningObjectives.map(o => `- ${o}`).join('\n')}

MODULE CONTENT SUMMARY:
${module.contentSummary}

Generate a 60-90 second audio intro following the WHY/ESSENTIALS/TAKEAWAY structure.`
}

// Main
const modules = await extractModules()
console.log(`Found ${modules.length} modules`)

// Output prompts to file for batch processing
const output = modules.map(m => ({
  id: `${m.moduleNumber}-${m.file.replace('.md', '')}`,
  prompt: buildPrompt(m)
}))

fs.writeFileSync('catalyst/temp/audio-intro-prompts.json', JSON.stringify(output, null, 2))
```

---

## Output Storage

Generated intro scripts should be saved to:
- **Draft location**: `catalyst/temp/audio-intros/`
- **Final location**: `content/lms/{competency}/{moduleNumber}-{slug}.intro.txt`

After TTS generation, audio files go to:
- **Supabase Storage**: `audio/intros/{moduleNumber}-{slug}.mp3`
