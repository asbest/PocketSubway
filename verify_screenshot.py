from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        # Go to the local server URL
        page.goto("http://localhost:8080/PocketSubway.html")

        # Wait for the loading screen to disappear
        page.wait_for_selector('#loading-screen', state='hidden', timeout=60000) # Increased timeout for track generation

        # Take a screenshot
        page.screenshot(path="screenshot.png")
        print("Screenshot saved as screenshot.png")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
