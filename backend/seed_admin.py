#!/usr/bin/env python3
"""Convenience entrypoint for Seagrass AI Admin Seeder."""
import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.scripts.seed_admin import main

if __name__ == "__main__":
    main()
