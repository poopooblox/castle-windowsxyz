import sys
import traceback

URL = "https://castle.xyz"

try:
    import webview
except ImportError:
    print("A desktop webview package is required to run this app.")
    print("Install it with: python -m pip install pywebview")
    sys.exit(1)


def main():
    print("Starting Castle Desktop...")
    print(f"Using Python: {sys.executable}")
    print(f"Using webview module from: {webview.__file__}")

    try:
        window = webview.create_window(
            "Castle Desktop",
            URL,
            width=1280,
            height=840,
            resizable=True,
        )
        print("Window object created.")

        user_agent = (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/126.0.0.0 Safari/537.36"
        )

        try:
            webview.start(gui='edgechromium', debug=False, user_agent=user_agent)
        except Exception:
            print("Edge Chromium GUI unavailable; falling back to default WebView.")
            webview.start(debug=False, user_agent=user_agent)

        print("Webview has exited.")
    except Exception:
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
