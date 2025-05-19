export const LoadingSpinner = () => (
  <div className="spinner-container" aria-busy="true" aria-label="Loading">
    <div className="spinner" />
  </div>
);

// CSS-пример для спиннера (можно добавить в CSS-модуль)
/*
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #09f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
*/