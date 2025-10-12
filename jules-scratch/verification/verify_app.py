from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        page.goto("http://localhost:5173")
        page.wait_for_selector('input[type="text"]', timeout=10000)
        page.screenshot(path="jules-scratch/verification/01_initial_load.png")
        page.locator('input[type="text"]').type("help")
        page.keyboard.press("Enter")
        page.screenshot(path="jules-scratch/verification/02_help_command.png")
        page.locator('input[type="text"]').type("projects")
        page.keyboard.press("Enter")
        page.screenshot(path="jules-scratch/verification/03_projects_command.png")
        page.locator('input[type="text"]').type("skills")
        page.keyboard.press("Enter")
        page.screenshot(path="jules-scratch/verification/04_skills_command.png")
        browser.close()

run()