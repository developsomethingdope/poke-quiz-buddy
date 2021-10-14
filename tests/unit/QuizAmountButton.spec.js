import { mount } from '@vue/test-utils';
import QuizAmountButton from '@/components/QuizAmountButton.vue';
import store from '@/shared/store';

describe('QuizAmountButton.vue', () => {
  it('button text changes after amount selected', async () => {
    const quizAmountButtonWrapper = mount(QuizAmountButton, {
      global: {
        plugins: [
          store
        ]
      }
    });

    const dataQuizAmountDiv = quizAmountButtonWrapper.get('[data-quiz-amount="6"]');
    await dataQuizAmountDiv.trigger('click');

    //const quizAmountAreaDiv = quizAmountButtonWrapper.find('.quiz-amount-area');
    //expect(quizAmountAreaDiv.html()).toMatch('abc1');

    const quizAmountButton = quizAmountButtonWrapper.find('.button-quiz-amount');
    expect(quizAmountButton.text()).toContain('6 questions');
  });
});
