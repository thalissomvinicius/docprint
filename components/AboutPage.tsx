import React from 'react';
import { NavState } from '../types';
import { FileText, Sparkles, Code2, ArrowRight, Github, Instagram, Phone, TrendingUp, ShieldCheck, Receipt, Download, Calculator, ArrowRightLeft, QrCode, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from './ui/AnimatedCard';

interface AboutPageProps {
    onNavigate: (page: NavState) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 pb-20 md:pb-0">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 md:px-8 py-20 md:py-32 text-center relative overflow-hidden flex-shrink-0"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover bg-center" />
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-8">
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <Sparkles size={48} className="mx-auto mb-4" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                        Portal do Corretor
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl leading-relaxed font-light">
                        Sua central de produtividade imobiliária. Digitalize, contrate e gerencie com eficiência.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            onClick={() => onNavigate('DASHBOARD')}
                            className="px-8 py-4 bg-white text-brand font-bold rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group text-lg"
                        >
                            Acessar Painel
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-7xl mx-auto px-4 md:px-6 py-16 w-full flex-1"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatedCard delay={0.1}>
                        <FeatureCard
                            icon={<FileText size={24} />}
                            title="Scanner & PDF"
                            description="Digitalize e edite documentos com qualidade profissional."
                            color="bg-blue-50 text-brand"
                            onClick={() => onNavigate('DOCPRINT')}
                        />
                    </AnimatedCard>

                    <AnimatedCard delay={0.2}>
                        <FeatureCard
                            icon={<TrendingUp size={24} />}
                            title="Índices"
                            description="Acompanhe IGPM, IPCA e Selic atualizados."
                            color="bg-green-50 text-green-600"
                            onClick={() => onNavigate('INDICES')}
                        />
                    </AnimatedCard>

                    <AnimatedCard delay={0.3}>
                        <FeatureCard
                            icon={<ShieldCheck size={24} />}
                            title="Contratos"
                            description="Gere contratos de aluguel e venda em segundos."
                            color="bg-purple-50 text-purple-600"
                            onClick={() => onNavigate('CONTRACTS')}
                        />
                    </AnimatedCard>

                    <AnimatedCard delay={0.4}>
                        <FeatureCard
                            icon={<Receipt size={24} />}
                            title="Recibos"
                            description="Crie recibos com assinatura digital."
                            color="bg-orange-50 text-orange-600"
                            onClick={() => onNavigate('RECEIPT')}
                        />
                    </AnimatedCard>

                    <AnimatedCard delay={0.5}>
                        <FeatureCard
                            icon={<Download size={24} />}
                            title="Download de Vídeos"
                            description="Baixe vídeos do Instagram, TikTok e YouTube."
                            color="bg-pink-50 text-pink-600"
                            onClick={() => onNavigate('DOWNLOADER')}
                        />
                    </AnimatedCard>

                    <AnimatedCard delay={0.6}>
                        <FeatureCard
                            icon={<Calculator size={24} />}
                            title="Calculadora Financeira"
                            description="Simule financiamentos SAC e Price."
                            color="bg-teal-50 text-teal-600"
                            onClick={() => onNavigate('CALCULATOR')}
                        />
                    </AnimatedCard>

                    <AnimatedCard delay={0.7}>
                        <FeatureCard
                            icon={<ArrowRightLeft size={24} />}
                            title="Conversor de Moedas"
                            description="Converta moedas em tempo real."
                            color="bg-cyan-50 text-cyan-600"
                            onClick={() => onNavigate('CONVERTER')}
                        />
                    </AnimatedCard>

                    <AnimatedCard delay={0.8}>
                        <FeatureCard
                            icon={<QrCode size={24} />}
                            title="Gerador de QR Code"
                            description="Crie QR Codes para PIX e WhatsApp."
                            color="bg-indigo-50 text-indigo-600"
                            onClick={() => onNavigate('QRCODE')}
                        />
                    </AnimatedCard>

                    <AnimatedCard delay={0.9}>
                        <FeatureCard
                            icon={<Newspaper size={24} />}
                            title="Notícias do Mercado"
                            description="Fique atualizado sobre o setor."
                            color="bg-amber-50 text-amber-600"
                            onClick={() => onNavigate('NEWS')}
                        />
                    </AnimatedCard>
                </div>
            </motion.div>

            {/* Developer Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 backdrop-blur-xl border-t border-white/20 py-16 px-4 md:px-6"
            >
                <div className="max-w-3xl mx-auto text-center px-2">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 text-brand mb-6"
                    >
                        <Code2 size={32} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-4">Sobre o Desenvolvedor</h2>
                    <p className="text-neutral-600 leading-relaxed mb-8 max-w-2xl mx-auto">
                        Desenvolvido por <span className="font-bold text-brand">Vinicius Dev</span>, desenvolvedor focado em criar soluções digitais modernas e eficientes.
                        Transformando ideias em código com qualidade e performance.
                    </p>

                    <div className="flex justify-center gap-3 flex-wrap px-4">
                        <SocialLink icon={<Github size={20} />} label="GitHub" href="https://github.com/thalissomvinicius" />
                        <SocialLink icon={<Instagram size={20} />} label="Instagram" href="https://instagram.com/eu._.vini" />
                        <SocialLink icon={<Phone size={20} />} label="WhatsApp" href="https://wa.me/5591991697664" />
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-neutral-50 py-8 text-center text-sm text-neutral-400 border-t border-neutral-200"
            >
                <p>© 2025 Portal do Corretor. Todos os direitos reservados.</p>
            </motion.footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, color, onClick }: any) => (
    <button
        onClick={onClick}
        className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col items-start gap-4 hover:shadow-lg transition-all text-left group h-full w-full"
    >
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-neutral-800 mb-1">{title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
        </div>
    </button>
);

const SocialLink = ({ icon, label, href }: any) => (
    <motion.a
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-brand hover:text-white transition-colors text-xs md:text-sm font-medium whitespace-nowrap"
    >
        {icon}
        <span>{label}</span>
    </motion.a>
);
