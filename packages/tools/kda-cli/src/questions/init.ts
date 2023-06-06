import { localQuestions } from './local.js';
import { IAnswers, IQuestion } from './questions.js';

export const questions: IQuestion[] = [
  {
    message: 'What would you like to do?',
    name: 'task',
    type: 'multi-select',
    defaultValue: ['rerun'],
    choices: [
      {
        label: 'Rerun',
        value: 'rerun',
      },
      {
        label: 'Setup devnet',
        value: 'setup',
      },
      {
        label: 'Start devnet',
        value: 'start',
      },
      {
        label: 'Stop devnet',
        value: 'stop',
      },
      {
        label: 'Test a function of a smart contract',
        value: 'local',
      },
    ],
  },
  {
    message: 'Rerunning previous commands...',
    type: 'rerun',
    name: 'rerun',
    when: ({ task }: IAnswers) => !!task?.includes('rerun'),
  },
  ...localQuestions,
];
