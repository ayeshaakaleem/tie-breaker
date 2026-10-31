import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Analyze Decision
app.post('/api/analyze-decision', async (req: Request, res: Response) => {
  try {
    const { title, context, category, options, userCriteria } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: 'Please provide a decision title and at least 2 options to compare.',
      });
    }

    const ai = getAiClient();

    const prompt = `
You are the world's most analytical, insightful, and empathetic decision-making strategist for an app called "The Tiebreaker".
Your job is to provide an exhaustive, nuanced, and actionable breakdown of a real-life decision.

Decision Title: "${title}"
Category: ${category || 'General'}
User's Context & Constraints: ${context || 'None specified'}
Options:
${options.map((opt: { name: string; notes?: string }, idx: number) => `Option ${idx + 1}: ${opt.name} ${opt.notes ? `(${opt.notes})` : ''}`).join('\n')}
${userCriteria && userCriteria.length > 0 ? `Key User Priorities: ${userCriteria.join(', ')}` : ''}

Provide a structured, unbiased evaluation in JSON matching the exact schema below.
Be specific, realistic, and avoid generic fluff.
Include:
1. Concise executive dilemma summary.
2. For EACH option:
   - Punchy tagline
   - 3-5 distinct Pros with impact ("High" | "Medium" | "Low"), score (1-5), and reasoning
   - 3-5 distinct Cons with severity ("High" | "Medium" | "Low"), score (1-5), and mitigation tip
   - Full SWOT analysis (3-4 bullet points each for Strengths, Weaknesses, Opportunities, Threats)
   - 10/10/10 Rule forecast: perspective in 10 minutes, 10 months, and 10 years
3. Multi-criteria Comparison Matrix:
   - 5-7 meaningful evaluation criteria (e.g., Financial ROI / Cost, Stress & Wellbeing, Long-term Growth, Flexibility / Reversibility, Alignment with Goals, Time Investment)
   - For each criterion, provide a score (1-10) and brief rationale for each option.
4. The Tiebreaker Verdict:
   - Clear recommendation indicating which option edges out
   - Confidence percentage (e.g. 75)
   - Headline reasoning
   - Deep executive synthesis
   - "The Deciding Question": The single diagnostic question that cuts through the noise
   - Reversibility: whether it's a "two-way-door" (reversible) or "one-way-door" (high stakes / hard to reverse) with explanation
   - Gut-check coin flip prompt
   - Immediate 3-step action roadmap
5. 4 Tiebreaker Duel Questions:
   - Rapid-fire trade-off questions designed to test the user's subconscious preference between the options.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            optionsAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionIndex: { type: Type.INTEGER },
                  optionName: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        point: { type: Type.STRING },
                        impact: { type: Type.STRING },
                        score: { type: Type.INTEGER },
                        reasoning: { type: Type.STRING },
                      },
                      required: ['point', 'impact', 'score', 'reasoning'],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        point: { type: Type.STRING },
                        severity: { type: Type.STRING },
                        score: { type: Type.INTEGER },
                        mitigation: { type: Type.STRING },
                      },
                      required: ['point', 'severity', 'score', 'mitigation'],
                    },
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                  },
                  timeHorizon10x: {
                    type: Type.OBJECT,
                    properties: {
                      tenMinutes: { type: Type.STRING },
                      tenMonths: { type: Type.STRING },
                      tenYears: { type: Type.STRING },
                    },
                    required: ['tenMinutes', 'tenMonths', 'tenYears'],
                  },
                },
                required: ['optionIndex', 'optionName', 'tagline', 'pros', 'cons', 'swot', 'timeHorizon10x'],
              },
            },
            comparisonMatrix: {
              type: Type.OBJECT,
              properties: {
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      description: { type: Type.STRING },
                      scores: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionIndex: { type: Type.INTEGER },
                            optionName: { type: Type.STRING },
                            score: { type: Type.INTEGER },
                            comment: { type: Type.STRING },
                          },
                          required: ['optionIndex', 'optionName', 'score', 'comment'],
                        },
                      },
                    },
                    required: ['name', 'category', 'description', 'scores'],
                  },
                },
              },
              required: ['criteria'],
            },
            tiebreakerVerdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOptionIndex: { type: Type.INTEGER },
                recommendedOptionName: { type: Type.STRING },
                confidenceScore: { type: Type.INTEGER },
                headline: { type: Type.STRING },
                executiveSummary: { type: Type.STRING },
                theDecidingQuestion: { type: Type.STRING },
                reversibilityType: { type: Type.STRING },
                reversibilityExplanation: { type: Type.STRING },
                gutCheckPrompt: { type: Type.STRING },
                actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                'recommendedOptionIndex',
                'recommendedOptionName',
                'confidenceScore',
                'headline',
                'executiveSummary',
                'theDecidingQuestion',
                'reversibilityType',
                'reversibilityExplanation',
                'gutCheckPrompt',
                'actionPlan',
              ],
            },
            tiebreakerDuelQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  scenario: { type: Type.STRING },
                  choiceA: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      favorsOptionIndex: { type: Type.INTEGER },
                    },
                    required: ['text', 'favorsOptionIndex'],
                  },
                  choiceB: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      favorsOptionIndex: { type: Type.INTEGER },
                    },
                    required: ['text', 'favorsOptionIndex'],
                  },
                },
                required: ['id', 'scenario', 'choiceA', 'choiceB'],
              },
            },
          },
          required: ['summary', 'optionsAnalysis', 'comparisonMatrix', 'tiebreakerVerdict', 'tiebreakerDuelQuestions'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from AI model.');
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-decision:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze decision. Please try again.',
    });
  }
});

// API: Devil's Advocate & Stress Testing
app.post('/api/challenge-decision', async (req: Request, res: Response) => {
  try {
    const { title, chosenOption, options, context, userQuestion } = req.body;

    const ai = getAiClient();
    const prompt = `
You are the Devil's Advocate module inside "The Tiebreaker".
The user is contemplating or leaning towards choosing: "${chosenOption}" for the decision: "${title}".
All options were: ${options.map((o: any) => o.name).join(', ')}.
Context: ${context || 'None'}
User's Question or Concern: "${userQuestion || "Stress test this choice: what are the blind spots, worst-case scenarios, and how can I de-risk it?"}"

Respond in structured JSON with:
1. "devilsAdvocateSummary": A sharp, respectful reality check pointing out risks they might be romanticizing or overlooking.
2. "blindspots": 3 specific blindspots or hidden assumptions.
3. "worstCaseScenario": The realistic worst-case scenario and whether it's survivable.
4. "deriskingMoves": 3 concrete actions to mitigate the danger before or immediately upon pulling the trigger.
5. "acidTestQuestion": One definitive question to confirm their readiness.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            devilsAdvocateSummary: { type: Type.STRING },
            blindspots: { type: Type.ARRAY, items: { type: Type.STRING } },
            worstCaseScenario: { type: Type.STRING },
            deriskingMoves: { type: Type.ARRAY, items: { type: Type.STRING } },
            acidTestQuestion: { type: Type.STRING },
          },
          required: [
            'devilsAdvocateSummary',
            'blindspots',
            'worstCaseScenario',
            'deriskingMoves',
            'acidTestQuestion',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/challenge-decision:', error);
    return res.status(500).json({
      error: error.message || 'Failed to challenge decision.',
    });
  }
});

// Serve frontend in dev or prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Tiebreaker server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
