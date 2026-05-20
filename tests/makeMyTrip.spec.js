import {test} from '@playwright/test'
import * as XLSX from 'xlsx'
 
test('MakeMyTrip',async({page})=>
{
    await page.goto('https://www.makemytrip.com/');
    await page.locator('.commonModal__close').click();
    await page.locator('.menu_Hotels').click();
    await page.locator('#city').click();
    await page.getByPlaceholder('Where do you want to stay?').click();
    await page.getByPlaceholder('Where do you want to stay?').fill('hyderabad');
    await page.locator('.blackText.appendBottom5',{hasText:'Hitech City'}).click();
    await page.locator('.DayPicker-Day',{hasText:'20'}).first().click();
    await page.locator('.DayPicker-Day',{hasText:'25'}).first().click();
    const ad=await page.locator('.counter__value.pe-none').nth(1).textContent();
    //await console.log(ad);
    let ac=Number(ad);
    while(ac<5)
    {
        await page.locator('.counter__button.counter__button--increment').nth(1).click();
        ac=ac+1;  
    }
    await page.getByRole('button',{name:'APPLY'}).click();
    await page.getByRole('button',{name:'Search'}).click();
    await page.locator("//div[@class='w-6 h-6 bg-white rounded-full flex items-center justify-center p-0.5']").click();
    await page.locator('body > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > ul:nth-child(2) > li:nth-child(1) > span:nth-child(1) > label:nth-child(2)').click();
    await page.locator('#hlistpg_proptypes_show_more').nth(2).click();
    await page.locator('.makeFlex.column',{hasText:'Balcony/Terrace'}).click();
    await page.locator('.rangeInput').first().click();
    await page.locator('.rangeInput').first().fill('5000');
    await page.locator('.rangeInput').nth(1).click();
    await page.locator('.rangeInput').nth(1).fill('10000');
    await page.locator('.btnRangeGo.appendLeft5').click();
    await page.locator('.wordBreak.appendRight10').first().waitFor();
    const hnameArr=await page.locator('.wordBreak.appendRight10').allTextContents();
    const hcostArr=await page.locator('#hlistpg_hotel_shown_price').allTextContents();
   
    let tr = 1;
    var name='';
    for (let i = 0; i < 3; i++)
    {
        const [newpage] = await Promise.all
        ([
            page.context().waitForEvent('page'),
            page.locator('.listingRow.listingRowPerNew.bdrPerNew').nth(i).click()
        ]);
        await newpage.waitForLoadState();
        const n=await newpage.locator('.hotelName').textContent();
        const rate=await newpage.locator('.ratingGrph__percent.no-translate.notranslate').first().textContent();
        const rating=Number(rate.replace(/[^\d]/g, ""));
        await console.log(n);
        await console.log(rating);
        if(rating>tr)
            {
                tr=rating;
                name=n;
            }
        await newpage.close();
        await page.bringToFront();
    }
    await console.log(name);
    await console.log(tr);
    const [npage] = await Promise.all
        ([
            page.context().waitForEvent('page'),
            await page.locator('.wordBreak.appendRight10',{hasText:name}).click()
        ]);
    await npage.waitForLoadState();
    await npage.locator('.rmPayable__newDtl--right.newDtls').nth(0).click();
    await npage.waitForLoadState('networkidle');
    const bname=await npage.locator('.latoBlack.ft16').allTextContents();
    const bcost=await npage.locator('.cpnCodeCard__discount').allTextContents();
    await console.log(bname);
    const array1=[];
    for(var i=0;i<bname.length;i++)
    {
        await console.log(bname[i]+`   -   `+bcost[i]);
        const data=
        {
            BankName:bname[i],
            Cost:bcost[i]
        }
        array1.push(data);
    }
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(array1);
     
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Make My Trip');
    XLSX.writeFile(workbook,'Bank Offers.xlsx');
 
});
 