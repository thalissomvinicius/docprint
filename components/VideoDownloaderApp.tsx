import React, { useState } from 'react';
import { ArrowLeft, Download, Instagram, Youtube, Sparkles, AlertCircle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoDownloaderAppProps {
    onBack: () => void;
}

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'unknown';
type Status = 'idle' | 'loading' | 'success' | 'error';

export const VideoDownloaderApp: React.FC<VideoDownloaderAppProps> = ({ onBack }) => {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [detectedPlatform, setDetectedPlatform] = useState<Platform>('unknown');

    const detectPlatform = (url: string): Platform => {
        if (url.includes('instagram.com') || url.includes('instagr.am')) return 'instagram';
        if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) return 'tiktok';
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
        return 'unknown';
    };

    const handleUrlChange = (value: string) => {
        setUrl(value);
        const platform = detectPlatform(value);
        setDetectedPlatform(platform);
        if (status !== 'idle') {
            setStatus('idle');
            setDownloadUrl('');
            setErrorMessage('');
        }
    };

    const handleDownload = async () => {
        if (!url.trim()) {
            setStatus('error');
            setErrorMessage('Por favor, cole um link válido');
            return;
        }

        const platform = detectPlatform(url);
        if (platform === 'unknown') {
            setStatus('error');
            setErrorMessage('Plataforma não suportada. Use Instagram, TikTok ou YouTube.');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            // Cobalt.tools API endpoint
            const response = await fetch('https://api.cobalt.tools/api/json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url.trim(),
                    vCodec: 'h264',
                    vQuality: '720',
                    aFormat: 'mp3',
                    filenamePattern: 'basic',
                    isAudioOnly: false
                })
            });

            const data = await response.json();

            if (data.status === 'error' || data.status === 'rate-limit') {
                setStatus('error');
                setErrorMessage(data.text || 'Erro ao processar o link. Tente novamente.');
                return;
            }

            if (data.url) {
                setDownloadUrl(data.url);
                setStatus('success');
            } else if (data.picker && data.picker.length > 0) {
                // Multiple options available
                setDownloadUrl(data.picker[0].url);
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage('Não foi possível obter o link de download.');
            }
        } catch (error) {
            console.error('Download error:', error);
            setStatus('error');
            setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
        }
    };

    const getPlatformIcon = (platform: Platform) => {
        switch (platform) {
            case 'instagram': return <Instagram size={20} className="text-pink-600" />;
            case 'youtube': return <Youtube size={20} className="text-red-600" />;
            case 'tiktok': return <span className="text-base">🎵</span>;
            default: return <Download size={20} className="text-neutral-400" />;
        }
    };

    const getPlatformName = (platform: Platform) => {
        switch (platform) {
            case 'instagram': return 'Instagram';
            case 'youtube': return 'YouTube';
            case 'tiktok': return 'TikTok';
            default: return 'Desconhecida';
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-pink-50 via-white to-rose-50/50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-pink-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-rose-400/10 rounded-full blur-3xl" />
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
                        className="flex items-center gap-2 text-neutral-600 hover:text-pink-600 px-2 py-2 -mx-2 rounded-xl hover:bg-white/80 transition-all mb-4"
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
                            <Sparkles className="text-pink-600" size={28} />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Download de Vídeos</h1>
                    </div>
                    <p className="text-neutral-600 text-sm md:text-base">
                        Cole o link do vídeo do Instagram, TikTok ou YouTube
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-2xl mx-auto space-y-6">

                        {/* URL Input */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-pink-200 p-6 md:p-8 shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                                    <Download className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-neutral-900">Cole o Link</h3>
                                    {detectedPlatform !== 'unknown' && (
                                        <div className="flex items-center gap-2 mt-1">
                                            {getPlatformIcon(detectedPlatform)}
                                            <span className="text-sm text-neutral-600">
                                                {getPlatformName(detectedPlatform)} detectado
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <input
                                type="url"
                                value={url}
                                onChange={(e) => handleUrlChange(e.target.value)}
                                className="w-full px-4 md:px-5 py-4 text-base md:text-lg border-2 border-neutral-300 rounded-xl focus:ring-4 focus:ring-pink-400 focus:border-pink-500 transition-all shadow-sm"
                                placeholder="https://www.instagram.com/reel/..."
                                disabled={status === 'loading'}
                            />

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownload}
                                disabled={status === 'loading' || !url.trim()}
                                className="w-full mt-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold hover:from-pink-600 hover:to-rose-700 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-base md:text-lg"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={24} />
                                        <span>Baixar Vídeo</span>
                                    </>
                                )}
                            </motion.button>
                        </motion.div>

                        {/* Status Messages */}
                        <AnimatePresence mode="wait">
                            {status === 'success' && downloadUrl && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 shadow-lg"
                                >
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-green-900 mb-2">Vídeo Pronto!</h4>
                                            <p className="text-sm text-green-800 mb-4">
                                                Clique no botão abaixo para fazer o download
                                            </p>
                                            <a
                                                href={downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                                            >
                                                <Download size={20} />
                                                Fazer Download
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'error' && errorMessage && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 shadow-lg"
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
                                        <div>
                                            <h4 className="font-bold text-red-900 mb-1">Erro</h4>
                                            <p className="text-sm text-red-800">{errorMessage}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-blue-50/80 backdrop-blur-sm border-l-4 border-blue-500 p-5 rounded-xl shadow-sm"
                        >
                            <p className="text-sm md:text-base text-blue-900 flex items-start gap-2">
                                <span className="text-lg shrink-0">ℹ️</span>
                                <span>
                                    <span className="font-bold">Como usar:</span> Cole o link completo do vídeo e clique em "Baixar Vídeo".
                                    Funciona com vídeos públicos do Instagram, TikTok e YouTube.
                                </span>
                            </p>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
};
