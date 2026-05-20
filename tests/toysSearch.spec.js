import { test } from '@playwright/test';
import * as XLSX from 'xlsx';
import { EbayAdvancedSearchPage } from './EbayAdvancedSearchPage';

test('Outdoor toys search', async ({ page }) => {
  const ebayPage = new EbayAdvancedSearchPage(page);

  await ebayPage.goto();
  await ebayPage.openAdvancedSearch();
  await ebayPage.fillSearchCriteria();
  await ebayPage.search();

  const toysData = await ebayPage.getToysData();

  console.log(`Total toys found: ${toysData.length}`);

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(toysData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Outdoor Toys1');
  XLSX.writeFile(workbook, 'toys.xlsx');

  console.log('Execution Completed...');
});