# Nagpur Traffic Command

Build a production-quality frontend web application called "RAASTA".

RAASTA is a traffic navigation and urban traffic-risk decision-support system for Nagpur, Maharashtra, India.

The application combines:

1. A live geospatial traffic map

2. Traffic congestion visualization

3. Risk analysis for different locations

4. Route/navigation assistance

5. Police deployment decision support

6. A compact analytics dashboard

IMPORTANT:

This is NOT a generic AI dashboard.

This is NOT a futuristic cyberpunk website.

This is NOT a military interface.

This is NOT a marketing landing page.

The visual identity should feel like a serious, professional geospatial navigation and command interface used by real operators.

The UI should look human-designed, restrained, highly usable, information-focused, and trustworthy.

==================================================

1. DESIGN PHILOSOPHY

==================================================

The core principle is:

INFORMATION > DECORATION

Every visual element must serve a functional purpose.

The user should immediately understand:

- Where they are

- Where traffic is heavy

- Which locations are risky

- Which route is preferable

- What the current risk level is

- Where police deployment may be required

Do not overwhelm the user with unnecessary UI.

The application should feel like a professional navigation/control system rather than an "AI-generated website".

==================================================

2. VISUAL STYLE

==================================================

Use a DARK geospatial command-center aesthetic.

The interface should be primarily dark gray/charcoal.

Use:

- subtle borders

- flat or slightly elevated surfaces

- compact spacing

- restrained rounded corners

- minimal shadows

- strong typography hierarchy

- high information density without becoming cluttered

Avoid excessive rounded cards.

Avoid excessive floating glass panels.

Avoid glassmorphism.

Avoid neon effects.

Avoid glowing borders.

Avoid large gradients.

Avoid animated backgrounds.

Avoid particles.

Avoid excessive blur.

Avoid futuristic sci-fi decorations.

Avoid giant hero sections inside the application.

Avoid unnecessary illustrations.

Avoid decorative AI graphics.

The map should be the dominant visual element.

==================================================

3. COLOR SYSTEM

==================================================

PRIMARY UI COLORS

Background:

#161A1E

Secondary background:

#1E2328

Panel / surface:

#262B30

Border / divider:

#33383D

Primary text:

#F3F4F6

Secondary text:

#9CA3AF

Muted text:

#6B7280

FUNCTIONAL COLORS

These colors have semantic meaning and must NOT be used as random decoration.

NORMAL / LOW TRAFFIC:

#10B981

MODERATE TRAFFIC:

#F59E0B

HIGH / CRITICAL TRAFFIC:

#EF4444

ACTIVE / ROUTE / INTERACTION:

#3B82F6

LIGHT FUNCTIONAL BACKGROUNDS

Normal:

#052E24

Moderate:

#451A03

Critical:

#450A0A

Active:

#172554

IMPORTANT COLOR RULE:

Blue is the primary RAASTA interaction color.

Green, amber and red represent traffic/risk states.

Do not turn the entire application into a colorful interface.

Most of the UI should remain dark gray.

==================================================

4. TYPOGRAPHY

==================================================

Use Inter as the primary font.

Typography should be compact, clean and professional.

Suggested hierarchy:

Application logo:

18–20px, semibold

Main section titles:

16–18px, semibold

Location names:

15–16px, semibold

Metadata:

11–13px, regular

Status labels:

10–12px, semibold, uppercase

Large metrics:

28–36px, medium/semibold

Normal body text:

13–14px

Avoid oversized typography except where it genuinely improves hierarchy.

Do not use futuristic display fonts.

==================================================

5. APPLICATION STRUCTURE

==================================================

Create the following main application areas:

A. Login

B. Main Live Map / Overview

C. Traffic Alerts

D. Analytics Dashboard

The MVP should primarily revolve around the Live Map.

==================================================

6. LOGIN PAGE

==================================================

Create a professional login screen.

The login page should have a subtle Nagpur map/geospatial visual in the background.

