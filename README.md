# OrangeHRM Playwright Automation Project

## 📋 Overview

This project contains automated UI tests for the [OrangeHRM demo web application](https://opensource-demo.orangehrmlive.com/), implemented using **Playwright** and **TypeScript**.

The automation framework follows the **Page Object Model (POM)** design pattern for clean, reusable, and maintainable code.

---

## 📁 Project Structure

```
project-root/
├── pages/               # Page Object Model classes (Login, Home, Admin)
├── tests/               # Test suites for Login, Home, and Admin pages
├── configuration/       # Test data and config (e.g., properties.json)
├── playwright.config.ts # Playwright configuration
├── README.md            # Project documentation
└── .github/workflows/   # GitHub Actions CI configuration
```

---

## 🚀 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js) or yarn

---

## 🛠️ Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chillhijo/OrangeHRM_Automation.git
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Install Playwright browsers:
   ```bash
   npx playwright install
   ```

---

## ▶️ Running Tests

**Run all tests:**
```bash
npx playwright test
```

**Run tests from a specific file:**
```bash
npx playwright test tests/LoginPage.spec.ts
```

**Open HTML report after test run:**
```bash
npx playwright show-report
```

---

## 📦 CI/CD Integration

This project includes GitHub Actions configuration located at:
```
.github/workflows/playwright.yml
```

Every `push` or `pull request` to `main` or `master` branch will:
- Install dependencies
- Install Playwright and required browsers
- Run all Playwright tests
- Upload HTML test report as a downloadable artifact

---
### ⚙️ Current Framework Enhancements
- Session Storage Reuse for UI Tests
- Implemented a dedicated useProject in playwright.config.ts for Login tests.
- Created an authentication test (Auth.spec.ts) which performs login and saves the session state in storage/logged-in-state.json.
- Modified other UI test suites to reuse the saved session state, avoiding repeated logins in beforeEach hooks and significantly speeding up test execution.

## 🔧 Future Improvements

This project can be enhanced and expanded in the following ways:

### ✅ Functional Improvements
- Add test coverage for more OrangeHRM modules (Leave, Recruitment, My Info, etc.).
- Implement **end-to-end workflows**, such as user creation followed by role assignment or leave request.
- Enable **data-driven testing** using external JSON/CSV datasets.

### 🧱 Framework Enhancements
- Introduce a `BaseTest` or global setup/teardown hooks to eliminate login repetition.
- Add support for **environment configuration** (e.g. `.env` or config switch between staging/prod).
- Include **custom reporters** like Allure or integrate with test analytics tools.

### 🔄 CI/CD Pipeline Improvements
- Add **test matrix** to run in parallel across browsers (Chromium, Firefox, WebKit).
- Integrate results with Slack/Teams or test dashboards.
- Configure CI to auto-tag failing tests or notify developers.

### 🔍 Quality & Maintenance
- Add **ESLint + Prettier** for consistent code style and linting.
- Use **code coverage tools** like `playwright-coverage`.
- Consider **visual regression testing** using Playwright snapshots or tools like Percy.

---

## 📬 Contact

For any questions about this project or assignment, please contact the author via GitHub or email pralicadusko93@gmail.com.