import React, { useEffect, useState } from 'react';
import { Upload, FileImage, Camera, ClipboardPaste, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { FileInput } from './ui/FileInput';
import { useToast } from '../contexts/ToastContext';
import { validateFiles, verifyImageIntegrity } from '../utils/fileValidation';
import { convertPdfToImages } from '../utils/pdfProcessor';
import { BottomSheet } from './ui/BottomSheet';
import { haptics } from '../utils/haptics';

interface UploadViewProps {
  onUpload: (files: File[]) => void;
  onBack: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onUpload, onBack }) => {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const toast = useToast();

  // Handle file input changes with validation
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    // Validate files
    const { validFiles, errors } = validateFiles(files);

    // Show errors as toasts
    errors.forEach(({ file, error }) => {
      toast.error(`${file.name}: ${error.message}`);
    });

    // Process valid files
    if (validFiles.length > 0) {
      const processedFiles: File[] = [];

      for (const file of validFiles) {
        if (file.type === 'application/pdf') {
          try {
            toast.info(`Processando PDF: ${file.name}...`);
            const images = await convertPdfToImages(file);

            // Convert data URLs to File objects
            for (let i = 0; i < images.length; i++) {
              const response = await fetch(images[i]);
              const blob = await response.blob();
              const imageFile = new File(
                [blob],
                `${file.name.replace('.pdf', '')}_page${i + 1}.jpg`,
                { type: 'image/jpeg' }
              );
              processedFiles.push(imageFile);
            }

            toast.success(`${images.length} página(s) extraída(s) de ${file.name}`);
          } catch (error) {
            console.error('PDF processing error:', error);
            toast.error(`Erro ao processar PDF: ${file.name}`);
          }
        } else {
          processedFiles.push(file);
        }
      }

      if (processedFiles.length > 0) {
        onUpload(processedFiles);
      }
    }
  };

  // Handle Paste Event (Ctrl+V)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        await handleFilesSelected(files);
        e.preventDefault();
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handleFilesSelected]);

  // Handle Right Click / Long Press
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    haptics.light(); // Feedback tátil ao abrir menu
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  // Handle Paste from Custom Menu or Button
  const handlePasteFromMenu = async () => {
    setMenuPosition(null);
    try {
      if (!navigator.clipboard) {
        toast.warning("Seu navegador não suporta acesso à área de transferência. Use Ctrl+V.");
        return;
      }

      if (!navigator.clipboard.read) {
        toast.warning("A leitura de imagens da área de transferência não está habilitada neste navegador. Tente usar Ctrl+V.");
        return;
      }

      const clipboardItems = await navigator.clipboard.read();
      const files: File[] = [];

      for (const item of clipboardItems) {
        const imageType = item.types.find(type => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], "pasted-image.png", { type: imageType });
          files.push(file);
        }
      }

      if (files.length > 0) {
        await handleFilesSelected(files);
      } else {
        toast.info("Nenhuma imagem encontrada na área de transferência para colar.");
      }
    } catch (err: any) {
      console.warn("Clipboard access failed:", err);
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        toast.error("O navegador bloqueou o acesso à área de transferência por segurança.\n\nPor favor, use o atalho Ctrl+V (ou Command+V) para colar a imagem.");
      } else {
        toast.error("Não foi possível colar automaticamente. Por favor, use Ctrl+V.");
      }
    }
  };

  // Close menu on click elsewhere
  useEffect(() => {
    const handleClick = () => setMenuPosition(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="flex flex-col h-full relative overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-full items-center p-6 pt-4">
        {/* Back Button - Fixed position on mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full flex justify-start mb-4 z-20"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-600 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-white/80 transition-all backdrop-blur-sm bg-white/60"
          >
            <ArrowLeft size={20} />
            <span className="font-medium text-sm">Voltar ao Menu</span>
          </button>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center w-full max-w-lg space-y-6 mt-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
            className="space-y-3 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
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
                <Sparkles size={28} className="text-blue-600" />
              </motion.div>
              <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">DocPrint</h1>
            </div>
            <p className="text-neutral-600 text-base leading-relaxed max-w-md">
              Digitalização e composição de documentos em A4.
            </p>
          </motion.div>

          {/* Drop Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
            className="w-full"
          >
            <FileInput onFilesSelected={handleFilesSelected} multiple>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full aspect-square max-h-[300px] border-2 border-dashed border-blue-300 rounded-3xl flex flex-col items-center justify-center bg-white/70 backdrop-blur-xl relative overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl hover:border-blue-500 transition-all select-none"
                onContextMenu={handleContextMenu}
                role="button"
                aria-label="Selecionar imagens para upload"
                tabIndex={0}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg mb-5 relative z-10"
                >
                  <FileImage className="w-16 h-16 text-white" />
                </motion.div>

                <div className="text-neutral-600 font-medium px-6 text-center relative z-10 flex flex-col items-center gap-2">
                  <span className="text-lg font-semibold text-neutral-800">Toque para selecionar</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handlePasteFromMenu();
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors z-30 cursor-pointer"
                    aria-label="Colar imagem da área de transferência"
                  >
                    ou clique para colar (Ctrl+V)
                  </button>
                </div>
              </motion.div>
            </FileInput>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
            className="flex flex-col w-full gap-3"
          >
            <FileInput onFilesSelected={handleFilesSelected} multiple>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => haptics.light()}
              >
                <Button fullWidth variant="primary" className="h-14 text-lg shadow-xl shadow-blue-500/30 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" aria-label="Fazer upload de imagens">
                  <Upload className="w-6 h-6 mr-3" />
                  Upload
                </Button>
              </motion.div>
            </FileInput>

            <FileInput onFilesSelected={handleFilesSelected} capture="environment">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => haptics.light()}
              >
                <Button fullWidth variant="secondary" className="h-14 text-lg bg-white border-2 border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-lg" aria-label="Capturar foto com câmera">
                  <Camera className="w-6 h-6 mr-3" />
                  Câmera
                </Button>
              </motion.div>
            </FileInput>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-6 pb-4"
        >
          <p className="text-xs text-neutral-400 font-medium tracking-wide">
            Desenvolvido por <span className="text-blue-600 font-semibold">Vinicius Dev</span>
          </p>
        </motion.div>

        {/* Mobile Bottom Navigation Spacer - Critical for content visibility */}
        <div className="md:hidden h-28 w-full flex-shrink-0" aria-hidden="true" />
      </div>

      {/* Context Menu */}
      {/* Context Menu (Desktop) */}
      {menuPosition && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden min-w-[180px] hidden md:block"
            style={{ top: menuPosition.y, left: menuPosition.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { haptics.light(); handlePasteFromMenu(); }}
              className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-blue-50 active:bg-blue-100 text-neutral-700 font-medium transition-colors"
            >
              <ClipboardPaste size={20} className="text-blue-600" />
              Colar Imagem
            </button>
          </motion.div>

          {/* Bottom Sheet (Mobile) */}
          <BottomSheet
            isOpen={!!menuPosition}
            onClose={() => setMenuPosition(null)}
            title="Opções"
          >
            <button
              onClick={() => { haptics.light(); handlePasteFromMenu(); }}
              className="w-full text-left px-4 py-4 flex items-center gap-4 hover:bg-neutral-50 active:bg-blue-50 text-neutral-700 font-medium transition-colors border-b border-neutral-100 last:border-0"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <ClipboardPaste size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-neutral-900">Colar Imagem</span>
                <span className="text-xs text-neutral-500">Da área de transferência</span>
              </div>
            </button>
          </BottomSheet>
        </>
      )}
    </div>
  );
};