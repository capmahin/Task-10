# Batman 3D Story Project

Welcome to the Batman 3D Story project! This is an interactive web application that combines storytelling with 3D graphics to create an immersive Batman experience.

## Project Overview

This project showcases an interactive Batman story using Three.js for 3D rendering and GSAP for animations. The application features a split-screen layout with a scrolling narrative on the left and a dynamic 3D scene on the right that responds to the story.

## Key Features Implemented

### 1. Interactive 3D Batman Scene
- Created a detailed 3D Batman model with body, wings, ears, cape, and chest symbol
- Implemented a Gotham City skyline with buildings and dynamic lighting
- Added criminal characters that move around the scene
- Integrated OrbitControls for user camera manipulation

### 2. Dynamic Storytelling Experience
- Developed a four-section narrative that guides users through Batman's mission
- Implemented scroll-based navigation that triggers 3D scene transitions
- Created section-specific camera positions, lighting, and Batman poses
- Added visual effects that correspond to each story section

### 3. Interactive Elements
- Built a Batman-themed cube with interactive glow effect toggle
- Implemented a Bat-Signal activation feature
- Created responsive buttons with hover effects
- Added smooth animations for all interactive elements

### 4. Advanced 3D Techniques
- Used Three.js geometries (Sphere, Cone, Cylinder, Box, Capsule, Extrude) for model creation
- Implemented realistic lighting with Ambient, Directional, and Hemisphere lights
- Added shadow mapping for enhanced realism
- Utilized fog effects for atmospheric depth

### 5. Animation and Effects
- Integrated GSAP for smooth animations and transitions
- Created glowing effects for active story sections
- Implemented dynamic Batman movements and cape animations
- Added camera shake effects during action sequences

### 6. Responsive Design
- Designed a flexible layout that adapts to different screen sizes
- Created custom Batman-themed scrollbar positioned on the left side
- Implemented mobile-friendly layout adjustments
- Ensured proper scaling of 3D elements across devices

### 7. Technical Implementation
- Used Vite as the development server and build tool
- Leveraged ES modules for modern JavaScript development
- Implemented efficient animation loops with requestAnimationFrame
- Created separate scenes for different 3D elements

## Technologies Used

- **Three.js**: For 3D rendering and scene management
- **GSAP**: For advanced animations and transitions
- **Vite**: As the development server and build tool
- **HTML/CSS/JavaScript**: Core web technologies
- **lil-gui**: For potential future debugging controls

## How It Works

1. Users scroll through the story sections on the left side of the screen
2. Each section triggers a unique 3D scene configuration:
   - Section 1: Wide view of Batman in Gotham with auto-rotation
   - Section 2: Closer view of Batman in action with criminals appearing
   - Section 3: Unique camera angle showing Batman from below
   - Section 4: Front-facing view with fight scene animation
3. Interactive elements enhance the experience:
   - "Reveal Batman" button toggles glow effect on the Batman cube
   - "Signal For Help" button activates the Bat-Signal and triggers Batman's action mode

## Getting Started

### Prerequisites

Before you start, make sure you have Node.js installed on your machine: (https://nodejs.org/en/download/)

### Installation

Once you've cloned or downloaded this project file to your local machine, navigate to this project directory in your terminal.

Run the following command to install the necessary dependencies:

``` bash
npm install
```

### Running the project

To start the development server, run the following command:

``` bash
npm run dev
```

This will start the server and open your default browser to your localhost. The site will reload automatically as you make changes to your code.