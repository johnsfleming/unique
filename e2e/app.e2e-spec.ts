import { UniquePage } from './app.po';

describe('unique App', () => {
  let page: UniquePage;

  beforeEach(() => {
    page = new UniquePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
