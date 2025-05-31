# Feel Like Me - Autism Empathy Simulator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-4.4.5-purple.svg)

**Feel Like Me** is an innovative SaaS platform that creates immersive, interactive experiences to help users understand and empathize with the autistic experience. Through scientifically-informed simulations, users can gain emotional and practical insights into sensory processing, social navigation, cognitive load, and self-regulation strategies that are part of daily life for many autistic individuals.

## 🎯 Mission

To bridge the empathy gap by allowing users to *experience* rather than just *learn about* autism, fostering deeper understanding, inclusivity, and support for the autistic community.

## 🌟 Key Features

### 🧠 Six Interactive Simulation Modules

#### 1. **Sensory Overload Simulator**

- **Experience**: Layered audio-visual stimuli with increasing intensity
- **Technologies**: Web Audio API, Canvas animations, dynamic visual effects
- **Learning**: Understanding sensory sensitivity and processing differences
- **Features**: Real-time intensity controls, emergency safety exits, customizable sensory profiles

#### 2. **Social Uncertainty Navigator**

- **Experience**: Navigate complex social scenarios with ambiguous cues
- **Technologies**: Interactive decision trees, contextual feedback systems
- **Learning**: Understanding social communication challenges and masking
- **Features**: Multiple-choice scenarios, consequence visualization, social cue highlighting

#### 3. **Cognitive Load Challenges**

- **Experience**: Multitasking with increasing distractions and demands
- **Technologies**: Dynamic task generation, real-time performance tracking
- **Learning**: Understanding executive function and processing differences
- **Features**: Memory, attention, and task-switching challenges with environmental stressors

#### 4. **Meltdown/Shutdown Simulator**

- **Experience**: Progressive overwhelm leading to emotional regulation breakdown
- **Technologies**: Biometric-inspired feedback, stress level visualization
- **Learning**: Understanding emotional regulation and the difference between meltdowns and tantrums
- **Features**: Physiological response simulation, recovery strategies, trigger identification

#### 5. **Stimming Studio**

- **Experience**: Explore self-regulation tools and sensory strategies
- **Technologies**: Interactive stimming tools, haptic feedback simulation
- **Learning**: Understanding stimming as self-regulation, not distraction
- **Features**: Virtual fidget tools, breathing exercises, movement patterns, regulation tracking

#### 6. **Hyperfocus Experience**

- **Experience**: Deep engagement with tasks while external awareness diminishes
- **Technologies**: Immersive UI, progressive environmental fade
- **Learning**: Understanding intense focus as both strength and challenge
- **Features**: Time distortion effects, attention tunnel simulation, transition difficulties

## 🏗️ Technical Architecture

### Frontend Stack

- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 4.4.5 for fast development and optimized builds
- **Styling**: Tailwind CSS for responsive, accessible design
- **Animations**: Framer Motion for smooth, meaningful transitions
- **Audio**: Tone.js for complex audio synthesis and spatial sound
- **State Management**: React Context API with custom hooks
- **Routing**: React Router DOM for seamless navigation

### Key Technical Features

- **Accessibility First**: WCAG 2.1 AA compliance with screen reader support
- **Safety Controls**: Emergency exits, pause functionality, and intensity limits
- **Progressive Enhancement**: Works across devices with graceful degradation
- **Real-time Feedback**: Dynamic visual and auditory response systems
- **Responsive Design**: Optimized for desktop, tablet, and mobile experiences

## 🎨 Design Philosophy

### User-Centered Design

- **Safety First**: Every module includes immediate exit options and intensity controls
- **Informed Consent**: Clear explanations of what users will experience
- **Customizable Experience**: Adjustable sensory settings and difficulty levels
- **Educational Context**: Pre and post-experience reflection and learning materials

### Accessibility Standards

