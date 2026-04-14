#!/usr/bin/env python3
"""
Momo Loans - Simple HTTP Server for Testing
This script starts a local web server for testing the Momo Loans website
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

PORT = 8000
HANDLER = http.server.SimpleHTTPRequestHandler

def start_server():
    """Start the local HTTP server"""
    # Change to the script directory
    script_dir = Path(__file__).parent.absolute()
    os.chdir(script_dir)
    
    try:
        with socketserver.TCPServer(("", PORT), HANDLER) as httpd:
            print("=" * 60)
            print("🚀 MOMO LOANS - LOCAL SERVER STARTED")
            print("=" * 60)
            print(f"\n📱 Website URL: http://localhost:{PORT}")
            print(f"📁 Serving from: {script_dir}")
            print("\n💡 Quick Tips:")
            print("   • Press Ctrl+C to stop the server")
            print("   • Open a browser and go to: http://localhost:8000")
            print("   • Check browser console (F12) for any errors")
            print("\n📝 After setup:")
            print("   1. Fill out the loan application form")
            print("   2. Configure your Telegram bot (see TELEGRAM_SETUP.md)")
            print("   3. Test the form submission")
            print("\n" + "=" * 60)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Goodbye!")
        sys.exit(0)
    except OSError as e:
        print(f"\n❌ Error: {e}")
        if "Address already in use" in str(e):
            print(f"   Port {PORT} is already in use.")
            print(f"   Try using a different port or kill the process using port {PORT}")
        sys.exit(1)

if __name__ == "__main__":
    start_server()
