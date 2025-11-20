import { useEffect, useState } from 'react';
import SearchModal from './SearchModal';

export default function SearchModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleToggle(event: CustomEvent) {
      setIsOpen(event.detail.isOpen);
    }

    // @ts-ignore
    window.addEventListener('toggle-search-modal', handleToggle);
    
    return () => {
      // @ts-ignore
      window.removeEventListener('toggle-search-modal', handleToggle);
    };
  }, []);

  function handleClose() {
    setIsOpen(false);
    // Notify global state that modal is closed
    window.dispatchEvent(new CustomEvent('search-modal-closed'));
  }

  return <SearchModal isOpen={isOpen} onClose={handleClose} />;
}

