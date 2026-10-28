import 'dotenv/config';
import { generateSessionPrep } from './ai/gemini.js';

async function main(): Promise<void> {
  const prep = await generateSessionPrep('I need help with probability. I understand simple fractions but get confused when counting possible outcomes. I want to explain the steps for a basic probability problem during my tutoring session.');
  console.log(JSON.stringify(prep, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'AI Session Prep failed');
  process.exitCode = 1;
});
