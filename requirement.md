# 📘 SaaS Product Frontend Req********uirement Document

**Project Name (Temporary):***Feel Like Me*
**Goal:** Help users step into the experience of being autistic through rich, interactive frontend simulations that evoke empathy and insight.
**Target Audiences:** Educators, employers, designers, parents, social workers, students, and curious individuals.

---

## 🧭 1. Product Purpose

* 🎯 Mission

To build emotional understanding of the autistic experience using engaging, interactive frontend simulations.

### 💡 Value Proposition

Unlike static content, this platform’s interactive interface lets users *feel* what many autistic people experience daily — delivering impactful understanding and empathy.

---

## 👥 2. User Personas


| Persona         | Description                                     | Goals                                                      |
| --------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| Teacher         | Primary school teacher with an autistic student | Wants to understand behaviors better and support learning  |
| UI/UX Designer  | Working on a public-facing app                  | Wants to ensure inclusive design and reduce cognitive load |
| Parent          | Raising a recently diagnosed child              | Seeking insight into meltdowns, sensitivity, and routines  |
| HR Manager      | In charge of employee well-being                | Wants to foster inclusive, neurodiverse workplace          |
| General Learner | Curious about autism                            | Seeks an emotional, not just clinical, understanding       |

---

## 📦 3. Core Frontend Modules and Features

### 🔊 A. **Sensory Overload Simulator**

**Frontend UI Features:**

* React + Web Audio API integration for layered soundscapes (alarms, voices, hums)
* Animated flickers and moving visual stimuli using Three.js or CSS keyframes
* Intensity slider using Tailwind UI components
* Voiceover play/pause toggle with captions

---

### 💬 B. **Social Uncertainty Simulator**

**Frontend UI Features:**

* Interactive multiple-choice scenario cards
* Emotion recognition challenge (avatars, images, subtle facial cues)
* Modal for feedback: "How sure were you?" with slider
* Side panel for autistic explanation/insight overlay

---

### 🧠 C. **Cognitive Load & Change Resistance**

**Frontend UI Features:**

* To-do list interface that mutates unexpectedly (removal, randomization)
* Alert boxes and overlapping modals simulating conflicting instructions
* Stress meter (progress bar or animated ring)
* "Calm" button with animation and background transition

---

### 💥 D. **Meltdown & Shutdown Simulators**

**Frontend UI Features:**

* Controlled overload buildup (countdown, flashing UI, unresponsiveness)
* Screen dimming, motion blur, disabled interaction states
* Option to recover with repetitive UI (clicking, tapping, tracing pattern)

---

### 🔁 E. **Stimming Studio**

**Frontend UI Features:**

* Interactive stimming tools (e.g., click and drag loops, rhythm pads)
* Real-time reduction of "stress" visual meter
* Testimonials overlaid as popup text or ambient sound clips

---

### 🔍 F. **Hyperfocus Challenge**

**Frontend UI Features:**

* Focus-based puzzle or cognitive game
* Timed distractions via toast notifications and overlays
* Transition effects for user disorientation
* Progress interrupted and resumed with difficulty

---

## 🎭 4. Interactive Storylines (Mini Campaigns)

**Frontend Structure:**

* Branching narrative UI with choice-based interface
* Visual journal that records choices and responses
* Narration toggle (on/off captions + audio playback)
* Avatar personalization for empathy alignment

---

## 🎨 5. Design Guidelines

* Consistent layout with accessible contrast (WCAG 2.1 AA or better)
* Motion use balanced with cognitive load (avoid excessive autoplay)
* Responsive design for mobile-first interaction
* Animation via Framer Motion for transitions
* Ambient soundscapes with user-controlled toggles

---

## 📊 6. Empathy Score & Reflection

**Frontend Features:**

* After each module, show reflection prompt (text input or multiple choice)
* Animated empathy score meter (radial, stars, badges)
* Option to save, download, or share insights
* Emoji-scale feedback prompt: "How did this feel?"

---

## 🧯 7. Ethical & Safety Guidelines (Frontend Implementation)

* Show opt-out button and allow pause/skip at any time
* Include intensity selector before each simulation begins
* Trigger warnings before overstimulation or disruption modules
* Calm mode UI to re-center user visually and emotionally

---

## 📈 8. Frontend-Driven Metrics of Success

* Completion rates of interactive modules
* Click-through on reflective prompts
* Reactions/emojis shared in experience journaling
* Time spent in simulations (by module)
