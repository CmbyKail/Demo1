import subprocess
import webbrowser
import time
import os
import sys

def main():
    # Ensure we are in the script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    print("==========================================")
    print("      EQ Trainer - Launcher (Python)")
    print("==========================================")
    
    # Check if server.py exists
    if not os.path.exists("server.py"):
        print("Error: server.py not found!")
        input("Press Enter to exit...")
        return

    # Start the server as a subprocess
    print("Starting backend server (server.py)...")
    try:
        # sys.executable ensures we use the same python interpreter
        server_process = subprocess.Popen([sys.executable, "server.py"])
    except Exception as e:
        print(f"Failed to start server: {e}")
        input("Press Enter to exit...")
        return
    
    print("Waiting for server to initialize...")
    time.sleep(2)
    
    # Open default web browser
    url = "http://localhost:8000"
    print(f"Opening browser at {url}...")
    webbrowser.open(url)
    
    print("\n==========================================")
    print(" App started successfully!")
    print(" - Server is running in the background.")
    print(" - Close this window or press Ctrl+C to stop.")
    print("==========================================")
    
    try:
        # Keep the script running to keep the server process alive
        server_process.wait()
    except KeyboardInterrupt:
        print("\nStopping server...")
        server_process.terminate()
        server_process.wait()
        print("Server stopped. Goodbye!")

if __name__ == "__main__":
    main()
