import React, { useState, useEffect } from 'react';
import { ArrowLeft, QrCode as QrIcon, Sparkles, Download as DownloadIcon, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';

interface QRCodeGeneratorAppProps {
    onBack: () => void;
}

type QRType = 'text' | 'url' | 'pix' | 'whatsapp';

export const QRCodeGeneratorApp: React.FC<QRCodeGeneratorAppProps> = ({ onBack }) => {
    const [qrType, setQrType] = useState<QRType>('text');
    const [content, setContent] = useState('');
    const [qrDataURL, setQrDataURL] = useState('');
    const [copied, setCopied] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState('');

    // PIX fields
    const [pixKey, setPixKey] = useState('');
    const [pixName, setPixName] = useState('');
    const [pixCity, setPixCity] = useState('');
    const [pixAmount, setPixAmount] = useState('');

    // WhatsApp fields
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [whatsappMessage, setWhatsappMessage] = useState('');

    const generateQRCode = async (text: string) => {
        if (!text) return;

        try {
            const dataURL = await QRCode.toDataURL(text, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#1f2937',
                    light: '#ffffff'
                }
            });
            setQrDataURL(dataURL);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    const handleGenerate = async () => {
        let qrContent = '';

        switch (qrType) {
            case 'text':
            case 'url':
                qrContent = content;
                break;
            case 'pix':
                if (!pixKey) return;
                qrContent = `00020126${pixKey.length.toString().padStart(2, '0')}${pixKey}520400005303986${pixAmount ? `5802BR5913${pixName || 'Nome'}6009${pixCity || 'Cidade'}` : ''}6304`;
                break;
            case 'whatsapp':
                if (!whatsappNumber) return;
                const cleanNumber = whatsappNumber.replace(/\D/g, '');
                const message = whatsappMessage ? `&text=${encodeURIComponent(whatsappMessage)}` : '';
                qrContent = `https://wa.me/${cleanNumber}${message}`;
                break;
        }

        if (qrContent) {
            await generateQRCode(qrContent);
            if (qrType === 'whatsapp') {
                setWhatsappLink(qrContent);
            } else {
                setWhatsappLink('');
            }
        }
    };

    useEffect(() => {
        if (content && (qrType === 'text' || qrType === 'url')) {
            const timer = setTimeout(() => handleGenerate(), 500);
            return () => clearTimeout(timer);
        }
    }, [content, qrType]);

    const downloadQR = () => {
        if (!qrDataURL) return;
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.png`;
        link.href = qrDataURL;
        link.click();
    };

    const copyToClipboard = async () => {
        if (!qrDataURL) return;
        try {
            const blob = await (await fetch(qrDataURL)).blob();
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const copyLinkToClipboard = async () => {
        if (!whatsappLink) return;
        try {
            await navigator.clipboard.writeText(whatsappLink);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-indigo-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-purple-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-white/80 backdrop-blur-xl px-6 py-6 shadow-sm border-b border-white/20 shrink-0">
                    <button onClick={onBack} className="flex items-center gap-2 text-neutral-600 hover:text-indigo-600 px-2 py-2 -mx-2 rounded-xl hover:bg-white/80 transition-all mb-4">
                        <ArrowLeft size={20} />
                        <span className="font-medium text-sm">Voltar</span>
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}>
                            <Sparkles className="text-indigo-600" size={28} />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Gerador de QR Code</h1>
                    </div>
                    <p className="text-neutral-600 text-sm md:text-base">Crie QR Codes para PIX, URLs, WhatsApp e mais</p>
                </motion.div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-indigo-200 p-6 shadow-xl">
                            <label className="block text-sm md:text-base font-bold text-neutral-700 mb-3">Tipo de QR Code</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { type: 'text' as QRType, label: '📝 Texto', color: 'indigo' },
                                    { type: 'url' as QRType, label: '🔗 Link', color: 'blue' },
                                    { type: 'pix' as QRType, label: '💰 PIX', color: 'green' },
                                    { type: 'whatsapp' as QRType, label: '💬 WhatsApp', color: 'emerald' }
                                ].map(({ type, label, color }) => (
                                    <button key={type} onClick={() => { setQrType(type); setQrDataURL(''); }} className={`px-4 py-3 rounded-xl font-bold transition-all ${qrType === type ? `bg-gradient-to-r from-${color}-500 to-${color}-600 text-white shadow-xl` : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-indigo-200 p-6 md:p-8 shadow-xl">
                            {(qrType === 'text' || qrType === 'url') && (
                                <div>
                                    <label className="block text-sm md:text-base font-bold text-neutral-700 mb-2">{qrType === 'url' ? 'URL' : 'Texto'}</label>
                                    <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base resize-none" rows={4} placeholder={qrType === 'url' ? 'https://exemplo.com' : 'Digite seu texto aqui...'} />
                                </div>
                            )}

                            {qrType === 'pix' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2">Chave PIX *</label>
                                        <input type="text" value={pixKey} onChange={e => setPixKey(e.target.value)} className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" placeholder="email@exemplo.com" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-neutral-700 mb-2">Nome</label>
                                            <input type="text" value={pixName} onChange={e => setPixName(e.target.value)} className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-green-500 transition-all" placeholder="Seu nome" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-neutral-700 mb-2">Cidade</label>
                                            <input type="text" value={pixCity} onChange={e => setPixCity(e.target.value)} className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-green-500 transition-all" placeholder="Sua cidade" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2">Valor (opcional)</label>
                                        <input type="number" step="0.01" value={pixAmount} onChange={e => setPixAmount(e.target.value)} className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-green-500 transition-all" placeholder="0.00" />
                                    </div>
                                    <button onClick={handleGenerate} className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 shadow-xl">Gerar QR Code PIX</button>
                                </div>
                            )}

                            {qrType === 'whatsapp' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2">Número (com DDI) *</label>
                                        <input type="tel" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="5591912345678" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2">Mensagem (opcional)</label>
                                        <textarea value={whatsappMessage} onChange={e => setWhatsappMessage(e.target.value)} className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all resize-none" rows={3} placeholder="Olá! Gostaria de mais informações..." />
                                    </div>
                                    <button onClick={handleGenerate} className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-xl">Gerar QR Code WhatsApp</button>
                                </div>
                            )}
                        </motion.div>

                        {qrDataURL && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 p-8 text-center">
                                <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center justify-center gap-2">
                                    <QrIcon className="text-indigo-600" size={24} />
                                    Seu QR Code
                                </h3>

                                <img src={qrDataURL} alt="QR Code" className="mx-auto mb-6 rounded-xl shadow-lg" width={300} height={300} />

                                <div className="flex gap-3 justify-center flex-wrap">
                                    <button onClick={downloadQR} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-600 hover:to-purple-700 shadow-lg flex items-center gap-2">
                                        <DownloadIcon size={20} />
                                        Baixar PNG
                                    </button>
                                    <button onClick={copyToClipboard} className="px-6 py-3 rounded-xl bg-white border-2 border-indigo-300 text-indigo-700 font-bold hover:bg-indigo-50 shadow-lg flex items-center gap-2">
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                        {copied ? 'Copiado!' : 'Copiar'}
                                    </button>
                                </div>

                                {qrType === 'whatsapp' && whatsappLink && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                                        <label className="block text-sm font-bold text-emerald-900 mb-2 flex items-center gap-2">💬 Link do WhatsApp</label>
                                        <div className="flex gap-2">
                                            <input type="text" value={whatsappLink} readOnly className="flex-1 px-4 py-3 bg-white border-2 border-emerald-300 rounded-lg text-sm font-mono text-emerald-900 select-all" />
                                            <button onClick={copyLinkToClipboard} className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg flex items-center gap-2">
                                                {copiedLink ? <Check size={20} /> : <Copy size={20} />}
                                                {copiedLink ? 'Copiado!' : 'Copiar'}
                                            </button>
                                        </div>
                                        <p className="text-xs text-emerald-700 mt-2">✓ Compartilhe este link ou escaneie o QR Code acima</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
