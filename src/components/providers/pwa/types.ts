export interface PWAProviderProps {
  children: React.ReactNode;
}

// Type for the BeforeInstallPromptEvent
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
