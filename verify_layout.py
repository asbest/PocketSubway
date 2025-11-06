from playwright.sync_api import sync_playwright

def verify_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8080/PocketSubway.html")
            # Warten, bis der Ladebildschirm verschwindet
            loading_screen = page.locator("#loading-screen")
            loading_screen.wait_for(state="hidden", timeout=60000)
            # Screenshot von der gesamten Seite machen
            page.screenshot(path="layout_verification.png")
            print("Screenshot 'layout_verification.png' wurde erstellt.")
        except Exception as e:
            print(f"Ein Fehler ist aufgetreten: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_layout()
