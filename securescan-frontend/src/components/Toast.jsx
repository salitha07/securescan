import { AnimatePresence, motion } from "framer-motion";

const toastStyles = `
.ss-toast-wrap {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1000;
    width: min(380px, calc(100vw - 32px));
}

.ss-toast {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 13px;
    padding: 16px 42px 16px 16px;
    border-radius: 14px;
    background: rgba(10, 18, 35, 0.96);
    backdrop-filter: blur(18px);
    box-shadow: 0 18px 55px rgba(0, 0, 0, 0.45);
}

.ss-toast.success {
    border: 1px solid rgba(0, 229, 255, 0.28);
}

.ss-toast.error {
    border: 1px solid rgba(248, 113, 113, 0.3);
}

.ss-toast-icon {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 800;
}

.ss-toast.success .ss-toast-icon {
    color: #06101D;
    background: linear-gradient(135deg, #22D3EE, #8B5CF6);
}

.ss-toast.error .ss-toast-icon {
    color: #FEE2E2;
    background: rgba(239, 68, 68, 0.18);
    border: 1px solid rgba(248, 113, 113, 0.25);
}

.ss-toast-content {
    min-width: 0;
    padding-top: 1px;
}

.ss-toast-title {
    color: #F1F5F9;
    font-size: 14px;
    font-weight: 700;
}

.ss-toast-message {
    color: #94A3B8;
    font-size: 12px;
    line-height: 1.5;
    margin-top: 3px;
}

.ss-toast-close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 26px;
    height: 26px;
    border: none;
    border-radius: 7px;
    color: #64748B;
    background: transparent;
    cursor: pointer;
    font-size: 17px;
}

.ss-toast-close:hover {
    color: #E2E8F0;
    background: rgba(255, 255, 255, 0.06);
}

@media (max-width: 520px) {
    .ss-toast-wrap {
        top: 16px;
        right: 16px;
    }
}
`;

export default function Toast({ toast, onClose }) {
    return (
        <>
            <style>{toastStyles}</style>

            <div
                className="ss-toast-wrap"
                aria-live="polite"
                aria-atomic="true"
            >
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            className={`ss-toast ${toast.type}`}
                            initial={{
                                opacity: 0,
                                x: 40,
                                scale: 0.96
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                scale: 1
                            }}
                            exit={{
                                opacity: 0,
                                x: 30,
                                scale: 0.97
                            }}
                            transition={{ duration: 0.24 }}
                            role={toast.type === "error" ? "alert" : "status"}
                        >
                            <div className="ss-toast-icon">
                                {toast.type === "success" ? "✓" : "!"}
                            </div>

                            <div className="ss-toast-content">
                                <div className="ss-toast-title">
                                    {toast.title}
                                </div>

                                <div className="ss-toast-message">
                                    {toast.message}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="ss-toast-close"
                                onClick={onClose}
                                aria-label="Close notification"
                            >
                                ×
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}