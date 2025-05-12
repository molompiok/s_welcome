// renderer/Layout.tsx
export { Layout };

import './Layout.css';
import React, { useEffect, useState, useMemo } from 'react';
import { PageContextProvider, usePageContext } from './usePageContext';
import type { PageContext } from 'vike/types';
import '../Lib/i18n';
import { ClientCall } from '../Components/Utils/functions'; // Gardé si utilisé ailleurs, sinon à retirer si non
import { useHashWatcher } from '../Hooks/useHashWatcher';
import { useTranslation } from 'react-i18next';
import { useChildViewer } from '../Components/ChildViewer/useChildViewer';
import {Header} from '../Components/Layout/Header'; // Nouveau
import {Footer} from '../Components/Layout/Footer'; // Nouveau
import { Toaster } from 'react-hot-toast'; // Pour afficher les notifications toast
import { SublymusServerApiProvider } from '../api/ReactSublymusServer';
import { Server_Host } from './+config';

function Layout({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  const { t } = useTranslation(); // t est déjà là
  const serverApiUrl = Server_Host; // Exemple de variable d'env

  if (!serverApiUrl) {
    console.error("VITE_SUBLYMUS_SERVER_URL is not defined in environment variables.");
    // Gérer l'erreur, peut-être afficher un message à l'utilisateur ou retourner un fallback
    return <div>Erreur de configuration serveur. Veuillez contacter le support.</div>;
  }

  // Pour la landing page, la plupart des appels serveur n'auront pas besoin de token
  const getDummyAuthToken = () => null;

  const handleServerUnauthorized = (action: 'server', token?: string) => {
    console.warn(`Unauthorized server action for s_welcome. Action: ${action}, Token used: ${!!token}`);
  };

  return (
    <React.StrictMode>
        <SublymusServerApiProvider
          serverUrl={serverApiUrl}
          getAuthToken={getDummyAuthToken}
          handleUnauthorized={handleServerUnauthorized}
        >
          <PageContextProvider pageContext={pageContext}>
            <div className="flex flex-col min-h-screen bg-white">
              <Header />
              <Frame>
                {children}
              </Frame>
              <Footer />
            </div>
            <OpenChild />
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              toastOptions={{ duration: 5000 }}
            />
          </PageContextProvider>
        </SublymusServerApiProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </React.StrictMode>
  );
}

// --- Composant OpenChild (Popup/Modal Global) ---
// Reste identique à ton code

function OpenChild() {
  const { currentChild, alignItems, background, justifyContent, openChild, blur } = useChildViewer();
  const hash = useHashWatcher();

  useEffect(() => {
    if (!currentChild && location.hash === "#openChild") {
      ClientCall(() => {
        history.back();
        openChild(null);
      });
    }
    if (location.hash !== "#openChild" && currentChild) { // S'assurer que openChild(null) n'est appelé que si currentChild existe
      openChild(null);
    }
  }, [currentChild, hash, openChild]); // Ajout de openChild aux dépendances

  const flexAlignment = useMemo(() => {
    const items = alignItems === 'start' ? 'items-start' : alignItems === 'end' ? 'items-end' : 'items-center';
    const justify = justifyContent === 'left' ? 'justify-start' : justifyContent === 'right' ? 'justify-end' : justifyContent === 'space-between' ? 'justify-between' : 'justify-center';
    return `${items} ${justify}`;
  }, [alignItems, justifyContent]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex transition-opacity duration-300 ${currentChild && hash === '#openChild' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <div
        className="absolute inset-0"
        style={{ background: background || 'rgba(0,0,0,0.4)' }}
        onClick={(e) => { if (e.currentTarget === e.target) openChild(null) }}
      ></div>
      <div className={`relative w-full h-full flex ${flexAlignment}`}>
        <div className={`transition-transform w-full flex h-full  ${flexAlignment} duration-300 ease-out ${currentChild && hash === '#openChild' ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {currentChild}
        </div>
      </div>
    </div>
  );
}


// --- Composant Frame ---
function Frame({ children }: { children: React.ReactNode }) {
  const { blur } = useChildViewer();
  return (
    <main // Changé en <main> pour la sémantique
      className="flex-grow w-full transition-filter duration-300" // flex-grow pour prendre l'espace, retiré mx-auto et max-w-7xl (sera géré par page/section)
      style={{ filter: blur ? `blur(${blur}px)` : 'none' }}
    >
      {children}
    </main>
  );
}