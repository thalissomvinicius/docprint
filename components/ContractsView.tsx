import React from 'react';
import { FileText, ClipboardCheck, Home as HomeIcon, ArrowLeft, Sparkles, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from './ui/AnimatedCard';

interface ContractsViewProps {
    onSelectContract: (type: 'inspection' | 'rental' | 'sale') => void;
    onBack: () => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({ onSelectContract, onBack }) => {
    const contracts = [
        {
            type: 'inspection' as const,
            title: 'Contrato de Vistoria',
            description: 'Laudo de vistoria de imóvel para entrada ou saída',
            icon: ClipboardCheck,
            color: 'from-blue-500 to-blue-600',
            shadowColor: 'shadow-blue-500/30'
        },
        {
            type: 'rental' as const,
            title: 'Contrato de Aluguel',
            description: 'Contrato de locação residencial completo',
            icon: FileText,
            color: 'from-green-500 to-green-600',
            shadowColor: 'shadow-green-500/30'
        },
        {
            type: 'sale' as const,
            title: 'Contrato de Compra e Venda',
            description: 'Contrato de compra e venda de imóvel',
            icon: HomeIcon,
            color: 'from-purple-500 to-purple-600',
            shadowColor: 'shadow-purple-500/30'
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-white to-purple-50/50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white/70 backdrop-blur-xl border-b border-white/20 px-6 py-6 shrink-0 shadow-sm"
                >
                    <button
                        onClick={onBack}
                        className="text-neutral-600 hover:text-purple-600 mb-4 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/80 transition-all"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium text-sm">Voltar</span>
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <Sparkles className="text-purple-600" size={28} />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-neutral-900">Gerar Contratos</h1>
                    </div>
                    <p className="text-neutral-600 text-base">Selecione o tipo de contrato que deseja gerar</p>
                </motion.div>

                {/* Contract Cards */}
                <div className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3"
                    >
                        {contracts.map((contract) => {
                            const Icon = contract.icon;
                            return (
                                <motion.div key={contract.type} variants={item}>
                                    <AnimatedCard onClick={() => onSelectContract(contract.type)}>
                                        <button
                                            className="w-full bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/40 hover:border-purple-300 p-6 text-left transition-all shadow-lg hover:shadow-2xl active:scale-98 group cursor-pointer"
                                        >
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${contract.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg ${contract.shadowColor}`}>
                                                <Icon className="text-white" size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                                {contract.title}
                                            </h3>
                                            <p className="text-sm text-neutral-600 leading-relaxed">
                                                {contract.description}
                                            </p>
                                        </button>
                                    </AnimatedCard>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Info Note */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-5xl mx-auto mt-8 bg-blue-50/80 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 shadow-lg"
                    >
                        <div className="flex gap-3 items-start">
                            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-blue-900 leading-relaxed">
                                    <strong className="font-bold">Nota:</strong> Todos os campos são opcionais. Preencha apenas as informações que você possui.
                                    Os contratos gerados seguem formatos padrão, mas recomendamos consultar um profissional jurídico para casos específicos.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
