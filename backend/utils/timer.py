"""
Utils — Timer
Utility for tracking elapsed time across the agent run.
"""
import time
from datetime import datetime, timezone


class Timer:
    def __init__(self):
        self._start: float = None
        self._end: float = None
        self.start_iso: str = None

    def start(self):
        self._start = time.time()
        self.start_iso = datetime.now(timezone.utc).isoformat()

    def stop(self) -> float:
        self._end = time.time()
        return self.elapsed()

    def elapsed(self) -> float:
        if self._start is None:
            return 0.0
        end = self._end if self._end else time.time()
        return round(end - self._start, 2)