Do NOT use:

- glowing maps

- animated particles

- neon gradients

- futuristic 3D effects

The map should be subtle and secondary.

Center or slightly offset the login panel.

Content:

RAASTA

"Navigate smarter. Travel safer."

Email input

Continue button

Divider:

"OR"

Continue with Google button

Optional:

Continue as Guest

Keep the login interface minimal.

Use dark surfaces and thin borders.

The page should immediately communicate that RAASTA is a serious navigation/traffic product.

Authentication does not need to be connected to a real backend yet.

Implement the UI and interactions only.

==================================================

7. MAIN APPLICATION LAYOUT

==================================================

After login, show the main RAASTA application.

The layout should consist of:

TOP HEADER

LEFT NAVIGATION

TRAFFIC / LOCATION PANEL

LARGE MAP

The map should receive the majority of the screen.

Do not create a huge permanent sidebar.

Use a compact navigation rail/sidebar.

Suggested layout:

------------------------------------------------

TOP HEADER

------------------------------------------------

LEFT NAV | LOCATION / TRAFFIC PANEL | MAP

------------------------------------------------

BOTTOM STATUS BAR

------------------------------------------------

==================================================

8. TOP HEADER

==================================================

Create a compact top navigation bar.

Left:

RAASTA logo/name

Center:

Search field

Placeholder:

"Search location or destination..."

Right:

LIVE indicator

notification icon

user/profile menu

The LIVE indicator should use a subtle green dot.

Do not make the header oversized.

==================================================

9. LEFT NAVIGATION

==================================================

Create a compact navigation rail.

Items:

Overview

Live Map

Alerts

Analytics

Use simple Lucide icons.

Selected navigation item:

blue accent

Unselected:

muted gray

Do not create unnecessary navigation items.

Do NOT include:

AI Lab

AI Insights

Predictions

Automation

Command Center

Intelligence

etc.

unless they actually exist.

==================================================

10. MAIN MAP

==================================================

The map is the central feature of RAASTA.

Use a map library compatible with React.

Prefer:

Leaflet + React Leaflet

The map should focus on Nagpur, Maharashtra.

Initial map center should be approximately:

Latitude:

21.1458

Longitude:

79.0882

Use a dark map style if available.

The map must visually communicate traffic conditions.

Traffic locations should appear as markers or map overlays.

Use:

GREEN:

Normal / low traffic

AMBER:

Moderate traffic

RED:

High / critical traffic

BLUE:

Current user location and recommended route

Do NOT use glowing neon markers.

Markers should be clean and professional.

==================================================

11. USER LOCATION

==================================================

Create a current-location marker.

For now, use a mock location centered around Nagpur.

Structure the frontend so browser geolocation can be connected later.

Do not require real geolocation permissions for the initial prototype.

Clearly distinguish the user's current location from traffic-risk markers.

==================================================

12. ROUTE / NAVIGATION

==================================================

Create a route-search interface.

The user should be able to enter:

FROM:

Current location

TO:

Destination

Example:

From:

Current Location

To:

Nagpur Airport

Display a blue route line on the map.

Show a compact route information panel:

Recommended Route

Estimated distance

Estimated travel time

Traffic condition

For the initial prototype, use mock route data.

Structure the code so a real routing API can be integrated later.

Do NOT pretend the route is actually real-time if it is mock data.

==================================================

13. TRAFFIC LOCATION PANEL

==================================================

Create a compact left-side data panel next to the map.

Title:

TRAFFIC AREAS

Show a scrollable list of traffic locations.

Each item should contain:

Location name

Traffic/risk status

Risk score

Vehicle count

Small status indicator

Example:

SITABULDI

CRITICAL

81.5

850 vehicles

WARDHA ROAD

HIGH

66.6

720 vehicles

MANISH NAGAR

MODERATE

51.4

580 vehicles

SADAR

HIGH

64.2

640 vehicles

HINGNA ROAD

