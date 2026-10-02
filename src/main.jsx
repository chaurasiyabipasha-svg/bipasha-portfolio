import React, { useRef, useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import {
  Shield,
  Terminal as TerminalIcon,
  Code2,
  Cpu,
  Globe,
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  ArrowUpRight,
  Radar,
  Lock,
  Layers,
  BookOpen,
  Award,
  ChevronRight,
  Sparkles,
  Search,
  Compass,
  CheckCircle2,
  Activity,
  Server
} from 'lucide-react';
import './styles.css';

// --- 3D Cyber Core Scene ---
function CyberParticles({ count = 450 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color('#35d7ff');
    const blue = new THREE.Color('#0e5a8a');
    const white = new THREE.Color('#a6efff');

    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const chosenColor = Math.random() > 0.6 ? white : (Math.random() > 0.3 ? cyan : blue);
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function CyberCore() {
  const innerRef = useRef();
  const middleRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.5;
      innerRef.current.rotation.y += delta * 0.65;
    }
    if (middleRef.current) {
      middleRef.current.rotation.x -= delta * 0.3;
      middleRef.current.rotation.z += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.35;
      ring2Ref.current.rotation.z = Math.cos(t * 0.25) * 0.25;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <group>
        {/* Core glowing icosahedron */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial
            color="#35d7ff"
            wireframe
            emissive="#126e8a"
            emissiveIntensity={0.7}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Central solid energy crystal */}
        <mesh>
          <octahedronGeometry args={[0.45, 0]} />
          <meshBasicMaterial color="#a6efff" wireframe={false} />
        </mesh>

        {/* Middle wireframe sphere */}
        <mesh ref={middleRef}>
          <sphereGeometry args={[1.35, 16, 16]} />
          <meshStandardMaterial
            color="#147291"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Orbital Shield Ring 1 */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.8, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#35d7ff"
            emissive="#35d7ff"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Orbital Shield Ring 2 */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.05, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#68d8d6"
            emissive="#126e8a"
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Ambient point lights */}
        <pointLight color="#35d7ff" intensity={2.5} distance={5} />
        <pointLight color="#a6efff" position={[1, 2, 2]} intensity={1.5} />
        <CyberParticles count={380} />
      </group>
    </Float>
  );
}

function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.8], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 4]} intensity={1.2} />
      <CyberCore />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
}

