import React, { useState, useEffect } from 'react';
import { ArrowLeft, Newspaper, Sparkles, ExternalLink, RefreshCw, Loader2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsAppProps {
    onBack: () => void;
}

interface NewsArticle {
    title: string;
    description: string;
    url: string;
    source: string;
    publishedAt: string;
    imageUrl?: string;
}

export const NewsApp: React.FC<NewsAppProps> = ({ onBack }) => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Notícias mockadas para demonstração (em produção, usaria uma API real)
    const mockNews: NewsArticle[] = [
        {
            title: "Mercado imobiliário brasileiro cresce 15% em 2024",
            description: "Setor residencial lidera crescimento com alta demanda por imóveis de médio padrão nas principais capitais do país.",
            url: "#",
            source: "Portal Imobiliário",
            publishedAt: new Date().toISOString(),
            imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"
        },
        {
            title: "Taxa Selic em queda favorece financiamentos imobiliários",
            description: "Redução da taxa básica de juros estimula mercado de crédito e aquece vendas de imóveis no segundo semestre.",
            url: "#",
            source: "Economia News",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400"
        },
        {
            title: "Tecnologia transforma experiência de corretagem",
            description: "Ferramentas digitais e realidade virtual ganham espaço nas estratégias de venda de imóveis.",
            url: "#",
            source: "Tech Imóveis",
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"
        },
        {
            title: "Sustentabilidade: tendência no mercado imobiliário",
            description: "Imóveis com certificação verde e eficiência energética valorizam até 20% mais rápido.",
            url: "#",
            source: "Construção Verde",
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400"
        },
        {
            title: "Programa habitacional anuncia novas regras para 2025",
            description: "Governo amplia teto de renda e reduz juros para famílias de classe média.",
            url: "#",
            source: "Gov Notícias",
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
            imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400"
        },
        {
            title: "Investidores estrangeiros voltam ao mercado brasileiro",
            description: "Capital externo impulsiona desenvolvimento de empreendimentos de alto padrão.",
            url: "#",
            source: "Mercado Global",
            publishedAt: new Date(Date.now() - 18000000).toISOString(),
            imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400"
        }
    ];

    const fetchNews = async () => {
        setLoading(true);
        setError('');

        try {
            // Simula delay de API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Em produção, você usaria uma API real como:
            // const response = await fetch('https://newsapi.org/v2/everything?q=imóveis+mercado+imobiliário&language=pt&apiKey=SUA_CHAVE');
            // const data = await response.json();

            setNews(mockNews);
        } catch (err) {
            setError('Erro ao carregar notícias. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'Agora mesmo';
        if (diffHours < 24) return `Há ${diffHours}h`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `Há ${diffDays} dias`;
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-amber-50 via-white to-orange-50/50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-amber-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-orange-400/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white/80 backdrop-blur-xl px-6 py-6 shadow-sm border-b border-white/20 shrink-0"
                >
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 px-2 py-2 -mx-2 rounded-xl hover:bg-white/80 transition-all mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium text-sm">Voltar</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 mb-2">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            >
                                <Sparkles className="text-amber-600" size={28} />
                            </motion.div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Notícias do Mercado</h1>
                                <p className="text-neutral-600 text-sm md:text-base">Fique atualizado sobre o mercado imobiliário</p>
                            </div>
                        </div>

                        <button
                            onClick={fetchNews}
                            disabled={loading}
                            className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            <span className="hidden md:inline">Atualizar</span>
                        </button>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-5xl mx-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin text-amber-600 mb-4" size={48} />
                                <p className="text-neutral-600 text-lg">Carregando notícias...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                                <p className="text-red-700 font-medium">{error}</p>
                                <button
                                    onClick={fetchNews}
                                    className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {news.map((article, index) => (
                                    <motion.article
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-neutral-200 group cursor-pointer"
                                        onClick={() => window.open(article.url, '_blank')}
                                    >
                                        {article.imageUrl && (
                                            <div className="relative h-48 overflow-hidden bg-neutral-100">
                                                <img
                                                    src={article.imageUrl}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                <div className="absolute bottom-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                                                    <TrendingUp size={12} className="inline mr-1" />
                                                    {article.source}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-neutral-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                                                {article.description}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-neutral-500">
                                                <span>{formatDate(article.publishedAt)}</span>
                                                <ExternalLink size={14} className="text-amber-600" />
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        )}

                        {/* Info Banner */}
                        {!loading && !error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 bg-blue-50/80 backdrop-blur-sm border-l-4 border-blue-500 p-5 rounded-xl shadow-sm"
                            >
                                <p className="text-sm md:text-base text-blue-900">
                                    <Newspaper size={16} className="inline mr-2" />
                                    <strong className="font-bold">💡 Dica:</strong> Mantenha-se informado sobre as tendências do mercado imobiliário para oferecer o melhor atendimento aos seus clientes!
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
