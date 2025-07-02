import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import data from "../configuration/properties.json";

test.describe("Login tests with different combinations", () => {

    //For the purposes of Login tests we need to use "login" project from config file in order to pass them using session storage state
    
    test("Valid username and valid password", async ({ page }) => {
        const login = new LoginPage(page);
        await login.goToLoginPage(data.url.loginUrl);
        await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
        await login.enterCredentials(data.user.validUser, data.user.validPass);
        await login.clickOnLoginBtn();
    });

    test("Invalid username and valid password", async ({ page }) => {
        const login = new LoginPage(page);
        await login.goToLoginPage(data.url.loginUrl);
        await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
        await login.enterCredentials(data.user.invalidUser, data.user.validPass);
        await login.clickOnLoginBtn();
        await login.verifyInvalidCredentialsAttempt();
    });

    test("Valid username and invalid password", async ({ page }) => {
        const login = new LoginPage(page);
        await login.goToLoginPage(data.url.loginUrl);
        await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
        await login.enterCredentials(data.user.validUser, data.user.invalidPass);
        await login.clickOnLoginBtn();
        await login.verifyInvalidCredentialsAttempt();
    });

    test("Invalid username and invalid password", async ({ page }) => {
        const login = new LoginPage(page);
        await login.goToLoginPage(data.url.loginUrl);
        await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
        await login.enterCredentials(data.user.invalidUser, data.user.invalidPass);
        await login.clickOnLoginBtn();
        await login.verifyInvalidCredentialsAttempt();
    });

    test("Empty username and valid password", async ({ page }) => {
        const login = new LoginPage(page);
        await login.goToLoginPage(data.url.loginUrl);
        await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
        await login.enterCredentials('', data.user.validPass);
        await login.clickOnLoginBtn();
        await login.verifyRequiredFieldBelowUsername();
    });

    test("Valid username and empty password", async ({ page }) => {
        const login = new LoginPage(page);
        await login.goToLoginPage(data.url.loginUrl);
        await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
        await login.enterCredentials(data.user.validUser, '');
        await login.clickOnLoginBtn();
        await login.verifyRequiredFieldBelowPassword();
    });

    test("Empty username and empty password", async ({ page }) => {
        const login = new LoginPage(page);
        await login.goToLoginPage(data.url.loginUrl);
        await login.verifyLoginPage(data.url.loginUrl, data.titles.loginTitle);
        await login.enterCredentials('', '');
        await login.clickOnLoginBtn();
        await login.verifyRequiredFieldBelowUsername();
        await login.verifyRequiredFieldBelowPassword();
    });

})