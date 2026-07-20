'use client';

import type { IconType } from 'react-icons';
import {
  SiPython, SiCplusplus, SiTypescript, SiJavascript, SiReact, SiNextdotjs,
  SiNodedotjs, SiDjango, SiFlask, SiFastapi, SiTensorflow, SiPytorch,
  SiScikitlearn, SiHuggingface, SiPandas, SiNumpy, SiMongodb, SiPostgresql,
  SiMysql, SiRedis, SiDocker, SiGooglecloud, SiGit, SiFigma, SiOpenai,
  SiKubernetes, SiApachekafka, SiLangchain, SiRust, SiLinux, SiNvidia,
  SiOnnx, SiOpencv, SiRabbitmq, SiAmazondynamodb, SiSupabase, SiTerraform,
  SiArgo, SiPrometheus, SiGrafana, SiPostman,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';

type Skill = { name: string; Icon: IconType; color: string };

// Curated, brand-colored. Dark logos get a visible-on-dark color.
const SKILLS: Skill[] = [
  // languages
  { name: 'Python', Icon: SiPython, color: '#7FE0C2' },
  { name: 'Rust', Icon: SiRust, color: '#DEA584' },
  { name: 'C++', Icon: SiCplusplus, color: '#00A6F0' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
  // AI / ML
  { name: 'PyTorch', Icon: SiPytorch, color: '#EE4C2C' },
  { name: 'TensorFlow', Icon: SiTensorflow, color: '#FF6F00' },
  { name: 'scikit-learn', Icon: SiScikitlearn, color: '#F7931E' },
  { name: 'Hugging Face', Icon: SiHuggingface, color: '#FFD21E' },
  { name: 'CUDA', Icon: SiNvidia, color: '#76B900' },
  { name: 'ONNX', Icon: SiOnnx, color: '#C7D0D6' },
  { name: 'OpenCV', Icon: SiOpencv, color: '#7A5CFF' },
  { name: 'LangChain', Icon: SiLangchain, color: '#7FE0C2' },
  { name: 'OpenAI', Icon: SiOpenai, color: '#E5E7EB' },
  { name: 'NumPy', Icon: SiNumpy, color: '#4DABCF' },
  { name: 'Pandas', Icon: SiPandas, color: '#C7A6FF' },
  // web / backend
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', Icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'Django', Icon: SiDjango, color: '#44B78B' },
  { name: 'Flask', Icon: SiFlask, color: '#E5E7EB' },
  { name: 'FastAPI', Icon: SiFastapi, color: '#05998B' },
  // messaging
  { name: 'Kafka', Icon: SiApachekafka, color: '#C7D0D6' },
  { name: 'RabbitMQ', Icon: SiRabbitmq, color: '#FF7A33' },
  { name: 'Redis', Icon: SiRedis, color: '#FF6B5E' },
  // databases
  { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4DA3FF' },
  { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
  { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
  { name: 'DynamoDB', Icon: SiAmazondynamodb, color: '#5B72E8' },
  { name: 'Supabase', Icon: SiSupabase, color: '#3ECF8E' },
  // cloud / infra
  { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
  { name: 'Kubernetes', Icon: SiKubernetes, color: '#5C8DEF' },
  { name: 'AWS', Icon: FaAws, color: '#FF9900' },
  { name: 'GCP', Icon: SiGooglecloud, color: '#4285F4' },
  { name: 'Terraform', Icon: SiTerraform, color: '#9A78FF' },
  { name: 'Argo CD', Icon: SiArgo, color: '#EF7B4D' },
  { name: 'Prometheus', Icon: SiPrometheus, color: '#E6522C' },
  { name: 'Grafana', Icon: SiGrafana, color: '#F58A2B' },
  { name: 'Linux', Icon: SiLinux, color: '#F0C040' },
  // dev tools
  { name: 'Git', Icon: SiGit, color: '#F05032' },
  { name: 'Postman', Icon: SiPostman, color: '#FF6C37' },
  { name: 'Figma', Icon: SiFigma, color: '#F24E1E' },
];

function Pill({ name, Icon, color }: Skill) {
  return (
    <div className="group mx-2 flex shrink-0 items-center gap-2.5 rounded-lg border border-hair bg-surface px-4 py-2.5 transition-colors duration-200 hover:border-hair-strong">
      <Icon
        size={20}
        className="shrink-0 opacity-80 transition-opacity group-hover:opacity-100"
        style={{ color }}
      />
      <span className="font-mono text-sm text-muted transition-colors group-hover:text-ink">
        {name}
      </span>
    </div>
  );
}

function Row({ items, reverse, dur }: { items: Skill[]; reverse?: boolean; dur: string }) {
  return (
    <div className="marquee overflow-hidden py-1.5">
      <div
        className={`marquee-track ${reverse ? 'reverse' : ''}`}
        style={{ ['--marquee-dur' as string]: dur }}
      >
        {/* duplicated track for seamless loop */}
        {[...items, ...items].map((s, i) => (
          <Pill key={`${s.name}-${i}`} {...s} />
        ))}
      </div>
    </div>
  );
}

export default function SkillsMarquee() {
  const mid = Math.ceil(SKILLS.length / 2);
  const rowA = SKILLS.slice(0, mid);
  const rowB = SKILLS.slice(mid);
  return (
    <div className="space-y-1">
      <Row items={rowA} dur="46s" />
      <Row items={rowB} reverse dur="52s" />
    </div>
  );
}
