import React, { useState } from 'react';
import { ViewState, DocImage } from '../types';
import { UploadView } from './UploadView';
import { EditorView } from './EditorView';
import { ComposerView } from './ComposerView';

interface DocPrintAppProps {
  onBack: () => void;
}

export const DocPrintApp: React.FC<DocPrintAppProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>('HOME');
  const [sessionImages, setSessionImages] = useState<DocImage[]>([]);
  const [isAddingMore, setIsAddingMore] = useState(false); // Track if we came from Composer

  // Upload Queue: To handle multiple files being processed one by one
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);

  // Flow Logic
  const handleUpload = (files: File[]) => {
    if (files.length === 0) return;
    setUploadQueue(files);
    setView('EDITOR');
    setIsAddingMore(false); // Reset after uploading
  };

  const handleEditorComplete = (processedImage: DocImage) => {
    setSessionImages(prev => [...prev, processedImage]);

    // Remove processed file from queue
    setUploadQueue(prev => {
      const remaining = prev.slice(1);

      // If there are more files, stay in EDITOR with next file
      if (remaining.length > 0) {
        return remaining;
      } else {
        // Queue finished
        setView('COMPOSER');
        return [];
      }
    });
  };

  const handleEditorCancel = () => {
    // Skip current file
    setUploadQueue(prev => {
      const remaining = prev.slice(1);
      if (remaining.length > 0) return remaining;

      // If queue empty, go to check where to land
      if (sessionImages.length > 0) {
        setView('COMPOSER');
      } else {
        setView('HOME');
        setIsAddingMore(false);
      }
      return [];
    });
  };

  const handleAddMore = () => {
    setIsAddingMore(true); // Mark that we're adding more
    setView('HOME');
  };

  // Handle cancel when adding more - return to Composer
  const handleCancelAddMore = () => {
    if (isAddingMore && sessionImages.length > 0) {
      setIsAddingMore(false);
      setView('COMPOSER');
    } else {
      onBack();
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setSessionImages(prev => prev.filter(img => img.id !== imageId));
  };

  // If in HOME view, back goes to Dashboard. Otherwise standard flow logic.
  const handleBackNavigation = () => {
    if (view === 'HOME') {
      onBack();
    } else if (view === 'EDITOR') {
      handleEditorCancel();
    } else if (view === 'COMPOSER') {
      // Clear session if user goes back to upload screen to prevent "ghost" previous session
      setSessionImages([]);
      setView('HOME');
    }
  };

  return (
    <div className="w-full h-full bg-white text-neutral-800 font-sans">
      {view === 'HOME' && (
        <UploadView onUpload={handleUpload} onBack={handleCancelAddMore} />
      )}

      {/* Editor always processes the first item in the queue */}
      {view === 'EDITOR' && uploadQueue.length > 0 && (
        <EditorView
          key={uploadQueue[0].name} // Force re-mount on file change
          file={uploadQueue[0]}
          onCancel={handleEditorCancel}
          onComplete={handleEditorComplete}
        />
      )}

      {view === 'COMPOSER' && (
        <ComposerView
          images={sessionImages}
          onAddMore={handleAddMore}
          onBack={handleBackNavigation} // Use the resetting back handler
          onRemoveImage={handleRemoveImage}
        />
      )}
    </div>
  );
};