- **Visual**: High contrast options, reduced motion settings, scalable fonts
- **Auditory**: Volume controls, audio descriptions, visual alternatives
- **Motor**: Keyboard navigation, adjustable timing, simplified interactions
- **Cognitive**: Clear instructions, progress indicators, break options

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Modern web browser with Web Audio API support

### Installation

1. **Clone the repository**

   ```bash
   git clone repo.git
   cd feel-like-me-app
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Start development server**

   ```bash
   npm run dev
   ```
4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
feel-like-me-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components (SafetyControls, etc.)
│   │   ├── layout/         # Layout components
│   │   └── modules/        # Simulation modules
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route-level components
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions and engines
├── public/                 # Static assets
├── docs/                   # Documentation
└── tests/                  # Test files
```

## 🎯 Target Audiences

### Primary Users

- **Educators**: Teachers, professors, and training professionals
- **Healthcare Providers**: Therapists, doctors, and support staff
- **Employers & HR**: Managers creating inclusive workplaces
- **Parents & Families**: Understanding and supporting autistic family members
- **Designers & Developers**: Creating accessible, inclusive products

### Use Cases

- **Educational Training**: Workshops and coursework on autism awareness
- **Professional Development**: Healthcare and education training programs
- **Workplace Inclusion**: Diversity and inclusion training for organizations
- **Product Design**: Understanding user needs for accessible technology
- **Personal Learning**: Individual exploration and understanding

## 🔧 Configuration

Safety Settings

The application includes comprehensive safety controls:

- **Emergency Exit**: Immediate escape from any simulation
- **Intensity Limits**: User-defined maximum stress levels
- **Pause Controls**: Temporary breaks during experiences
- **Progress Saving**: Resume experiences at any point

## 📊 Analytics & Insights

### User Experience Metrics

- **Engagement Time**: How long users spend in each module
- **Completion Rates**: Which experiences users complete
- **Safety Usage**: Frequency of emergency exits and pauses
- **Accessibility Features**: Usage of assistive technologies

### Educational Effectiveness

- **Reflection Quality**: Depth of user responses to reflection prompts
- **Empathy Scoring**: Quantitative measures of perspective-taking
- **Knowledge Retention**: Pre/post experience assessments
- **Behavior Change**: Long-term impact on inclusive practices

## 🛡️ Safety & Ethics

### Ethical Considerations

- **Informed Consent**: Clear information about experience intensity
- **Authentic Representation**: Developed with autistic community input
- **Avoiding Stigma**: Focusing on strengths and challenges equally
- **Privacy Protection**: No collection of sensitive personal data

### Safety Measures

- **Content Warnings**: Clear descriptions of potentially intense content
- **Gradual Exposure**: Progressive difficulty with user control
- **Support Resources**: Links to professional help and community support
- **Emergency Protocols**: Immediate access to calming resources

## 🤝 Contributing

We welcome contributions from the autism community, developers, educators, and advocates.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style and TypeScript conventions
- Include tests for new features
- Update documentation as needed
- Ensure accessibility compliance
- Get feedback from autistic community members

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Autistic Self-Advocates**: For sharing experiences and providing guidance
- **Researchers**: For scientific backing of simulation accuracy
- **Accessibility Experts**: For ensuring inclusive design
- **Beta Testers**: For valuable feedback and testing

## 📞 Support & Contact


- **Email Support**: lipuahmedazaz79@gmail.com

## 🔄 Roadmap

### Upcoming Features

- Currently i don't have enough push to continue and make this project stable.

### Research Initiatives

- **Efficacy Studies**: Measuring empathy and understanding outcomes
- **Accessibility Research**: Continuous improvement of inclusive design
- **Community Partnerships**: Collaboration with autism organizations
- **Educational Integration**: Curriculum development for schools and universities

---

**Feel Like Me** is more than a simulation platform—it's a bridge to understanding, empathy, and inclusion. By experiencing rather than just learning about autism, we can build a more accepting and supportive world for everyone.

*Built with ❤️ for understanding and inclusion*
