import { test, expect } from '@playwright/test';
import data from '../configuration/properties.json';

test('Login and save storage state', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(data.url.dasboardUrl);

  await page.context().storageState({ path: 'storage/logged-in-state.json' });
});
