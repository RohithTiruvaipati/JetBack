# JetBack MVP Prototype (DFW)

Prototype mobile UI for **JetBack** (flight tracking + delay/cancellation mitigation for DFW Airport) built from the provided wireframes and SE document.  
Runs on a **Windows 10/11 PC** via **React Native (Expo) Web** while keeping a fixed mobile-sized viewport.

## Tech

- **React + React Native** (Expo)
- **TypeScript**
- **Python** (dummy domain logic; no API/DB connectivity)

## Prerequisites

### Node + npm

Your environment currently has `node` but **not** `npm`. Install Node LTS from the official installer (includes npm), then reopen the terminal.

Verify:

```bash
node -v
npm -v
```

### Python

You have the Windows launcher `py`. Verify:

```bash
py --version
```

## Run the app (web, fixed mobile viewport)

```bash
npm install
npm run web
```

Then open the URL shown in the terminal. The UI renders inside a centered phone-sized frame.

## Run the app (optional: Android/iOS simulator/device)

```bash
npm run start
```

## Python dummy domain logic

```bash
cd python
py -m pip install -r requirements.txt
py -m pytest
```

## Notes / Scope

- Dummy data only (no real APIs, AI, database, auth, wallet, push notifications).
- The prototype covers the 3 wireframe screens:
  - Saved Flights
  - Flight Status
  - Passenger Rights