NORMAL

33.5

450 vehicles

Use the functional colors semantically.

Do not make every card visually loud.

==================================================

14. LOCATION SELECTION

==================================================

When the user clicks a traffic location, select it.

The selected location should:

- highlight on the map

- highlight in the location list

- open a contextual information panel

Use a thin blue or functional-color border to indicate selection.

Do not navigate to another page.

==================================================

15. LOCATION DETAIL PANEL

==================================================

When a location is selected, show:

LOCATION

SITABULDI

Status:

CRITICAL

Risk Score:

81.5

Traffic Data:

Vehicles:

850

Accidents:

4

Congestion:

8/10

Time:

18:00

Police Deployment:

Recommended Units:

4

Priority:

CRITICAL

Recommendation:

"Deploy maximum police presence and prioritize traffic monitoring."

Add:

[ VIEW ON MAP ]

and a close/back control.

This panel should feel like a professional operational information pane.

==================================================

16. TRAFFIC STATUS SYSTEM

==================================================

Use these categories consistently:

LOW / NORMAL

Green

MODERATE

Amber

HIGH / CRITICAL

Red

ACTIVE / ROUTE

Blue

Do not invent additional traffic colors.

Every traffic-related color must have a clear meaning.

==================================================

17. ALERTS PAGE

==================================================

Create an Alerts section.

Display traffic-risk alerts in a compact list.

Example:

CRITICAL

Sitabuldi

Risk score 81.5

4 police units recommended

HIGH

Wardha Road

Risk score 66.6

2 police units recommended

HIGH

Sadar

Risk score 64.2

2 police units recommended

Each alert should have:

severity

location

risk score

short recommendation

timestamp/status

Allow the user to click an alert and focus the location on the map.

Do not create fake notification spam.

==================================================

18. ANALYTICS DASHBOARD

==================================================

Create a professional analytics page.

Use the existing RAASTA traffic/risk information.

Top summary metrics:

Total Locations

5

Critical Locations

1

Moderate Locations

3

Low Locations

1

Average Risk Score

59.44

Total Police Units

11

Then show:

Risk Distribution

Traffic / Risk by Location

Police Deployment Recommendations

Use clean charts.

Prefer Recharts.

Charts should be functional and readable.

Avoid excessive charts.

Recommended charts:

1. Risk score by location — bar chart

2. Traffic/risk distribution — simple chart

3. Police units by location — bar chart

Do not fill the screen with graphs.

==================================================

19. EXISTING BACKEND API INTEGRATION

==================================================

IMPORTANT:

RAASTA already has a FastAPI backend.

The frontend must be designed to consume these APIs.

Backend base URL during development:

http://127.0.0.1:8000

Existing endpoints:

GET /api/traffic

Returns traffic data.

GET /api/risk

Returns calculated risk data including:

location

latitude

longitude

vehicle_count

accidents

congestion

time

risk_score

risk_level

priority

police_units

recommendation

GET /api/summary

Returns:

total_locations

high_risk_locations

medium_risk_locations

low_risk_locations

average_risk_score

highest_risk_location

highest_risk_score

total_police_units

IMPORTANT:

Create a clean API service layer.

For example:

src/services/api.js

Do not scatter fetch calls throughout components.

Use reusable API functions such as:

getTrafficData()

getRiskData()

getSummary()

Initially, if necessary, use fallback mock data while the backend is unavailable.

But clearly separate mock data from API logic.

==================================================

20. FRONTEND ARCHITECTURE

==================================================

Use:

React

Vite

Tailwind CSS

React Leaflet

Leaflet

Recharts

Lucide React

Use reusable components.

Suggested structure:

src/

  components/

    layout/

    map/

    traffic/

    dashboard/

    alerts/

    common/

  pages/

    Login.jsx

    Overview.jsx

    LiveMap.jsx

    Alerts.jsx

    Analytics.jsx

  services/

    api.js

  hooks/

    useTrafficData.js

    useRiskData.js

  data/

    mockData.js

  App.jsx

  main.jsx

