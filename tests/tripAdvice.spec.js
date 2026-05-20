import { test, expect } from "@playwright/test";
import * as XLSX from 'xlsx';
test("Trip Cost Caluculation", async ({page}) => {
  await page.goto('https://www.tripadvisor.in/')
  await page.locator(".w input").fill("Nairobi");
  await page.locator(".qSunQ a", { hasText: "Hotels" }).click();
  await page.locator(".IxycC button", { hasText: "25" }).first().click();
  await page.locator(".IxycC button", { hasText: "30" }).first().click();
  await page.locator('[data-automation="date-picker-search-button"]').waitFor();
  await page.locator('[data-automation="date-picker-search-button"]').click();
  await page.waitForTimeout(3000)
  await page.locator("//button[@aria-label='Enter the number of rooms and then enter the number of guests. The selected number of rooms is 1 and the selected number of guests is 2.']//div[@class='f u Q2']//*[name()='svg']").click();
  const roomsLocator = page.locator("[data-automation$='roomsNum']");
  const roomInc = page.locator("[title='Set rooms to one more']");
  const roomDec = page.locator('[title="Set room count to one less"]');
  let currentRooms = parseInt((await roomsLocator.textContent()) || "0");

  const targetRooms = 1;

  while (currentRooms < targetRooms) {
    await roomInc.click();
    currentRooms++;
  }
  while (currentRooms > targetRooms) {
    await roomDec.click();
    currentRooms--;
  }
  const peopleLocator = page.locator('[data-automation="adultsNum"]');
  const peopleInc = page.locator('[title="Set adult count to one more"]');
  const peopleDec = page.locator('[title="Set adult count to one less"]');
  let currentPeople = parseInt((await peopleLocator.textContent()) || "0");
  const targetPeople = 4;

  while (currentPeople < targetPeople) {
    await peopleInc.click();
    currentPeople++;
  }

  while (currentPeople > targetPeople) {
    await peopleDec.click();
    currentPeople--;
  }
  await page.locator('[data-automation="guestsUpdateBtn"]').click();
  await page.locator('[aria-label="Filters"]').click();
  await page.locator('label').filter({ hasText: '5 of 5 bubbles' }).first().waitFor();
  await page.locator('label').filter({ hasText: '5 of 5 bubbles' }).first().click();
  await page.locator('[data-automation="amen"] button').click();
  await page.locator('.Rwgng',{hasText:'Private Balcony'}).click();
  await page.locator('.Rwgng',{hasText:'Game Room'}).click();
  await page.locator('button').filter({ hasText: 'Apply' }).last().click();
  await page.locator('.wgDkh button').filter({ hasText: 'Apply' }).last().click();
  await page.waitForTimeout(3000);
  const arr=[];
  let hotels=0;
  while(hotels <3)
  {
    const hotelName=await page.locator('[data-automation="hotel-card-title"]').nth(hotels).textContent();
    const pricePerDay=await page.locator('[data-automation="metaRegularPrice"]').nth(hotels).textContent();
    const totalPrice=Number(pricePerDay.replace(/[^\d]/g, "")) * 5;
    console.log(hotelName+"    "+pricePerDay+"    ₹"+totalPrice);

    const data={
      HotelName:hotelName,
      oneDayPrice:pricePerDay,
      TotalCost:"₹"+totalPrice
    }
    arr.push(data);
    hotels++;
  }

  const workbook=XLSX.utils.book_new();
  const worksheet=XLSX.utils.json_to_sheet(arr);
  XLSX.utils.book_append_sheet(workbook,worksheet,"Top Hotels");
  XLSX.writeFile(workbook,"Hotels.xlsx");
  


});