import Groq from 'groq-sdk';
import { marketingConcepts } from './marketingConcepts';

const groq = new Groq({ 
  apiKey: (import.meta as any).env?.VITE_GROQ_API_KEY || '', 
  dangerouslyAllowBrowser: true 
});

export type QuestionType = 'mcq' | 'truefalse' | 'fill' | 'scenario';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  theoryLink: string;
  concept: string;
}

export const generateQuestion = async (
  topicId: string,
  difficulty: DifficultyLevel
): Promise<QuizQuestion> => {
  const concept = topicId === 'all' 
    ? marketingConcepts[Math.floor(Math.random() * marketingConcepts.length)]
    : marketingConcepts.find(c => c.id === topicId);
    
  if (!concept) throw new Error('Concept not found');

  const questionTypes: QuestionType[] = ['mcq', 'truefalse', 'fill', 'scenario'];
  const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  const prompt = `Generate a ${difficulty} level marketing question about "${concept.title}".

Concept Overview: ${concept.overview.what}
Key Concepts: ${concept.keyConcepts.map(kc => kc.name + ': ' + kc.description).join(', ')}

Question Type: ${questionType}
Difficulty: ${difficulty}

Requirements:
- Make it practical and real-world relevant
- Focus on application, not just memorization
- Include specific examples when possible
- Ensure only one correct answer
- Make distractors plausible but clearly wrong

Return ONLY a JSON object with this structure:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"] (only for MCQ),
  "correctAnswer": "The correct answer",
  "explanation": "Why this answer is correct and why others are wrong",
  "theoryLink": "Which key concept this relates to"
}`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are a marketing education expert. Generate high-quality quiz questions that test understanding, not memorization. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    let responseText = response?.choices?.[0]?.message?.content?.trim() || '';
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const questionData = JSON.parse(responseText);
    
    return {
      id: `${Date.now()}-${Math.random()}`,
      type: questionType,
      difficulty,
      question: questionData.question,
      options: questionData.options || [],
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      theoryLink: questionData.theoryLink,
      concept: concept.title
    };
  } catch (error) {
    console.error('Error generating question:', error);
    // Fallback question
    return {
      id: `${Date.now()}-${Math.random()}`,
      type: 'mcq',
      difficulty: 'easy',
      question: `What is the main purpose of ${concept.title}?`,
      options: ['To increase sales', 'To improve customer experience', 'To reduce costs', 'To expand globally'],
      correctAnswer: 'To improve customer experience',
      explanation: `This is a basic question about ${concept.title}. The correct answer demonstrates understanding of the core concept.`,
      theoryLink: 'Overview',
      concept: concept.title
    };
  }
};

export const generateFeedback = async (quizData: {
  conceptId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalTime: number;
  maxDifficulty: string;
}): Promise<string> => {
  const concept = quizData.conceptId === 'all'
    ? { title: 'All Marketing Topics' }
    : marketingConcepts.find(c => c.id === quizData.conceptId);
    
  if (!concept) return 'Great job completing the quiz!';

  const prompt = `Analyze this quiz performance and provide detailed, encouraging feedback:

Quiz: ${concept.title}
Questions Answered: ${quizData.totalQuestions}
Correct Answers: ${quizData.correctAnswers}
Accuracy: ${quizData.accuracy.toFixed(1)}%
Time Taken: ${Math.round(quizData.totalTime / 60)} minutes
Difficulty Reached: ${quizData.maxDifficulty}

Provide:
1. Encouraging opening message
2. 3 specific strengths observed
3. 2 areas for improvement with actionable advice
4. 3 concrete next steps
5. Motivational closing

Keep it positive, specific, and actionable. Use emojis sparingly.`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are an encouraging marketing tutor. Provide constructive, specific feedback that helps students improve while celebrating their achievements.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    return response?.choices?.[0]?.message?.content?.trim() || 'Great job completing the quiz! Keep practicing to master these concepts.';
  } catch (error) {
    console.error('Error generating feedback:', error);
    return 'Excellent work on completing the quiz! Your dedication to learning these marketing concepts will serve you well.';
  }
};

export const adjustDifficulty = (
  currentDifficulty: DifficultyLevel,
  accuracy: number
): DifficultyLevel => {
  const difficultyOrder: DifficultyLevel[] = ['easy', 'medium', 'hard', 'expert'];
  const currentIndex = difficultyOrder.indexOf(currentDifficulty);
  
  if (accuracy >= 80 && currentIndex < 3) {
    return difficultyOrder[currentIndex + 1];
  } else if (accuracy < 50 && currentIndex > 0) {
    return difficultyOrder[currentIndex - 1];
  }
  
  return currentDifficulty;
};