Keep the code modular and maintainable.

==================================================

21. RESPONSIVENESS

==================================================

The application must work on:

Desktop

Laptop

Tablet

The primary target is desktop/laptop because this is an operational dashboard.

On smaller screens:

- collapse navigation

- stack information panels

- keep map usable

- avoid horizontal overflow

==================================================

22. ANIMATIONS

==================================================

Animations must be subtle.

Allowed:

150–200ms hover transitions

Panel slide-in

Small opacity transitions

Map marker appearance

Subtle live-status pulse

Button hover states

Avoid:

large page transitions

parallax

scroll animations everywhere

glowing effects

particle effects

animated gradients

3D animations

excessive bouncing

The application should feel fast.

==================================================

23. MAP CONTROLS

==================================================

Keep map controls minimal.

Include:

Zoom in

Zoom out

Current location

Optional:

Map layer toggle

Do NOT create complex military-style map controls.

No unnecessary compass/battle-space/grid systems.

==================================================

24. DATA DENSITY

==================================================

The interface should be information-dense but organized.

Prefer:

small labels

compact rows

thin separators

clear alignment

Avoid:

huge cards

massive empty spaces

excessive rounded containers

marketing-style sections

The user should be able to scan the dashboard quickly.

==================================================

25. ACCESSIBILITY

==================================================

Use sufficient contrast.

Buttons must have clear labels.

Icons should have tooltips where necessary.

Do not communicate critical information only through color.

For example:

RED + "CRITICAL"

not simply a red dot.

==================================================

26. EMPTY / LOADING / ERROR STATES

==================================================

Create proper states.

Loading:

small professional loading indicator

API error:

"Unable to load traffic data."

Empty state:

"No traffic data available."

Do not use fake loading animations for long periods.

==================================================

27. DO NOT DO THESE THINGS

==================================================

Absolutely avoid:

- AI chatbot

- AI assistant

- excessive AI terminology

- "Powered by AI" everywhere

- neon cyberpunk design

- purple/blue/pink gradient backgrounds

- glowing cards

- glassmorphism everywhere

- excessive rounded cards

- excessive shadows

- animated particles

- futuristic 3D graphics

- excessive page transitions

- decorative illustrations

- unnecessary gamification

- excessive charts

- unnecessary pages

- fake statistics

- fake real-time claims

- military terminology

- military assets

- weapons

- tactical targeting concepts

- copying Palantir/Gotham branding or interface directly

RAASTA should be inspired by professional geospatial software, not copied from any existing product.

==================================================

28. BRANDING

==================================================

Product name:

RAASTA

Use uppercase "RAASTA" in the interface.

Possible tagline:

"Navigate smarter. Travel safer."

Keep branding subtle.

Do not create a huge logo.

==================================================

29. MVP PRIORITY

==================================================

Prioritize functionality in this order:

1. Main map

2. Traffic markers

3. Traffic location panel

4. Location details

5. Risk visualization

6. Backend API integration structure

7. Navigation / route UI

8. Dashboard

9. Alerts

10. Login

The map and traffic intelligence are the heart of the product.

==================================================

30. FINAL UX GOAL

==================================================

When a user opens RAASTA, they should immediately understand:

"Where am I?"

"What is traffic like around me?"

"Which areas are risky?"

"Which route should I take?"

"Where are the critical traffic locations?"

"Where may police deployment be required?"

The interface should answer those questions within seconds.

The final result should feel like:

A professional urban traffic navigation and decision-support product.

NOT:

An AI-generated dashboard.

NOT:

A futuristic concept website.

NOT:

A marketing landing page.

Focus on clarity, trust, speed, geospatial visualization, and useful information.

Build the frontend now with clean reusable React components and a structure ready to connect to the existing FastAPI backend.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d3ff75cc-880a-4129-834e-fa5e67e8a0f4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
