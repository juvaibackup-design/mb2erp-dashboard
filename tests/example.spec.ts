import { test, expect } from "@playwright/test";

// test("has title", async ({ page }) => {
//   await page.goto("https://playwright.dev/");

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test("get started link", async ({ page }) => {
//   await page.goto("https://playwright.dev/");

//   // Click the get started link.
//   await page.getByRole("link", { name: "Get started" }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Installation" })
//   ).toBeVisible();
// });

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.describe("Login Page", () => {
  const login = {
    username: "user@icube.com",
    password: "Password@123",
  };
  test("Login Done", async ({ page }) => {
    await expect(page).toHaveURL(`http://localhost:3000/`);
    const userNamePlaceholder = page.getByPlaceholder("Username");
    const passswordplaceholder = page.getByPlaceholder("Password");
    const signBtn = page.getByText("Sign In");

    await userNamePlaceholder.fill(login.username);
    await passswordplaceholder.fill(login.password);
    await signBtn.click();
    await expect(page).toHaveURL(`http://localhost:3000/dashboard`);
  });
});
