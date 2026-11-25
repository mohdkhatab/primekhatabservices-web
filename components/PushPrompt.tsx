"use client";

import { useEffect, useState } from "react";

const API_BASE = "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";
const VAPID_PUBLIC_KEY =
  "BLHEfqX-Bm_ldK51CTLdTQ_AGPTq_th6VKzlECQTTT2v43GRTcP28JdZKu9OgYcWt7sWIRN4dIk-uC-wPCBXzxY";
const DISMISS_KEY = "pkd-push-dismissed";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function subscribeToPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
    }
    const res = await fetch(`${API_BASE}/push/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * PushPrompt — asks for notification permission shortly after the site opens.
 * If permission is already granted, it silently refreshes the subscription.
 * Plain card per UI_SPEC: white, 1px border, flat blue button, no gradients.
 */
export default function PushPrompt() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "granted") {
      subscribeToPush();
      return;
    }
    if (Notification.permission !== "default") return;
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // storage unavailable — still show the prompt once
    }
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const enable = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await subscribeToPush();
      setDone(true);
      setTimeout(() => setVisible(false), 2500);
    } else {
      dismiss();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:max-w-sm">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
        {done ? (
          <p className="text-sm font-semibold text-slate-900">
            Done — you will get a notification whenever a new deal or promo code is added.
          </p>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-900">Get new deal alerts</p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
              Allow notifications and we will send a push to your browser the moment a new
              promo code or deal is posted. No spam — deals only.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={enable}
                className="flex h-10 flex-1 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Allow Notifications
              </button>
              <button
                onClick={dismiss}
                className="flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Not now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
