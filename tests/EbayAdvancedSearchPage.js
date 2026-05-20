export class EbayAdvancedSearchPage {
  constructor(page) {
    this.page = page;

    this.advancedLink = page.getByRole('link', { name: 'Advanced' });
    this.keywordInput = page.getByTestId('_nkw');
    this.keywordOption = page.getByTestId('s0-1-20-4[0]-7[1]-_in_kw');
    this.categoryDropdown = page.getByTestId('s0-1-20-4[0]-7[3]-_sacat');
    this.titleAndDescription = page.getByText('Title and description');
    this.newCondition = page.getByTestId('s0-1-20-6[4]-[0]-LH_ItemCondition');
    this.freeReturns = page.getByTestId('s0-1-20-5[5]-[0]-LH_FR');
    this.returnsAccepted = page.getByTestId('s0-1-20-5[5]-[1]-LH_RPA');
    this.preferredLocation = page.getByTestId('s0-1-20-6[7]-[3]-LH_PrefLoc');
    this.searchButton = page.getByRole('button', { name: 'Search' }).nth(1);
    this.items = page.locator('.su-card-container__header');
  }

  async goto() {
    await this.page.goto('https://www.ebay.com/');
  }

  async openAdvancedSearch() {
    await this.advancedLink.click();
  }

  async fillSearchCriteria() {
    await this.keywordInput.fill('outdoor toys');
    await this.keywordOption.selectOption('2');
    await this.categoryDropdown.selectOption('220');
    await this.titleAndDescription.click();
    await this.newCondition.check();
    await this.freeReturns.check();
    await this.returnsAccepted.check();
    await this.preferredLocation.check();
  }

  async search() {
    await this.searchButton.click();
    await this.items.first().waitFor();
  }

  async getToysData() {
    const results = [];
    const count = await this.items.count();

    for (let i = 0; i < count; i++) {
      const titleLink = this.items.nth(i).locator('a:has(.s-card__title)');

      const titleText = await titleLink.locator('.s-card__title span').first().textContent();

      const link = await titleLink.getAttribute('href');

      if (titleText && titleText.toLowerCase().includes('toys')) {
        results.push({
          Title: titleText.trim(),
          Link: link || '',
        });
      }
    }
    return results;
  }
};