// --- Main App Component ---
function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const skills = [
    {
      icon: <Shield className="skill-icon" size={24} />,
      title: 'Cyber Security',
      desc: 'Threat Intelligence, Defensive Ops, Secure Code Practices'
    },
    {
      icon: <Radar className="skill-icon" size={24} />,
      title: 'Geospatial & SAR',
      desc: 'Google Earth Engine, SAR Radar, Remote Sensing Analysis'
    },
    {
      icon: <Code2 className="skill-icon" size={24} />,
      title: 'Software Development',
      desc: 'Modern JavaScript, React, Python, Web Architectures'
    },
    {
      icon: <Cpu className="skill-icon" size={24} />,
      title: 'AI & Data Insights',
      desc: 'Model integration, Meteorological Modeling, Structured Decision Logic'
    },
    {
      icon: <Server className="skill-icon" size={24} />,
      title: 'Network & Systems',
      desc: 'TCP/IP Fundamentals, Linux Environments, System Hardening'
    },
    {
      icon: <Layers className="skill-icon" size={24} />,
      title: 'Cloud & Prototyping',
      desc: 'Vercel, Git Collaboration, Rapid Interactive Mockups'
    },
    {
      icon: <Globe className="skill-icon" size={24} />,
      title: 'Digital Marketing & Growth',
      desc: 'Analytics, Digital Outreach, User Journey Optimization'
    },
    {
      icon: <Sparkles className="skill-icon" size={24} />,
      title: 'Interactive 3D Web',
      desc: 'Three.js, WebGL Visualization, Modern UI/UX Engineering'
    }
  ];

  const hackathons = [
    {
      id: '01',
      type: 'DISASTER INTELLIGENCE // GEOSPATIAL DEFENSE',
      title: 'Cyclone Intelligence & Evacuation Support System',
      lead: 'Team Leader: Krishna Shukla',
      members: 'Members: Vikash Singh, Harshit Sharma, Bipasha Chourasiya',
      desc: 'A comprehensive decision-support system leveraging Google Earth Engine, Synthetic Aperture Radar (SAR) imagery, and Open-Meteo meteorological telemetry. Engineered to calculate cyclone propagation tracks, velocity vectors, precipitation footprints, and flood vulnerability zones to support rapid, data-backed evacuation operations.',
      tags: ['Google Earth Engine', 'SAR', 'Open-Meteo', 'Geospatial Mapping', 'Flood-Risk Analytics', 'Decision Support'],
      link: 'https://code-for-community-night-coders-pca4apjsy.vercel.app'
    },
    {
      id: '02',
      type: 'CAMPUS MOBILITY // SMART INFRASTRUCTURE',
      title: 'FIND_Us — Smart University Finder',
      lead: 'Team: Sachin Kushwah, Krishna Shukla, Bhavna Baghel, Garima Singh, Dhruvmohan Kotwal, Bipasha Chourasiya',
      members: 'Tagline: "Find Faculty. Find Facilities. Find Your Way."',
      desc: 'An intuitive university navigation and locator platform enabling students and visitors to search faculty, academic departments, lecture halls, medical units, libraries, and athletic complexes. Designed with responsive spatial indexing and engineered for future AI-powered and AR indoor pathfinding.',
      tags: ['Smart Campus', 'Faculty Directory', 'Facility Search', 'Indoor Navigation Ready', 'SIH Prototype', 'Mobile-Friendly'],
      link: 'https://sih-hacathon-project-qkcy.vercel.app/'
    }
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <a href="#" className="brand">
          BIPASHA<span>.SEC</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#hackathons">Hackathons</a>
          <a href="#journey">Journey</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-cta">
          <span className="status-dot"></span>
          <span>AVAILABLE FOR RESEARCH & COLLABS</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="eyebrow">
            <span className="status-dot"></span>
            BIPASHA CHOURASIYA // B.TECH IT & CYBER SECURITY
          </div>

          <h1>
            BUILDING SECURE, <span>INTELLIGENT</span> SYSTEMS.
          </h1>

          <p className="hero-text">
            Undergraduate technologist at <strong>Amity University</strong> specializing in{' '}
            <strong>Information Technology & Cyber Security</strong> (Class of 2029).
            Active member of the <strong>Amity Coding Club</strong>, creating at the intersection of
            defensive security, geospatial decision tools, and modern web software.
          </p>

          <div className="hero-objective">
            "Committed to developing robust computational architectures, analyzing emerging cyber threats,
            and engineering high-impact tools that safeguard communities and organizations."
          </div>

          <div className="hero-actions">
            <a href="#hackathons" className="button primary">
              <span>View Hackathons & Work</span>
              <ArrowUpRight size={16} />
            </a>
            <a href="#about" className="button ghost">
              <span>System Specs & Bio</span>
              <TerminalIcon size={16} />
            </a>
          </div>

          <div className="mini-stats">
            <div>
              <strong>2029</strong>
              <span>GRADUATION YEAR</span>
            </div>
            <div>
              <strong>2+</strong>
              <span>MAJOR HACKATHONS</span>
            </div>
            <div>
              <strong>4</strong>
              <span>LANGUAGES</span>
            </div>
            <div>
              <strong>SEC/AI</strong>
              <span>CORE FOCUS</span>
            </div>
          </div>
        </motion.div>

        {/* 3D Scene Container */}
        <div className="scene-wrap">
          <div className="scene-label top">
            <Radar size={14} className="cyan" />
            <span>INTERACTIVE CORE // THREE.JS FIBER</span>
          </div>
          <Scene3D />
          <div className="scene-label bottom">
            <span>ROTATION & SHIELD ORBIT ACTIVE</span>
          </div>
        </div>

        <div className="scroll-hint">
          <ChevronRight size={12} className="cyan" />
          <span>SCROLL TO INITIALIZE TELEMETRY</span>
        </div>
      </header>

      {/* Section: About & Architecture */}
      <section id="about" className="section">
        <div className="section-heading">
          <span>// 01 ARCHITECTURE & FOCUS</span>
          <h2>
            SECURITY MINDSET, <span>ENGINEERING EXCELLENCE</span>
          </h2>
        </div>

        <div className="about-grid">
          <motion.div
            className="about-card big"
            whileHover={{ translateY: -3 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bio-header">
              <div className="bio-photo-wrapper">
                <div className="bio-photo-frame">
                  <img
                    src="/profile.jpg"
                    alt="Bipasha Chourasiya"
                    className="bio-photo"
                  />
                  <div className="bio-photo-scanline"></div>
                  <div className="bio-photo-glow"></div>
                  <div className="bio-photo-corner top-left"></div>
                  <div className="bio-photo-corner top-right"></div>
                  <div className="bio-photo-corner bottom-left"></div>
                  <div className="bio-photo-corner bottom-right"></div>
                </div>
                <div className="bio-photo-tag">
                  <span className="status-dot"></span>
                  <span>SECURITY SPECIALIST</span>
                </div>
              </div>

              <div className="bio-intro">
                <div className="eyebrow" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={14} className="cyan" />
                  <span>PERSONNEL FILE // BIPASHA CHOURASIYA</span>
                </div>
                <p>
                  I bridge the gap between algorithmic problem-solving, cybersecurity defense, and practical
                  full-stack development. Whether processing geospatial Synthetic Aperture Radar (SAR) datasets
                  for disaster evacuation or architecting high-availability web platforms, my work focuses on
                  stability, clarity, and security.
                </p>
              </div>
            </div>

            <div className="bio-footer-meta">
              <div className="eyebrow">
                AFFILIATION: AMITY UNIVERSITY • AMITY CODING CLUB MEMBER
              </div>
              <div className="bio-badge-pill">
                CLEARANCE: LEVEL-4
              </div>
            </div>
          </motion.div>

          {/* Interactive Cyber Terminal */}
          <div className="terminal">
            <div className="terminal-bar">
              <span></span>
              <span></span>
              <span></span>
              <b>bipasha@amity-cyber:~ (zsh)</b>
            </div>
            <pre>
{`$ whoami
> Bipasha Chourasiya (Chaurasiya)
> Major: B.Tech Information Technology & Cyber Security
> Institution: Amity University | Expected Graduation: 2029

$ cat focus_areas.json
{
  "domains": [
    "Cyber Security",
    "Artificial Intelligence",
    "Disaster Decision Support",
    "Digital Marketing & Growth",
    "Modern Web Technology"
  ],
  "status": "Active Student & Club Member"
}

$ echo $LANGUAGES
> English (Fluent), Hindi (Native), French (Beginner), Chinese (Beginner/Learning)`}
            </pre>
          </div>
        </div>

        {/* Additional Detail Panels */}
        <div className="details-grid" style={{ marginTop: '20px' }}>
          <div className="detail-panel">
            <div className="project-type">ACADEMIC & CLUB INVOLVEMENT</div>
            <h3>Amity Coding Club</h3>
            <p>
              Engaged in community coding challenges, hackathon sprints, secure code audits, and peer technical
              exchanges. Focused on sharpening foundational computer science, algorithm analysis, and system architecture.
            </p>
            <div className="tags">
              <span>Amity University</span>
              <span>Coding Club</span>
              <span>Peer Mentorship</span>
              <span>Algorithm Practice</span>
            </div>
          </div>

          <div className="detail-panel">
            <div className="project-type">GLOBAL PERSPECTIVE</div>
            <h3>Linguistic Proficiency & Global Communication</h3>
            <p>
              Strong communicator across international contexts, currently broadening linguistic fluency to collaborate
              with global cyber intelligence and open-source engineering communities.
            </p>
            <div className="tags">
              <span>English (Proficient)</span>
              <span>Hindi (Native)</span>
              <span>French (Beginner)</span>
              <span>Chinese (Beginner/Learning)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Skills & Arsenal */}
      <section id="skills" className="section">
        <div className="section-heading">
          <span>// 02 CAPABILITIES & STACK</span>
          <h2>
            TECHNICAL <span>ARSENAL</span>
          </h2>
        </div>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div>
                {skill.icon}
                <h3>{skill.title}</h3>
              </div>
              <div>
                <p>{skill.desc}</p>
                <div className="skill-arrow">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Hackathons & Featured Projects */}
      <section id="hackathons" className="section">
        <div className="section-heading">
          <span>// 03 PROVEN IMPACT</span>
          <h2>
            HACKATHON <span>INITIATIVES</span>
          </h2>
        </div>

        <div className="hackathon-list">
          {hackathons.map((item) => (
            <div key={item.id} className="hackathon-card">
              <div className="hackathon-index">{item.id}</div>
              <div className="hackathon-body">
                <div className="project-type">{item.type}</div>
                <h3>{item.title}</h3>
                <div className="hackathon-team">
                  <strong>{item.lead}</strong> • {item.members}
                </div>
                <p>{item.desc}</p>
                <div className="tags">
                  {item.tags.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="project-link"
                title={`Launch ${item.title}`}
              >
                <ExternalLink size={18} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Academic Journey */}
      <section id="journey" className="section">
        <div className="section-heading">
          <span>// 04 TIMELINE & EDUCATION</span>
          <h2>
            ACADEMIC <span>JOURNEY</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="journey-card">
            <div className="journey-icon">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="project-type">UNDERGRADUATE DEGREE</div>
              <h3>B.Tech in Information Technology & Cyber Security</h3>
              <p>
                Amity University — Rigorous undergraduate curriculum covering networking fundamentals, cryptography,
                data structures, software design patterns, and defensive cyber security methodologies.
              </p>
            </div>
            <div className="journey-badge">EXPECTED GRADUATION: 2029</div>
          </div>

          <div className="journey-card">
            <div className="journey-icon">
              <Award size={24} />
            </div>
            <div>
              <div className="project-type">STUDENT LEADERSHIP & CODE COMMUNITY</div>
              <h3>Amity Coding Club — Active Member</h3>
              <p>
                Collaborating on hackathon problem statements, participating in algorithmic problem solving,
                and organizing peer discussions centered on cybersecurity preparedness and emerging tech.
              </p>
            </div>
            <div className="journey-badge">ACTIVE MEMBER</div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="orbit-dot"></div>
        <div className="contact-content">
          <div className="eyebrow">COMMUNICATION CHANNELS</div>
          <h2>
            LET'S SECURE <span>& INNOVATE</span>
          </h2>
          <p>
            Interested in collaborating on cybersecurity research, hackathon opportunities, or software development?
            Feel free to reach out.
          </p>

          <div className="contact-links">
            <a href="mailto:chaurasiyabipasha@gmail.com">
              <Mail size={16} className="cyan" />
              <span>chaurasiyabipasha@gmail.com</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github size={16} className="cyan" />
              <span>GitHub Profile</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <Linkedin size={16} className="cyan" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>
          © {new Date().getFullYear()} BIPASHA CHOURASIYA // AMITY UNIVERSITY
        </div>
        <div>
          CYBER SECURITY • GEOSPATIAL INTELLIGENCE • REACT THREE FIBER
        </div>
      </footer>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
