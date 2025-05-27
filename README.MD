# Jaze Buddha Initiative - ATOL & Songlines Simulator

This project is an interactive 3D simulation built with Three.js, conceptualizing elements of the ".11d Jaze Buddha Initiative." It combines a ternary quantum logic gate sandbox with a drivable ATOL (Amphibious Take-Off and Landing) vehicle in a conceptual landscape representing Bramhope, Leeds, UK, intertwined with "songlines."

## Features

* **Ternary Logic Sandbox:**
    * Visualize three dodecahedrons representing input trits (A and B) and an output trit.
    * Select ternary states (-1, 0, +1) for inputs.
    * Apply various binary emulation and conceptual ternary logic gates.
    * Observe visual changes in trit color/animation based on state.
    * View output metrics.
* **ATOL Vehicle:**
    * A 3D model of a futuristic amphibious VTOL vehicle.
    * Keyboard and on-screen joystick controls for navigation (pitch, yaw, altitude, forward/backward).
    * "Ignite ATOL Core" functionality.
    * "Selfie Cam" mode for a third-person chase view of the ATOL.
* **Vitruvian Man & Chakras:**
    * A central 3D figure representing Vitruvian Man with seven visible chakras.
    * Conceptual energy flow animation (crown to aether, grounding to feet).
    * Aura color picker influences energy flow and ATOL accent colors.
* **Conceptual Environment:**
    * A "Quantum Field Plane" and "Infinity Loop" visual.
    * An abstract representation of Bramhope district, Leeds, with procedurally generated terrain elements.
    * Symbolic "songlines" (glowing paths) within the environment.

## How to Run

1.  Ensure all files (`index.html`, `css/style.css`, `js/main.js`) are in the correct folder structure:
    ```
    project-root/
    ├── index.html
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── README.md
    ```
2.  Open `index.html` in a modern web browser that supports WebGL (e.g., Chrome, Firefox, Edge, Safari).
3.  No local server is strictly necessary for this version as all assets (Three.js, Tailwind CSS) are loaded from CDNs and there are no local file restrictions being hit.

## Controls

* **Logic Sandbox:** Use the UI panels on the left to set trit inputs and select logic gates.
* **ATOL Vehicle (Keyboard):**
    * W/S: Pitch ATOL nose up/down.
    * A/D: Yaw (turn) ATOL left/right.
    * Q/E: Increase/Decrease Altitude.
    * Arrow Up/Down: Move ATOL forward/backward.
    * Shift (Hold): Speed boost.
* **ATOL Vehicle (On-Screen Joystick - Bottom Right):**
    * Drag the knob to control Yaw (left/right) and Thrust (forward/backward).
* **ATOL Controls Panel (Top Right):**
    * "Ignite ATOL Core": Activates/deactivates ATOL movement.
    * "Toggle Selfie Cam": Switches camera views.
    * Color Picker: Changes Vitruvian aura and ATOL accent color.

## Conceptual Basis

This simulator is a creative exploration of ideas from the ".11d Jaze Buddha Initiative," blending quantum concepts, philosophical underpinnings, and futuristic technology visions.
